import FreeTransfer, { TransfertDelete } from '../../lib/index.js';

console.log('=== Free Transfer Delete Test ===\n');

// First, create an upload to test deletion
console.log('1. Creating a test upload...');
const testData = 'This is a test file that will be deleted.';
const buffer = Buffer.from(testData, 'utf8');

const transfer = new FreeTransfer({
    availability: 1, // 1 day availability for testing
    password: 'test-password',
    buffer: buffer,
    filename: 'delete-test.txt',
    mimeType: 'text/plain'
});

transfer.upload().then((response) => {
    console.log('✅ Upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Download URL:', response.downloadUrl);
    console.log('   Delete Key:', response.deleteKey);
    console.log();

    // Test Method 1: Delete using the same instance that uploaded
    console.log('2. Deleting using instance method...');
    return transfer.delete();
}).then((deleteResponse) => {
    console.log('✅ Delete successful using instance method!');
    console.log('   Response:', deleteResponse);
    console.log();

    // Test Method 2: Create another upload and delete using static method
    console.log('3. Creating another test upload for static delete...');
    const anotherBuffer = Buffer.from('Another test file for static deletion.', 'utf8');
    
    const anotherTransfer = new FreeTransfer({
        availability: 1,
        password: 'test-password-2',
        buffer: anotherBuffer,
        filename: 'static-delete-test.txt',
        mimeType: 'text/plain'
    });

    return anotherTransfer.upload();
}).then((response) => {
    console.log('✅ Second upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Delete Key:', response.deleteKey);
    console.log();

    // Delete using static method
    console.log('4. Deleting using static method...');
    return TransfertDelete.delete(response.transferKey, response.deleteKey);
}).then((deleteResponse) => {
    console.log('✅ Delete successful using static method!');
    console.log('   Response:', deleteResponse);
    console.log();
    console.log('🎉 All delete methods working successfully!');
}).catch((error) => {
    console.error('❌ Test failed:', error.response?.data || error.message);
});
