import FreeTransfer from './lib/index.js';
import { Readable } from 'stream';
import fs from 'fs';

console.log('=== Free Transfer Upload Examples ===\n');

// Create test data file if it doesn't exist
if (!fs.existsSync('./test.dev')) {
    fs.writeFileSync('./test.dev', 'this works!');
}

// Example 1: Upload from file path
console.log('1. Uploading from file path...');
const fileTransfer = new FreeTransfer({
    availability: 14,
    password: 'password',
    path: './test.dev'
});

fileTransfer.upload().then((response) => {
    console.log('✅ File upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Download URL:', response.downloadUrl);
    console.log('   Delete Key:', response.deleteKey);
    console.log();
    
    // Example 2: Upload from buffer
    console.log('2. Uploading from buffer...');
    const testData = 'Hello from buffer! This is a test file created from a buffer.';
    const buffer = Buffer.from(testData, 'utf8');

    const bufferTransfer = new FreeTransfer({
        availability: 7,
        password: 'buffer-password',
        buffer: buffer,
        filename: 'test-buffer.txt',
        mimeType: 'text/plain'
    });

    return bufferTransfer.upload();
}).then((response) => {
    console.log('✅ Buffer upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Download URL:', response.downloadUrl);
    console.log('   Delete Key:', response.deleteKey);
    console.log();
    
    // Example 3: Upload from stream
    console.log('3. Uploading from stream...');
    const streamData = 'Hello from stream! This is a test file created from a readable stream.';
    const stream = new Readable({
        read() {
            this.push(streamData);
            this.push(null); // End the stream
        }
    });

    const streamTransfer = new FreeTransfer({
        availability: 2,
        password: 'stream-password',
        stream: stream,
        filename: 'test-stream.txt',
        size: Buffer.byteLength(streamData, 'utf8'),
        mimeType: 'text/plain'
    });

    return streamTransfer.upload();
}).then((response) => {
    console.log('✅ Stream upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Download URL:', response.downloadUrl);
    console.log('   Delete Key:', response.deleteKey);
    console.log();
    console.log('🎉 All upload methods working successfully!');
    console.log('\n📝 Note: These are real uploads to Free Transfer service.');
    console.log('   You can visit the download URLs to verify the uploads worked.');
}).catch((error) => {
    console.error('❌ Upload failed:', error.message || error);
    process.exit(1);
});
