import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import fileUpload from "express-fileupload";

require('dotenv/config')

const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const app = express();
app.use([
    fileUpload(),
    bodyParser.json(),
    bodyParser.urlencoded({
        extended: false
    }),
    (err: any, req: any, res: any, next: any) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    }
])

app.post('/upload', async (req: Request, res: Response) => {
    console.log(req.files?.testfile)

    s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME || "bucket",
            Key: req.files?.testfile?.name || "noname",
            Body: req.files?.testfile?.data
        },
        (error: Error, data: any) => {
        if (error){
            res.json({success: false, data: error})
        }

            res.json({success: true, data: data})
        })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
