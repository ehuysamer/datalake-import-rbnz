import statusService from '../services/status.service.js';
import HTTP_STATUS_OK from '../consts/httpStatus.js';
import DEFAULT_HEADERS_JSON from '../consts/headers.js';

export async function handler(event, context) {
    const result = statusService();

    return {
        statusCode: HTTP_STATUS_OK,
        body: JSON.stringify(result),
        headers: DEFAULT_HEADERS_JSON,
        isBase64Encoded: false
    };
};

