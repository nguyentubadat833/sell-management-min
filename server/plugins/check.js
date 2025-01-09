import {PrismaClient} from "@prisma/client";
import chalk from "chalk";
export default defineNitroPlugin(async (nitroApp) => {
    const prisma = new PrismaClient()
    await prisma.$connect().then(() => {
        console.log(chalk.green('Connected database'));
    }).catch((error) => {
        console.error(chalk.red('Failed to connect database:'), error);
    });
})