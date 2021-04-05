import AWS from "aws-sdk";

export class S3Config {
    static getS3(): AWS.S3 {
        return new AWS.S3({
            apiVersion: "2006-03-01",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
    }
}
