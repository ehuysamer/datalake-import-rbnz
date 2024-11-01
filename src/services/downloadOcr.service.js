import getConfig from '../config/index.js'
import { getHttp } from '../dal/https.js';
import ErrorModel, { ERROR_UNDEFINED } from '../model/errorModel.js';
import { putOcrRaw } from '../dal/ocrRaw.js';
import generateMetaData from './generateMetaData.service.js';

export default async () => {
    let config;
    let url;
    let content;
    try {
        console.log('SERVICE:downloadOcr');
        config = await getConfig();
        url = config.urlOcrHistory;
        content = await getHttp(url);

        const metadata = await generateMetaData();
        const metadataJson = JSON.stringify(metadata);
        await putOcrRaw(content, metadata.trace, metadataJson);
        await putOcrRaw(content, 'current', metadataJson);

        console.log('RESPONSE', content);
    }
    catch (error) {
        throw new ErrorModel('ERR-DLRB-005', ERROR_UNDEFINED, 'Error downloading or storing OCR', error, {
            config,
            url,
            content
        });
    }
}