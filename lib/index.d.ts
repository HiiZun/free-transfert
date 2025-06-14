export interface TransfertConfig {
  // Data source (only one should be provided)
  path?: string;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
  
  // Required for buffer/stream uploads
  filename?: string;
  size?: number; // Required for streams
  
  // File configuration
  mimeType?: string;
  availability: 1 | 2 | 7 | 14 | 30;
  password?: string;
}

export interface UploadResponse {
  transferKey: string;
  deleteKey: string;
  downloadUrl: string;
  files: Array<{
    path: string;
    partsToUploadCount: number;
  }>;
}

export interface DeleteResponse {
  success: boolean;
  error?: string;
  message?: string;
  transferKey?: string;
  deleteKey?: string;
  manualDeleteUrl?: string;
  data?: any;
}

export default class Transfert {
  constructor(config: TransfertConfig);
  
  upload(): Promise<UploadResponse>;
  delete(): Promise<DeleteResponse>;
}

export class TransfertDelete {
  static delete(transferKey: string, deleteKey: string): Promise<DeleteResponse>;
}

export { Transfert as FreeTransfer };
