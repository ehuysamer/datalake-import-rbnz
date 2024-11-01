import getConfig from '../config/index.js';
import { DateTime } from 'luxon';
import { RBNZ } from '../consts/source.js';
import { LICENSE_ATTRIBUTION } from '../consts/license.js';

const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    return randomNumber.toString().padStart(5, '0');
};

export default async () => {
    const config = await getConfig();

    const now = DateTime.now();

    const timestamp = now.setZone(config.timezone).toFormat(config.timestampFormat);
    const random = generateRandomNumber();
    const key = `${timestamp}-${random}`;

    const metadata = {
        trace: key,
        source: RBNZ,
        license: LICENSE_ATTRIBUTION, //https://www.rbnz.govt.nz/about-our-site/terms-of-use
        dateTime: now.setZone(config.timezone).toISO(),
    }

    return metadata;
}