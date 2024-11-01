import axios from 'axios';
//import fetch from 'node-fetch';
import ErrorModel, { ERROR_UNDEFINED } from '../model/errorModel.js';

export async function getHttp(url) {
    try {
        console.log('HTTP GET:', url);
        //const response = await fetch(url);
        const response = await axios.get(url);

        //if (!response.ok) {
        if (response.status !== 200) {
            throw new ErrorModel('ERR-DLRB-001', ERROR_UNDEFINED, 'Error accessing API', null, { url, statusCode: response.status, body: respnse.body, headers: response.headers });
        }

        //const data = await response.text();
        const data = response.data;

        console.log(`Response ${response.status}: ${data.length}bytes`);

        return data;
    }
    catch (error) {
        throw new ErrorModel('ERR-DLRB-002', ERROR_UNDEFINED, 'Error accessing API', error, { url });
    }
}
