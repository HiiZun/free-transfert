import FreeTransfer, { TransfertDelete } from '../../lib/index.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('FreeTransfer Constructor', () => {
    it('should create instance with file path', () => {
        const transfer = new FreeTransfer({
            path: 'test.txt',
            availability: 7
        });
        
        assert.strictEqual(transfer.path, 'test.txt');
        assert.strictEqual(transfer.availability, 7);
        assert.strictEqual(transfer.password, '');
    });

    it('should create instance with buffer', () => {
        const buffer = Buffer.from('test content');
        const transfer = new FreeTransfer({
            buffer: buffer,
            filename: 'test.txt',
            availability: 1
        });
        
        assert.strictEqual(transfer.buffer, buffer);
        assert.strictEqual(transfer.filename, 'test.txt');
        assert.strictEqual(transfer.availability, 1);
    });

    it('should create instance with stream', () => {
        const mockStream = { pipe: () => {} }; // Mock stream
        const transfer = new FreeTransfer({
            stream: mockStream,
            filename: 'test.txt',
            size: 1024,
            availability: 14
        });
        
        assert.strictEqual(transfer.stream, mockStream);
        assert.strictEqual(transfer.filename, 'test.txt');
        assert.strictEqual(transfer.size, 1024);
        assert.strictEqual(transfer.availability, 14);
    });

    it('should create instance with password', () => {
        const transfer = new FreeTransfer({
            buffer: Buffer.from('test'),
            filename: 'test.txt',
            availability: 7,
            password: 'secret123'
        });
        
        assert.strictEqual(transfer.password, 'secret123');
    });

    it('should create instance with custom mime type', () => {
        const transfer = new FreeTransfer({
            buffer: Buffer.from('test'),
            filename: 'test.custom',
            availability: 7,
            mimeType: 'application/custom'
        });
        
        assert.strictEqual(transfer.mimeType, 'application/custom');
    });
});

describe('FreeTransfer Constructor Validation', () => {
    it('should throw error if no data source provided', () => {
        assert.throws(() => {
            new FreeTransfer({
                availability: 7
            });
        }, /You must provide either a path, buffer, or stream/);
    });

    it('should throw error if multiple data sources provided', () => {
        assert.throws(() => {
            new FreeTransfer({
                path: 'test.txt',
                buffer: Buffer.from('test'),
                availability: 7
            });
        }, /You can only provide one data source/);
    });

    it('should throw error if buffer without filename', () => {
        assert.throws(() => {
            new FreeTransfer({
                buffer: Buffer.from('test'),
                availability: 7
            });
        }, /Filename is required when using buffer or stream/);
    });

    it('should throw error if stream without filename', () => {
        assert.throws(() => {
            new FreeTransfer({
                stream: { pipe: () => {} },
                size: 1024,
                availability: 7
            });
        }, /Filename is required when using buffer or stream/);
    });

    it('should throw error if stream without size', () => {
        assert.throws(() => {
            new FreeTransfer({
                stream: { pipe: () => {} },
                filename: 'test.txt',
                availability: 7
            });
        }, /Size is required when using stream/);
    });

    it('should throw error if no availability provided', () => {
        assert.throws(() => {
            new FreeTransfer({
                buffer: Buffer.from('test'),
                filename: 'test.txt'
            });
        }, /The availability of the file is required/);
    });

    it('should throw error if invalid availability value', () => {
        assert.throws(() => {
            new FreeTransfer({
                buffer: Buffer.from('test'),
                filename: 'test.txt',
                availability: 5 // Invalid value
            });
        }, /The availability of the file should be 1, 2, 7, 14 or 30/);
    });

    it('should accept valid availability values', () => {
        const validValues = [1, 2, 7, 14, 30];
        
        validValues.forEach(value => {
            assert.doesNotThrow(() => {
                new FreeTransfer({
                    buffer: Buffer.from('test'),
                    filename: 'test.txt',
                    availability: value
                });
            });
        });
    });
});

describe('TransfertDelete Static Methods', () => {
    it('should throw error if transfer key missing', async () => {
        await assert.rejects(async () => {
            await TransfertDelete.delete(null, 'delete456');
        }, /Transfer key and delete key are required for deletion/);
    });

    it('should throw error if delete key missing', async () => {
        await assert.rejects(async () => {
            await TransfertDelete.delete('transfer123', null);
        }, /Transfer key and delete key are required for deletion/);
    });

    it('should throw error if both keys missing', async () => {
        await assert.rejects(async () => {
            await TransfertDelete.delete(null, null);
        }, /Transfer key and delete key are required for deletion/);
    });
});
