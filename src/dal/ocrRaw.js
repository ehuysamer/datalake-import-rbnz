import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ErrorModel, { ERROR_UNDEFINED } from '../model/errorModel.js';
import getConfig from '../config/index.js';
import { MIME_JSON, MIME_HTML } from '../consts/mime.js';

const s3Client = new S3Client();

export async function putOcrRaw(content, key, metadata) {
    console.log('DAL:OCR-RAW');
    const config = await getConfig();

    const path = 'finance-dev/rbnzocr/downloads';

    try {
        const paramsBody = {
            Bucket: config.bucketName,
            Key: `${path}/${key}.html`,
            Body: Buffer.from(JSON.stringify(content)),
            ContentType: MIME_HTML,
        };
        console.log('S3:PUT', key, typeof (content));
        const commandBody = new PutObjectCommand(paramsBody);
        await s3Client.send(commandBody);
    }
    catch (err) {
        throw new ErrorModel('ERR-DLRB-003', ERROR_UNDEFINED, 'Error storing downloaded data', err, {
            message: err.message
        });
    }

    try {
        const paramsMeta = {
            Bucket: config.bucketName,
            Key: `${path}/${key}.meta.json`,
            Body: Buffer.from(metadata),
            ContentType: MIME_JSON,
        };
        console.log('S3:PUT', key, '(metadata)', typeof (metadata));
        const commandMeta = new PutObjectCommand(paramsMeta);
        await s3Client.send(commandMeta);
    }
    catch (err) {
        throw new ErrorModel('ERR-DLRB-004', ERROR_UNDEFINED, 'Error storing metadata', err, {
            message: err.message
        });
    }
}
