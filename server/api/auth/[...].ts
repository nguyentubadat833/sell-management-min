import {NuxtAuthHandler} from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from "~/lib/prisma";
import {EUserType, IUserProfile} from "~/types/TUser";

export default NuxtAuthHandler({
    secret: useRuntimeConfig().auth.secret,
    providers: [
        GoogleProvider.default({
            clientId: useRuntimeConfig().auth.google.id,
            clientSecret: useRuntimeConfig().auth.google.secret
        })
    ],
    callbacks: {
        /* on before signin */
        async signIn({user, account, profile, email, credentials}) {
            if (user && user?.id) {
                await prisma.user.upsert({
                    where: {
                        googleId: user.id
                    },
                    create: {
                        googleId: user.id,
                        email: user.email,
                        info: JSON.stringify({
                            name: user.name,
                            avatar: user?.image
                        } as IUserProfile),
                        userType: EUserType.CUSTOMER,
                        createdBy: EUserType.SYSTEM
                    },
                    update: {}
                })
                console.log('user', user)
                console.log('account', account)
                console.log('profile', profile)
                console.log('email', email)
                console.log('credentials', credentials)
                return true
            } else {
                return false
            }
        },
        /* on redirect to another url */
        async redirect({url, baseUrl}) {
            return baseUrl
        },
        /* on session retrival */
        async session({session, user, token}) {
            return session
        },
        /* on JWT token creation or mutation */
        async jwt({token, user, account, profile, isNewUser}) {
            return token
        }
    },
    events: {
        async signIn(message) { /* on successful sign in */
        },
        async signOut(message) { /* on signout */
        },
        async createUser(message) { /* user created */
        },
        async updateUser(message) { /* user updated - e.g. their email was verified */
        },
        async linkAccount(message) { /* account (e.g. GitHub) linked to a user */
        },
        async session(message) { /* session is active */
        },
    },
    pages: {
        signIn: '/auth/signIn',
        signOut: '/auth/signOut',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: '/auth/new-user'
    }
})