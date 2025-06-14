import FreeTransfer from '../../lib/index.js';
import { Readable } from 'stream';

// Test with stream - simpler approach
const testData = 'Hello from stream! This is a test file created from a readable stream.';

// Create a simple readable stream
const stream = new Readable({
    read() {
        this.push(testData);
        this.push(null); // End the stream
    }
});

console.log('Creating transfer with stream...');

const transfert = new FreeTransfer({
    availability: 14,
    password: 'password', 
    stream: stream,
    filename: 'test-stream.txt',
    size: Buffer.byteLength(testData, 'utf8'),
    mimeType: 'text/plain'
});

console.log('Starting upload...');

transfert.upload().then((response) => {
    console.log('Stream upload successful!');
    console.log('Transfer Key:', response.transferKey);
    console.log('Download URL:', response.downloadUrl);
    console.log('Delete Key:', response.deleteKey);
}).catch((error) => {
    console.error('Stream upload failed:', error);
});
