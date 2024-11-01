import { MIME_JSON } from '../consts/mime.js';
import { HEADER_CONTENT_TYPE } from '../consts/headers.js';
import { HTTP_STATUS_OK } from '../consts/httpStatus.js';
import downloadOcrService from '../services/downloadOcr.service.js';

export async function handler(event, context) {
    await downloadOcrService();

    const result = {
        message: 'OCR downloaded successfully'
    };

    return {
        statusCode: HTTP_STATUS_OK,
        body: JSON.stringify(result),
        headers: {
            HEADER_CONTENT_TYPE: MIME_JSON
        },
        isBase64Encoded: false
    };
};

