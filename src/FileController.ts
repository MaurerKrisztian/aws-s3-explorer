import {Request, Response} from "express";
import {S3Config} from "./S3Config";

export class FileController {
    s3: AWS.S3 = S3Config.getS3();

    uploadFile(req: Request, res: Response) {
        const dir: string = req.body.path || '/'
        if (!req.files?.testfile) {
            res.send('file not found');
        }
        const file = req.files?.testfile as any
        this.s3.upload({
                ACL: 'public-read',
                Bucket: process.env.AWS_BUCKET_NAME || "bucket",
                Key: dir + file.name || "noname",
                Body: file.data
            },
            (error: Error, data: any) => {
                if (error) {
                    res.json({success: false, data: error})
                }

                res.json({success: true, data: data})
            })
    }

    async getFileList(dir: string = '') {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME || "",
                Delimiter: '/',
                Prefix: dir
            }

            this.s3.listObjects(params, function (err, data) {
                if (err) reject(err);
                console.log(data);
                resolve(data);
            });

        })
    }


    async getFile(req: Request, res: Response, isDownload: boolean) {
        const filename: string = req.query?.key as string;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME || "test",
            Key: filename
        };
        await this.s3.getObject(params, function (err, data) {
            if (err) {
                res.status(err.statusCode as number).send(err.stack)
                return;
            }

            if (isDownload) {
                res.set("Content-Type", data.ContentType);
                res.set("Content-Disposition", 'attachment; filename="' + filename + '"');
            }
            res.end(data.Body)
        })
    }
}
