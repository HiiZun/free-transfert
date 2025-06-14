import FreeTransfer from '../../lib/index.js';
import axios from 'axios';

console.log('=== Fresh Upload and Delete Test ===\n');

// Create a fresh upload
console.log('1. Creating a fresh upload...');
const testData = 'Fresh test file for immediate deletion.';
const buffer = Buffer.from(testData, 'utf8');

const transfer = new FreeTransfer({
    availability: 1,
    password: 'test-password',
    buffer: buffer,
    filename: 'fresh-delete-test.txt',
    mimeType: 'text/plain'
});

transfer.upload().then(async (response) => {
    console.log('✅ Upload successful!');
    console.log('   Transfer Key:', response.transferKey);
    console.log('   Delete Key:', response.deleteKey);
    console.log();

    // Try immediate delete with raw axios
    console.log('2. Attempting immediate delete with axios...');
    
    const requestData = JSON.stringify({ deleteKey: response.deleteKey });
    
    try {
        const deleteResponse = await axios({
            url: `https://api.scw.iliad.fr/freetransfert/v2/transfers/${response.transferKey}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://transfert.free.fr',
                'Referer': 'https://transfert.free.fr/'
            },
            data: requestData
        });
        
        console.log('✅ Delete successful!');
        console.log('Response:', deleteResponse.data);
    } catch (error) {
        console.error('❌ Delete failed:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        
        // Wait a bit and try again
        console.log('\n3. Waiting 2 seconds and trying again...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            const deleteResponse2 = await axios({
                url: `https://api.scw.iliad.fr/freetransfert/v2/transfers/${response.transferKey}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://transfert.free.fr',
                    'Referer': 'https://transfert.free.fr/'
                },
                data: requestData
            });
            
            console.log('✅ Delete successful after waiting!');
            console.log('Response:', deleteResponse2.data);
        } catch (error2) {
            console.error('❌ Delete still failed after waiting:');
            console.error('Status:', error2.response?.status);
            console.error('Data:', error2.response?.data);
        }
    }
    
}).catch((error) => {
    console.error('❌ Upload failed:', error);
});
