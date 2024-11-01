import axios from 'axios';

export default async function getOutboundIp() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    }
    catch (error) {
        throw new Error(`Failed to retrieve IP address: ${error.message}`);
    }
}