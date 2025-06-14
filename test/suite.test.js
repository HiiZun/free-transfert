import FreeTransfer, { TransfertDelete } from '../lib/index.js';
import { Readable } from 'stream';
import fs from 'fs';

/**
 * Comprehensive test suite for Free Transfer library
 * Run with: node test/suite.test.js
 */

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Free Transfer Test Suite\n');
        console.log('='.repeat(50));

        for (const { name, testFn } of this.tests) {
            try {
                console.log(`\n🔍 Testing: ${name}`);
                await testFn();
                console.log(`✅ PASS: ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ FAIL: ${name}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        
        if (this.failed > 0) {
            console.log('❌ Some tests failed');
            process.exit(1);
        } else {
            console.log('🎉 All tests passed!');
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize test runner
const runner = new TestRunner();

// Test: File upload validation
runner.test('Constructor validation - missing availability', async () => {
    try {
        new FreeTransfer({ path: './test.dev' });
        throw new Error('Should have thrown error for missing availability');
    } catch (error) {
        if (!error.message.includes('availability')) {
            throw error;
        }
    }
});

runner.test('Constructor validation - invalid availability', async () => {
    try {
        new FreeTransfer({ path: './test.dev', availability: 50 });
        throw new Error('Should have thrown error for invalid availability');
    } catch (error) {
        if (!error.message.includes('availability')) {
            throw error;
        }
    }
});

runner.test('Constructor validation - multiple data sources', async () => {
    try {
        new FreeTransfer({ 
            path: './test.dev', 
            buffer: Buffer.from('test'), 
            availability: 14 
        });
        throw new Error('Should have thrown error for multiple data sources');
    } catch (error) {
        if (!error.message.includes('one data source')) {
            throw error;
        }
    }
});

runner.test('Constructor validation - buffer without filename', async () => {
    try {
        new FreeTransfer({ 
            buffer: Buffer.from('test'), 
            availability: 14 
        });
        throw new Error('Should have thrown error for buffer without filename');
    } catch (error) {
        if (!error.message.includes('Filename is required')) {
            throw error;
        }
    }
});

runner.test('Constructor validation - stream without size', async () => {
    const stream = new Readable({ read() {} });
    try {
        new FreeTransfer({ 
            stream: stream, 
            filename: 'test.txt',
            availability: 14 
        });
        throw new Error('Should have thrown error for stream without size');
    } catch (error) {
        if (!error.message.includes('Size is required')) {
            throw error;
        }
    }
});

// Test: File upload functionality
runner.test('File upload from path', async () => {
    // Create test file if it doesn't exist
    if (!fs.existsSync('./test.dev')) {
        fs.writeFileSync('./test.dev', 'test data for file upload');
    }

    const transfer = new FreeTransfer({
        path: './test.dev',
        availability: 1,
        password: 'test-password'
    });

    const result = await transfer.upload();
    
    // Validate response structure
    if (!result.transferKey) throw new Error('Missing transferKey');
    if (!result.deleteKey) throw new Error('Missing deleteKey');
    if (!result.downloadUrl) throw new Error('Missing downloadUrl');
    if (!result.downloadUrl.includes(result.transferKey)) {
        throw new Error('Download URL should contain transfer key');
    }
});

runner.test('Buffer upload', async () => {
    const testData = 'Hello from buffer test!';
    const buffer = Buffer.from(testData, 'utf8');

    const transfer = new FreeTransfer({
        buffer: buffer,
        filename: 'buffer-test.txt',
        availability: 1,
        mimeType: 'text/plain'
    });

    const result = await transfer.upload();
    
    // Validate response structure
    if (!result.transferKey) throw new Error('Missing transferKey');
    if (!result.deleteKey) throw new Error('Missing deleteKey');
    if (!result.downloadUrl) throw new Error('Missing downloadUrl');
});

runner.test('Stream upload', async () => {
    const testData = 'Hello from stream test!';
    const stream = new Readable({
        read() {
            this.push(testData);
            this.push(null);
        }
    });

    const transfer = new FreeTransfer({
        stream: stream,
        filename: 'stream-test.txt',
        size: Buffer.byteLength(testData, 'utf8'),
        availability: 1,
        mimeType: 'text/plain'
    });

    const result = await transfer.upload();
    
    // Validate response structure
    if (!result.transferKey) throw new Error('Missing transferKey');
    if (!result.deleteKey) throw new Error('Missing deleteKey');
    if (!result.downloadUrl) throw new Error('Missing downloadUrl');
});

// Test: Delete functionality
runner.test('Delete functionality (graceful failure)', async () => {
    const buffer = Buffer.from('Delete test data', 'utf8');
    
    const transfer = new FreeTransfer({
        buffer: buffer,
        filename: 'delete-test.txt',
        availability: 1
    });

    const uploadResult = await transfer.upload();
    const deleteResult = await transfer.delete();
    
    // Should handle 403 gracefully
    if (deleteResult.success !== false) {
        throw new Error('Delete should return success: false due to API limitations');
    }
    
    if (!deleteResult.manualDeleteUrl) {
        throw new Error('Should provide manual delete URL');
    }
    
    if (!deleteResult.transferKey) {
        throw new Error('Should include transfer key in delete response');
    }
});

runner.test('Static delete method', async () => {
    // Test with dummy keys (will fail gracefully)
    const result = await TransfertDelete.delete('dummyTransferKey', 'dummyDeleteKey');
    
    // Should handle gracefully
    if (result.success !== false) {
        throw new Error('Static delete should return success: false due to API limitations');
    }
});

// Test: MIME type detection
runner.test('MIME type detection', async () => {
    const testCases = [
        { filename: 'test.txt', expected: 'text/plain' },
        { filename: 'test.pdf', expected: 'application/pdf' },
        { filename: 'test.jpg', expected: 'image/jpeg' },
        { filename: 'test.png', expected: 'image/png' },
        { filename: 'test.unknown', expected: 'application/octet-stream' }
    ];

    for (const { filename, expected } of testCases) {
        const buffer = Buffer.from('test', 'utf8');
        const transfer = new FreeTransfer({
            buffer: buffer,
            filename: filename,
            availability: 1
        });

        // Check internal MIME type detection by examining the resolved file
        const resolved = await transfer._resolveFile();
        if (resolved.mimetype !== expected) {
            throw new Error(`MIME type for ${filename}: expected ${expected}, got ${resolved.mimetype}`);
        }
    }
});

// Run all tests
runner.run().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});
