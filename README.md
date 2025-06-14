# Free Transfer Node.js Library

[![npm version](https://badge.fury.io/js/free-transfert.svg)](https://badge.fury.io/js/free-transfert)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

A Node.js library for uploading files to Free Transfer service with support for files, buffers, and streams. Also includes delete functionality for transfer management.

## 🚀 Features

- ✅ **Multiple Upload Sources**: Upload from file paths, Node.js Buffers, or Readable Streams
- ✅ **Delete Functionality**: Programmatic transfer deletion (with API limitations)
- ✅ **Automatic MIME Detection**: Smart file type detection based on extensions
- ✅ **Password Protection**: Optional password support for secure transfers
- ✅ **Flexible Availability**: Configure transfer availability (1, 2, 7, 14, or 30 days)
- ✅ **Chunked Uploads**: Efficient handling of large files
- ✅ **Modern ES Modules**: Full ESM support with clean API
- ✅ **TypeScript Ready**: Includes type definitions

## 📦 Installation

```bash
npm install free-transfert
```

## 🏃‍♂️ Quick Start

```javascript
import FreeTransfer from 'free-transfert';

const transfer = new FreeTransfer({
    path: './myfile.txt',
    availability: 14,
    password: 'optional-password'
});

const result = await transfer.upload();
console.log('Download URL:', result.downloadUrl);
```

## 📖 Usage Examples

### 1. Upload from File Path

```javascript
import FreeTransfer from 'free-transfert';

const transfer = new FreeTransfer({
    path: './myfile.txt',
    availability: 14,
    password: 'optional-password'
});

try {
    const result = await transfer.upload();
    console.log('✅ Upload successful!');
    console.log('📁 Download URL:', result.downloadUrl);
    console.log('🔑 Transfer Key:', result.transferKey);
    console.log('🗑️ Delete Key:', result.deleteKey);
} catch (error) {
    console.error('❌ Upload failed:', error);
}
```

### 2. Upload from Buffer

```javascript
import FreeTransfer from 'free-transfert';

const data = 'Hello, World!';
const buffer = Buffer.from(data, 'utf8');

const transfer = new FreeTransfer({
    buffer: buffer,
    filename: 'hello.txt',
    availability: 7,
    password: 'optional-password',
    mimeType: 'text/plain' // Optional, auto-detected from filename
});

const result = await transfer.upload();
console.log('📁 Download URL:', result.downloadUrl);
```

### 3. Upload from Stream

```javascript
import FreeTransfer from 'free-transfert';
import { Readable } from 'stream';

const data = 'Hello from stream!';
const stream = new Readable({
    read() {
        this.push(data);
        this.push(null); // End the stream
    }
});

const transfer = new FreeTransfer({
    stream: stream,
    filename: 'stream-data.txt',
    size: Buffer.byteLength(data, 'utf8'), // Required for streams
    availability: 2,
    mimeType: 'text/plain' // Optional
});

const result = await transfer.upload();
console.log('📁 Download URL:', result.downloadUrl);
```

### 4. Delete Transfer (Instance Method)

```javascript
import FreeTransfer from 'free-transfert';

const transfer = new FreeTransfer({
    path: './myfile.txt',
    availability: 14,
    password: 'optional-password'
});

try {
    const uploadResult = await transfer.upload();
    console.log('✅ Upload successful!');
    console.log('📁 Download URL:', uploadResult.downloadUrl);
    
    // Delete the transfer using the same instance
    const deleteResult = await transfer.delete();
    
    if (deleteResult.success === false) {
        console.log('⚠️ Auto-delete not available:', deleteResult.message);
        console.log('🌐 Manual delete URL:', deleteResult.manualDeleteUrl);
    } else {
        console.log('✅ Transfer deleted successfully!');
    }
} catch (error) {
    console.error('❌ Operation failed:', error);
}
```

### 5. Delete Transfer (Static Method)

```javascript
import { TransfertDelete } from 'free-transfert';

try {
    // Delete a transfer using transfer key and delete key
    const result = await TransfertDelete.delete('transferKey123', 'deleteKey456');
    
    if (result.success === false) {
        console.log('⚠️ Auto-delete not available:', result.message);
        console.log('🌐 Manual delete URL:', result.manualDeleteUrl);
    } else {
        console.log('✅ Transfer deleted successfully!');
    }
} catch (error) {
    console.error('❌ Delete failed:', error);
}
```

## ⚙️ Configuration Options

### Common Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `availability` | `number` | ✅ | Number of days the file will be available (1, 2, 7, 14, or 30) |
| `password` | `string` | ❌ | Password to protect the file |
| `mimeType` | `string` | ❌ | MIME type of the file (auto-detected if not provided) |

### File Path Upload

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `path` | `string` | ✅ | Path to the file to upload |

### Buffer Upload

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `buffer` | `Buffer` | ✅ | Buffer containing the file data |
| `filename` | `string` | ✅ | Name of the file |

### Stream Upload

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `stream` | `ReadableStream` | ✅ | Readable stream containing the file data |
| `filename` | `string` | ✅ | Name of the file |
| `size` | `number` | ✅ | Size of the data in bytes |

## 📤 Response Format

The `upload()` method returns a Promise that resolves to an object with the following properties:

```javascript
{
    transferKey: 'abc123',           // Transfer identifier
    deleteKey: 'def456',             // Key to delete the transfer
    downloadUrl: 'https://transfert.free.fr/abc123', // Download URL
    files: [                         // Array of uploaded files
        {
            path: 'filename.txt',
            partsToUploadCount: 0
        }
    ]
}
```

## 🗑️ Delete Functionality Limitations

> **Important Note**: The Free Transfer API currently returns a 403 Forbidden error for programmatic delete requests, likely due to additional security measures or session-based authentication requirements.

When you call the `delete()` method:
- If the delete operation is blocked by the API (403 error), the method will return a structured response with `success: false`
- The response includes the manual delete URL where you can delete the transfer through the web interface
- Other errors (network issues, invalid keys, etc.) will still throw exceptions

This graceful handling ensures your application doesn't crash due to API restrictions while still providing useful information for manual deletion.

## 🛠️ Error Handling

The library throws errors for various validation issues:

- Missing required parameters
- Invalid availability values
- File not found (for path uploads)
- Empty buffers
- Invalid stream sizes
- Network errors during upload

Always wrap your upload calls in try-catch blocks or use `.catch()` with promises.

## 🎯 MIME Type Detection

The library automatically detects MIME types based on file extensions:

| Extension | MIME Type |
|-----------|-----------|
| `.txt` | `text/plain` |
| `.html` | `text/html` |
| `.pdf` | `application/pdf` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.png` | `image/png` |
| `.mp4` | `video/mp4` |
| `.zip` | `application/zip` |
| And many more... | |

Files without recognized extensions default to `application/octet-stream`.

## 🚀 Examples

Run the included examples:

```bash
# Run all upload examples
npm run example

# Run delete functionality test
npm run example:delete
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Free Transfer service by Free (Iliad Group)
- Built with ❤️ for the Node.js community
