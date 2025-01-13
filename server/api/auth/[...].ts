import {NuxtAuthHandler} from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from "~/lib/prisma";
import {Account, Prisma} from "@prisma/client"
import {EAuthProvider, EUserType, IUserProfile} from "~/types/TUser";

export default NuxtAuthHandler({
    secret: useRuntimeConfig().auth.secret,
    providers: [
        // @ts-ignore
        GoogleProvider.default({
            clientId: useRuntimeConfig().auth.google.id,
            clientSecret: useRuntimeConfig().auth.google.secret
        })
    ],
    callbacks: {
        /* on before signin */
        async signIn({user, account, profile, email, credentials}) {
            if (user && user?.id) {
                await prisma.account.upsert({
                    where: {
                        provider_providerAccountId: {
                            provider: EAuthProvider.GOOGLE,
                            providerAccountId: user.id
                        }
                    },
                    create: {
                        provider: EAuthProvider.GOOGLE,
                        providerAccountId: user.id,
                        email: user!.email,
                        userType: EUserType.CUSTOMER as string,
                        profile: {
                            name: user!.name,
                            avatar: user?.image,
                        } as IUserProfile as Prisma.JsonObject
                    },
                    update: {
                        profile: {
                            name: user?.name,
                            avatar: user?.image
                        } as IUserProfile as Prisma.JsonObject
                    }
                })
                // console.log('user', user)
                // console.log('account', account)
                // console.log('profile', profile)
                // console.log('email', email)
                // console.log('credentials', credentials)
                return true
            } else {
                return false
            }
        },
        /* on redirect to another url */
        async redirect({url, baseUrl}) {
            // console.log('url', url)
            // console.log('baseUrl', baseUrl)
            // return baseUrl
            return url
        },
        /* on session retrival */
        async session({session, user, token}) {
            // console.log('session', session)
            // console.log('user', user)
            // console.log('jwt', token)
            const emailSession = session?.user?.email
            let userData: Account | null
            let response = {
                ...session
            } as any
            if (emailSession) {
                userData = await prisma.account.findFirst({
                    where: {
                        provider: EAuthProvider.GOOGLE,
                        email: emailSession
                    }
                });
                if (userData) {
                    response = {
                        ...response,
                        userId: userData.id,
                        userType: userData.userType
                    }
                }
            }
            return response
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