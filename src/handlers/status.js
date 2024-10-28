import statusService from '../services/status.service.js';

export async function handler(event, context) {
    const result = statusService();

    return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
            'Content-Type': 'application/json'
        },
        isBase64Encoded: false
    };
};

