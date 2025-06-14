import FreeTransfer from '../../lib/index.js';

// Test with buffer
const testData = 'Hello from buffer! This is a test file created from a buffer.';
const buffer = Buffer.from(testData, 'utf8');

const transfert = new FreeTransfer({
    availability: 14,
    password: 'password',
    buffer: buffer,
    filename: 'test-buffer.txt',
    mimeType: 'text/plain'
});

transfert.upload().then((response) => {
    console.log('Buffer upload successful!');
    console.log('Transfer Key:', response.transferKey);
    console.log('Download URL:', response.downloadUrl);
    console.log('Delete Key:', response.deleteKey);
}).catch((error) => {
    console.error('Buffer upload failed:', error);
});
