import FreeTransfer from '../../lib/index.js';

const Transfert = new FreeTransfer({
    availability: 14,
    password: 'password',
    path: './test/fixtures/test.dev'
})

Transfert.upload().then((response) => {
    console.log('Upload successful!');
    console.log('Transfer Key:', response.transferKey);
    console.log('Download URL:', response.downloadUrl);
    console.log('Delete Key:', response.deleteKey);
}).catch((error) => {
    console.error('Upload failed:', error);
});