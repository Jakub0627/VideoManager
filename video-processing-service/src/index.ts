import express, { Request, Response, NextFunction } from 'express';
import { convertVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo, deleteRawVideo, deleteProcessedVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());


// WORK COMMENT - this part needed excessive fixing due to wrong '(req, res)' handling. If there are any problems in the future consider checking this part.
app.post(
  '/process-video',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = Buffer.from(req.body.message.data, 'base64').toString();
      const data = JSON.parse(message);
      if (!data.name) throw new Error('Brak nazwy pliku');

      const inputFileName = data.name;
      const outputFileName = `processed-${inputFileName}`;

      await downloadRawVideo(inputFileName);
      await convertVideo(inputFileName, outputFileName);
      await uploadProcessedVideo(outputFileName);

      // sprzątanie
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
      ]);

      res.status(200).send('Processing finished successfully.');
    } catch (err) {
      next(err);
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});
