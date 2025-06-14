import FreeTransfer, { TransfertDelete } from '../../lib/index.js';

console.log('=== Free Transfer Delete Test ===\n');

// First, upload a file to get transfer and delete keys
console.log('1. Uploading a test file...');
const testData = 'This file will be deleted shortly!';
const buffer = Buffer.from(testData, 'utf8');

const transfer = new FreeTransfer({
    availability: 1, // Only 1 day since we'll delete it
    password: 'test-password',
    buffer: buffer,
    filename: 'test-delete.txt',
    mimeType: 'text/plain'
});

transfer.upload().then((response) => {
    console.log('✅ Upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Download URL:', response.downloadUrl);
    console.log('   Delete Key:', response.deleteKey);
    console.log();
    
    // Method 1: Delete using the same instance
    console.log('2. Deleting using the same transfer instance...');
    return transfer.delete();
}).then((deleteResponse) => {
    console.log('✅ Delete successful (Method 1):', deleteResponse.message);
    console.log();
    
    // Method 2: Upload another file and delete using separate class
    console.log('3. Uploading another test file...');
    const buffer2 = Buffer.from('Another test file for deletion', 'utf8');
    const transfer2 = new FreeTransfer({
        availability: 1,
        password: 'test-password-2',
        buffer: buffer2,
        filename: 'test-delete-2.txt'
    });
    
    return transfer2.upload();
}).then((response2) => {
    console.log('✅ Second upload successful!');
    console.log('   Transfer Key:', response2.transferKey);
    console.log('   Delete Key:', response2.deleteKey);
    console.log();
      // Method 2: Delete using TransfertDelete class
    console.log('4. Deleting using TransfertDelete class...');
    const deleter = new TransfertDelete({
        transferKey: response2.transferKey,
        deleteKey: response2.deleteKey
    });
    
    return deleter.delete();
}).then((deleteResponse2) => {
    console.log('✅ Delete successful (Method 2):', deleteResponse2.message);
    console.log();
    
    // Method 3: Upload another file and delete using static method
    console.log('5. Uploading a third test file...');
    const buffer3 = Buffer.from('Third test file for static deletion', 'utf8');
    const transfer3 = new FreeTransfer({
        availability: 1,
        buffer: buffer3,
        filename: 'test-delete-3.txt'
    });
    
    return transfer3.upload();
}).then((response3) => {
    console.log('✅ Third upload successful!');
    console.log('   Transfer Key:', response3.transferKey);
    console.log('   Delete Key:', response3.deleteKey);
    console.log();
    
    // Method 3: Delete using static method
    console.log('6. Deleting using static method...');
    return TransfertDelete.delete(response3.transferKey, response3.deleteKey);
}).then((deleteResponse3) => {
    console.log('✅ Delete successful (Method 3):', deleteResponse3.message);
    console.log();
    console.log('🎉 All deletion methods working successfully!');
}).catch((error) => {
    console.error('❌ Test failed:', error.message);
});
