import axios from 'axios';

// Simple delete test with hardcoded values
const transferKey = '7iQuedn'; // From the previous test
const deleteKey = 'AcY88IW'; // From the previous test

console.log('Testing simple delete request...');
console.log('Transfer Key:', transferKey);
console.log('Delete Key:', deleteKey);

// Try different request data formats
const formats = [
    JSON.stringify({ deleteKey: deleteKey }),
    JSON.stringify({ key: deleteKey }),
    deleteKey,
    JSON.stringify(deleteKey)
];

async function testDelete(requestData, formatName) {
    console.log(`\nTesting format: ${formatName}`);
    console.log('Request Data:', requestData);
    console.log('Content Length:', requestData.length);

    try {
        const response = await axios({
            url: `https://api.scw.iliad.fr/freetransfert/v2/transfers/${transferKey}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Content-Length': requestData.length.toString(),
                'Origin': 'https://transfert.free.fr',
                'Referer': 'https://transfert.free.fr/'
            },
            data: requestData
        });
        
        console.log('✅ Delete successful!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Delete failed:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        return false;
    }
}

// Test each format
for (let i = 0; i < formats.length; i++) {
    const success = await testDelete(formats[i], `Format ${i + 1}`);
    if (success) break;
}
