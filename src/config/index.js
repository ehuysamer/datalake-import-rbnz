import fs from 'fs/promises';
import path from 'path';

async function loadConfigFile(configFile) {
    const configPath = path.join('src', configFile);
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config;
}

let _configCached = null;

export default async () => {
    //const env = process.env['ENV'];
    //const configFile = `${instance}-${env}.infra.json`;
    if (_configCached) {
        console.log('CONFIG:Cached');
    }
    else {
        console.log('CONFIG:Loading...');
    }

    _configCached = _configCached || await loadConfigFile('config/config.json');

    return _configCached;
}
