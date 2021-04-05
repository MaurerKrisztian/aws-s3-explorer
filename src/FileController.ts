import {Request, Response} from "express";
import {S3Config} from "./S3Config";

export class FileController {
    s3: AWS.S3 = S3Config.getS3();

    uploadFile(req: Request, res: Response) {
        if (!req.files?.testfile) {
            res.send('file not found');
        }
        const file = req.files?.testfile as any
        this.s3.upload({
                ACL: 'public-read',
                Bucket: process.env.AWS_BUCKET_NAME || "bucket",
                Key: file.name || "noname",
                Body: file.data
            },
            (error: Error, data: any) => {
                if (error) {
                    res.json({success: false, data: error})
                }

                res.json({success: true, data: data})
            })
    }


    async getFile(req: Request, res: Response, isDownload: boolean) {
        const filename: string = req.params.filename;

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
