export type StorageFolder = 'audio' | 'video' | 'qr-codes' | 'logos' | 'temp';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export interface FileMetadata {
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}