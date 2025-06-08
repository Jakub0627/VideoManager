// 1. GCS (google file storage) file interactions
// 2. Local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "web-raw-videos";
const processedVideoBucketName = "web-processed-videos";

const localRawVideoPath = "./raw-Videos";
const localProcessedVideoPath = "./processed-videos"

/**
 * Creates the local directories for raw and processed videos
 */

export function setupDirectories() {

}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPatch}
 * @returns A promise that resolves when the video has been converted.
 */


export function convertVideo(rawVideoName: string, proocessedVideoName: string){
    return new Promise<void>((resolve, reject) =>{
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOption("-vf", "scale=640:360") // 360p resolution
        .on("end", () => {
            console.log("Processing finished successfully.");
            resolve();
        })
        .on("error", (err) => {
            console.error(`An error occurred: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${proocessedVideoName}`);
    })
}


/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into {@link localRawVIdeoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
      .file(fileName)
      .download({ destination: `${localRawVideoPath}/${fileName} `});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    )
}

/**
 * @param fileName - The name of the file to uplad from the
 * {@link localProcessedVideoPatch} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`,{
        destination: fileName
    });
    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    )

    await bucket.file(fileName).makePublic();
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file at ${filePath}`, err);
            reject(err);
          } else {
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      } else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
  }

  // 16:30 + sprawdź linie kodu - coś się nie zgadza