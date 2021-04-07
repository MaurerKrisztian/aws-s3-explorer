import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import {FileController} from "./src/FileController";
require('dotenv/config')

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


const fileController = new FileController();

app.post('/upload', async (req: Request, res: Response) => {
    await fileController.uploadFile(req, res);
})

app.get('/files/:filename', async (req: any, res: any) => {
    await fileController.getFile(req, res, true);
})

app.get('/dir/', async (req: any, res: any) => {
    const result = await fileController.getFileList(req.query?.search || '');
    console.log(result, req.query?.search)
    res.json(result);
})

app.get('/files/stream/:filename', async (req: any, res: any) => {
    await fileController.getFile(req, res, false)
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
