import axios from 'axios';
import fs from 'fs';
import { get } from 'http';
import path from 'path';

// Simple MIME type detection
const getMimeType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
};


class Transfert {
    /**
     * 
     * @param {Object} config The configuration object for the transfert
     * @param {String} [config.path] The relative or complete path to the file to transfer
     * @param {Buffer} [config.buffer] The buffer containing the file data
     * @param {Stream} [config.stream] The readable stream containing the file data
     * @param {String} config.filename The name of the file (required when using buffer or stream)
     * @param {Number} [config.size] The size of the data (required when using stream)
     * @param {String} [config.mimeType] The MIME type of the file (optional, will be auto-detected for files)
     * @param {String} config.availability Defines the availability of the file. Values should be 1, 2, 7, 14 or 30
     * @param {String} config.password OPTIONAL: The password to protect the file
     *  
     */
    constructor(config) {
    
    this.path = config.path || '';
    this.buffer = config.buffer || null;
    this.stream = config.stream || null;
    this.filename = config.filename || '';
    this.size = config.size || null;
    this.mimeType = config.mimeType || '';
    this.availability = config.availability || '';
    this.password = config.password || '';
    this.baseURL = 'https://api.scw.iliad.fr/freetransfert/v2/transfers';
    this.availabilityValues = [1, 2, 7, 14, 30];
    this.transferKey = '';
    this.uploadKey = '';
    this.deleteKey = '';

    // Verify that at least one data source is provided
    const dataSources = [this.path, this.buffer, this.stream].filter(Boolean);
    if (dataSources.length === 0) {
        throw new Error('You must provide either a path, buffer, or stream');
    }
    if (dataSources.length > 1) {
        throw new Error('You can only provide one data source: path, buffer, or stream');
    }

    // Verify filename is provided for buffer/stream
    if ((this.buffer || this.stream) && !this.filename) {
        throw new Error('Filename is required when using buffer or stream');
    }

    // Verify size is provided for stream
    if (this.stream && !this.size) {
        throw new Error('Size is required when using stream');
    }

    if(!this.availability) {
        throw new Error('The availability of the file is required');
    }

    if(!this.availabilityValues.includes(this.availability)) {
        throw new Error('The availability of the file should be 1, 2, 7, 14 or 30');
    }

    }

    async _createTransfer(resolvedFile) {
        return new Promise((resolve, reject) => {
            axios(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "availability": this.availability,
                    "password": this.password,
                    "files": [
                        {
                            "mimetype": resolvedFile.mimetype,
                            "path": resolvedFile.fileName,
                            "size": resolvedFile.size
                        }
                    ]
                }
            }).then((response) => {
                this.transferKey = response.data.transferKey;
                this.uploadKey = response.data.uploadKey;
                this.deleteKey = response.data.deleteKey;
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        
        })
    }

    async _resolveFile() {
        return await new Promise((resolve, reject) => {
            
            if (this.path) {
                // Handle file path
                if (!fs.existsSync(this.path)) {
                    reject('The file does not exist');
                    return;
                }

                const stats = fs.statSync(this.path);
                const fileSize = stats.size;
                const fileName = path.basename(this.path);
                const mimeType = this.mimeType || getMimeType(fileName);

                if (!fileName) {
                    reject('The file name could not be resolved');
                    return;
                }

                if (!fileSize || isNaN(fileSize) || fileSize <= 0) {
                    reject('The file size could not be resolved');
                    return;
                }
                
                resolve({
                    size: fileSize,
                    mimetype: mimeType,
                    fileName: fileName
                });

            } else if (this.buffer) {
                // Handle buffer
                const fileSize = this.buffer.length;
                const fileName = this.filename;
                const mimeType = this.mimeType || getMimeType(fileName);

                if (!fileSize || fileSize <= 0) {
                    reject('The buffer is empty');
                    return;
                }

                resolve({
                    size: fileSize,
                    mimetype: mimeType,
                    fileName: fileName
                });

            } else if (this.stream) {
                // Handle stream
                const fileSize = this.size;
                const fileName = this.filename;
                const mimeType = this.mimeType || getMimeType(fileName);

                if (!fileSize || fileSize <= 0) {
                    reject('Invalid stream size');
                    return;
                }

                resolve({
                    size: fileSize,
                    mimetype: mimeType,
                    fileName: fileName
                });

            } else {
                reject('No valid data source provided');
            }
        });
    }

    async _getFileChunk(startByte, endByte) {
        return await new Promise(async (resolve, reject) => {
            if (this.path) {
                // Handle file path
                const chunkSize = endByte - startByte;
                const chunk = Buffer.alloc(chunkSize);
                
                fs.open(this.path, 'r', (err, fd) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    fs.read(fd, chunk, 0, chunkSize, startByte, (err, bytesRead) => {
                        fs.close(fd, () => {});
                        
                        if (err) {
                            reject(err);
                            return;
                        }
                        
                        resolve(chunk.slice(0, bytesRead));
                    });
                });

            } else if (this.buffer) {
                // Handle buffer
                const chunk = this.buffer.slice(startByte, endByte);
                resolve(chunk);

            } else if (this.stream) {
                // Handle stream by converting to buffer if not already done
                if (!this._streamBuffer) {
                    try {
                        this._streamBuffer = await this._streamToBuffer();
                    } catch (error) {
                        reject(error);
                        return;
                    }
                }
                const chunk = this._streamBuffer.slice(startByte, endByte);
                resolve(chunk);

            } else {
                reject('No valid data source provided');
            }
        });
    }

    async _streamToBuffer() {
        return new Promise((resolve, reject) => {
            const chunks = [];
            
            this.stream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            
            this.stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            
            this.stream.on('error', (error) => {
                reject(error);
            });
        });
    }

    async _uploadFileChunks() {
        return await new Promise((resolve, reject) => {
            // Get file size from appropriate source
            let fileSize;
            if (this.path) {
                fileSize = fs.statSync(this.path).size;
            } else if (this.buffer) {
                fileSize = this.buffer.length;
            } else if (this.stream) {
                fileSize = this.size;
            } else {
                reject('No valid data source provided');
                return;
            }

            // upload file chunks
            if (!this.uploadKey) {
                reject('The upload key is required');
                return;
            }

            let url = `${this.baseURL}/${this.transferKey}/chunk`;

            // First, get the chunk information
            axios(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain',
                    'x-password': this.password,
                    'x-upload-key': this.uploadKey,
                }
            }).then(async (response) => {
                console.log('Chunk info received:', response.data);

                const chunks = response.data.files[0].parts;
                const chunkPromises = [];
                
                // Process each chunk
                for (let i = 0; i < chunks.length; i++) {
                    const partData = chunks[i];
                    
                    // Calculate byte range for this chunk
                    let startByte, endByte;
                    if (partData.partSize) {
                        startByte = i * parseInt(partData.partSize);
                        endByte = Math.min(startByte + parseInt(partData.partSize), fileSize);
                    } else {
                        // If partSize is not provided, divide file equally
                        const chunkSize = Math.ceil(fileSize / chunks.length);
                        startByte = i * chunkSize;
                        endByte = Math.min(startByte + chunkSize, fileSize);
                    }
                    
                    try {
                        const chunkData = await this._getFileChunk(startByte, endByte);
                        
                        const chunkPromise = axios(partData.url, {
                            method: 'PUT',
                            data: chunkData,
                            headers: {
                                'Content-Type': 'application/octet-stream',
                            }
                        }).then((chunkResponse) => {
                            console.log(`Chunk ${i + 1} uploaded successfully`);
                            // Return the exact format expected by the API
                            return {
                                PartNumber: partData.PartNumber || (i + 1),
                                ETag: chunkResponse.headers.etag ? chunkResponse.headers.etag.replace(/"/g, '') : partData.ETag
                            };
                        });
                        
                        chunkPromises.push(chunkPromise);
                    } catch (error) {
                        reject(`Error processing chunk ${i + 1}: ${error}`);
                        return;
                    }
                }

                // Wait for all chunks to upload
                try {
                    const uploadResults = await Promise.all(chunkPromises);
                    console.log('All chunks uploaded successfully');
                    console.log('Upload results:', JSON.stringify(uploadResults, null, 2));

                    // Prepare finalization payload
                    const finalizePayload = {
                        "files": [
                            {
                                "path": response.data.files[0].path,
                                "parts": uploadResults.map(result => ({
                                    PartNumber: result.PartNumber,
                                    ETag: `"${result.ETag}"`
                                }))
                            }
                        ]
                    };
                    
                    console.log('Finalize payload:', JSON.stringify(finalizePayload, null, 2));

                    // Finalize the upload
                    const finalizeResponse = await axios(`${this.baseURL}/${this.transferKey}/chunk`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-password': this.password,
                            'x-upload-key': this.uploadKey,
                        },
                        data: finalizePayload
                    });

                    console.log("Upload finalized successfully:", finalizeResponse.data);
                    resolve(finalizeResponse.data);
                } catch (error) {
                    console.error('Finalization error details:', error.response?.data || error.message);
                    reject(`Error finalizing upload: ${error.response?.data || error.message}`);
                }

            }).catch((error) => {
                reject(`Error getting chunk info: ${error}`);
            });
        });
    }

    async upload() {
        try {
            console.log('Starting upload process...');
            const resolvedFile = await this._resolveFile();
            console.log('File resolved:', resolvedFile);
            
            const transfer = await this._createTransfer(resolvedFile);
            console.log('Transfer created:', { transferKey: this.transferKey });
            
            const upload = await this._uploadFileChunks();
            console.log('Upload completed successfully');
            
            return {
                transferKey: this.transferKey,
                deleteKey: this.deleteKey,
                downloadUrl: `https://transfert.free.fr/${this.transferKey}`,
                ...upload
            };
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    }

    async delete() {
        if (!this.transferKey || !this.deleteKey) {
            throw new Error('Transfer key and delete key are required for deletion');
        }

        try {
            console.log('Attempting to delete transfer...');
            const requestData = JSON.stringify({ deleteKey: this.deleteKey });
            
            const response = await axios({
                url: `${this.baseURL}/${this.transferKey}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://transfert.free.fr',
                    'Referer': 'https://transfert.free.fr/'
                },
                data: requestData
            });

            console.log('Transfer deleted successfully');
            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                console.warn('Delete operation returned 403 Forbidden. This may be due to API restrictions or additional authentication requirements.');
                console.warn('Transfer Key:', this.transferKey);
                console.warn('Delete Key:', this.deleteKey);
                console.warn('You may need to delete the transfer manually through the Free Transfer web interface.');
                
                // Return a structured response instead of throwing
                return {
                    success: false,
                    error: 'Forbidden',
                    message: 'Delete operation not permitted. Please delete manually through the web interface.',
                    transferKey: this.transferKey,
                    deleteKey: this.deleteKey,
                    manualDeleteUrl: `https://transfert.free.fr/${this.transferKey}`
                };
            }
            
            console.error('Delete failed:', error.response?.data || error.message);
            throw error;
        }
    }

}

// Utility class for deleting transfers without creating a full Transfert instance
class TransfertDelete {
    /**
     * Delete a transfer using transfer key and delete key
     * @param {String} transferKey The transfer key
     * @param {String} deleteKey The delete key
     */
    static async delete(transferKey, deleteKey) {
        if (!transferKey || !deleteKey) {
            throw new Error('Transfer key and delete key are required for deletion');
        }

        const baseURL = 'https://api.scw.iliad.fr/freetransfert/v2/transfers';

        try {
            console.log('Attempting to delete transfer...');
            const requestData = JSON.stringify({ deleteKey: deleteKey });
            
            const response = await axios({
                url: `${baseURL}/${transferKey}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://transfert.free.fr',
                    'Referer': 'https://transfert.free.fr/'
                },
                data: requestData
            });

            console.log('Transfer deleted successfully');
            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                console.warn('Delete operation returned 403 Forbidden. This may be due to API restrictions or additional authentication requirements.');
                console.warn('Transfer Key:', transferKey);
                console.warn('Delete Key:', deleteKey);
                console.warn('You may need to delete the transfer manually through the Free Transfer web interface.');
                
                // Return a structured response instead of throwing
                return {
                    success: false,
                    error: 'Forbidden',
                    message: 'Delete operation not permitted. Please delete manually through the web interface.',
                    transferKey: transferKey,
                    deleteKey: deleteKey,
                    manualDeleteUrl: `https://transfert.free.fr/${transferKey}`
                };
            }
            
            console.error('Delete failed:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default Transfert;
export { TransfertDelete };