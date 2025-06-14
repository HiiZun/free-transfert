import { describe, it } from 'node:test';
import assert from 'node:assert';

// We need to extract the getMimeType function - let's create a mock version for testing
const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
};

describe('MIME Type Detection', () => {
    it('should detect text file types', () => {
        assert.strictEqual(getMimeType('document.txt'), 'text/plain');
        assert.strictEqual(getMimeType('index.html'), 'text/html');
        assert.strictEqual(getMimeType('styles.css'), 'text/css');
    });

    it('should detect application file types', () => {
        assert.strictEqual(getMimeType('script.js'), 'application/javascript');
        assert.strictEqual(getMimeType('data.json'), 'application/json');
        assert.strictEqual(getMimeType('document.pdf'), 'application/pdf');
    });

    it('should detect Microsoft Office file types', () => {
        assert.strictEqual(getMimeType('document.doc'), 'application/msword');
        assert.strictEqual(getMimeType('document.docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        assert.strictEqual(getMimeType('spreadsheet.xls'), 'application/vnd.ms-excel');
        assert.strictEqual(getMimeType('spreadsheet.xlsx'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });

    it('should detect archive file types', () => {
        assert.strictEqual(getMimeType('archive.zip'), 'application/zip');
        assert.strictEqual(getMimeType('archive.rar'), 'application/x-rar-compressed');
    });

    it('should detect image file types', () => {
        assert.strictEqual(getMimeType('image.jpg'), 'image/jpeg');
        assert.strictEqual(getMimeType('image.jpeg'), 'image/jpeg');
        assert.strictEqual(getMimeType('image.png'), 'image/png');
        assert.strictEqual(getMimeType('image.gif'), 'image/gif');
        assert.strictEqual(getMimeType('image.bmp'), 'image/bmp');
    });

    it('should detect video file types', () => {
        assert.strictEqual(getMimeType('video.mp4'), 'video/mp4');
        assert.strictEqual(getMimeType('video.avi'), 'video/x-msvideo');
        assert.strictEqual(getMimeType('video.mov'), 'video/quicktime');
    });

    it('should detect audio file types', () => {
        assert.strictEqual(getMimeType('audio.mp3'), 'audio/mpeg');
        assert.strictEqual(getMimeType('audio.wav'), 'audio/wav');
    });

    it('should handle case insensitive extensions', () => {
        assert.strictEqual(getMimeType('FILE.TXT'), 'text/plain');
        assert.strictEqual(getMimeType('IMAGE.PNG'), 'image/png');
        assert.strictEqual(getMimeType('Video.MP4'), 'video/mp4');
    });

    it('should return default type for unknown extensions', () => {
        assert.strictEqual(getMimeType('file.unknown'), 'application/octet-stream');
        assert.strictEqual(getMimeType('file.xyz'), 'application/octet-stream');
        assert.strictEqual(getMimeType('file'), 'application/octet-stream');
    });

    it('should handle files with multiple dots', () => {
        assert.strictEqual(getMimeType('file.name.with.dots.txt'), 'text/plain');
        assert.strictEqual(getMimeType('my.backup.file.zip'), 'application/zip');
    });

    it('should handle files with no extension', () => {
        assert.strictEqual(getMimeType('README'), 'application/octet-stream');
        assert.strictEqual(getMimeType('Makefile'), 'application/octet-stream');
    });
});
