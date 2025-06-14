# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-14

### Added
- Initial release of Free Transfer Node.js library
- Upload functionality for files, buffers, and streams
- Delete functionality with graceful error handling for API limitations
- Automatic MIME type detection based on file extensions
- Password protection support
- Configurable transfer availability (1, 2, 7, 14, or 30 days)
- Chunked upload support for large files
- TypeScript declaration files
- Comprehensive documentation with examples
- GitHub Actions CI/CD pipeline

### Features
- **Multiple Upload Sources**: Support for file paths, Node.js Buffers, and Readable Streams
- **Smart MIME Detection**: Automatic content type detection from file extensions
- **Secure Transfers**: Optional password protection
- **Flexible Expiration**: Configurable availability periods
- **Large File Support**: Efficient chunked uploads
- **Modern API**: Full ES Modules support with clean async/await interface
- **Error Handling**: Comprehensive error handling with informative messages
- **Delete Management**: Programmatic delete attempts with fallback to manual deletion
