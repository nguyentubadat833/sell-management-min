import {EventHandlerRequest, H3Event} from "h3";
import _ from "lodash";
import randomstring from "randomstring";
import path from "node:path";
import fs from "fs";
import https from "https";
import prisma from "~/lib/prisma";

export default async function (event: H3Event<EventHandlerRequest>, location: string): Promise<number[]> {
    const {files, urls} = await readBody(event)
    const result: number[] = []
    if (_.isArray(urls)) {
        const root = useRuntimeConfig().app.fileStorageRoot
        const imagePromises = urls.map((url) => {
            return new Promise(async (resolve, reject) => {
                const extension = url.split('.').pop().split('?')[0];
                const name = randomstring.generate({
                    length: 10,
                    charset: 'alphabetic',
                }) + `.${extension}`;
                const filePath = path.join(root, location, name);
                const fileStream = fs.createWriteStream(filePath);
                https.get(url, (response) => {
                    response.pipe(fileStream);
                    fileStream.on('finish', async () => {
                        fileStream.close();
                        console.log(`Image downloaded as ${name}`);
                        try {
                            const newImage = await prisma.image.create({
                                data: {
                                    name: name,
                                    location: '/product',
                                    uploadBy: await getUserIdLogged(event),
                                }
                            });
                            console.log('Saved the image to database: ', newImage.name);
                            result.push(newImage.id);
                            resolve(newImage.id);
                        } catch (error) {
                            console.log('An error occurred while saving the image to the database')
                            unlinkImage(filePath)
                            reject(error);
                        }
                    });
                }).on('error', (err) => {
                    console.error(`Error downloading image: ${err.message}`);
                    console.log('Delete error images ...')
                    unlinkImage(filePath)
                    reject(err);
                });
            });
        });
        await Promise.all(imagePromises);
    }

    for (const file of files) {
        const image = await storeFileLocally(
            file,
            10,
            location
        )
        const newImage = await prisma.image.create({
            data: {
                name: image,
                location: location,
                uploadBy: await getUserIdLogged(event)
            }
        })
        console.log('Uploaded: ', newImage.name)
        result.push(newImage.id)
    }
    return result
}

function unlinkImage(filePath: string) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('An error occurred while deleting the file: ', err);
        } else {
            console.log('Deleted');
        }
    });
}