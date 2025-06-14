# Free Transfer Tests

This directory contains test files for the Free Transfer library organized by test type.

## Directory Structure

- `unit/` - Unit tests that don't require API calls
- `integration/` - Integration tests that make real API calls
- `fixtures/` - Test data files and fixtures

## Unit Tests (`unit/`)

Unit tests verify the library's logic without making external API calls:

- `constructor.test.js` - Tests for class constructors and validation
- `mime-type.test.js` - Tests for MIME type detection

## Integration Tests (`integration/`)

Integration tests make real API calls to Free Transfer:

- `suite.test.js` - Main test suite covering all functionality
- `buffer.test.js` - Test uploading from buffer
- `stream.test.js` - Test uploading from stream
- `file-upload.test.js` - Test uploading from file path
- `delete.test.js` - Test delete functionality
- `fresh-delete.test.js` - Test delete with fresh upload
- `simple-delete.test.js` - Simple delete test
- `integrated-delete.test.js` - Comprehensive delete testing

## Running Tests

To run all tests:
```bash
npm test
```

To run only unit tests:
```bash
npm run test:unit
```

To run only integration tests:
```bash
npm run test:integration
```

To run a specific test file:
```bash
node test/unit/constructor.test.js
node test/integration/suite.test.js
```

## Test Data

- `fixtures/test.dev` - Test file used for upload tests (small text file)

## Test Coverage

✅ **Unit Tests**
- Constructor validation
- Parameter validation
- MIME type detection
- Error handling

✅ **Integration Tests**
- File path uploads
- Buffer uploads  
- Stream uploads
- Delete functionality
- Response structure validation
- API error handling

## Notes

- **Unit tests** are fast and don't require internet connection
- **Integration tests** make real API calls to Free Transfer
- Integration tests may fail if the API has rate limits or temporary issues
- Delete tests require valid transfer/delete keys from successful uploads
- Run unit tests first to catch basic issues quickly
