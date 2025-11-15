export interface UploadAudioRequest {
  file: File;
}

export interface UploadAudioResponse {
  qr_id:string;
  slug:string;
  url: string;
  filename: string;
  size: number;
  duration: number;
  format: string;
  bitrate: number;
  key: string;
  message:string;
}

export interface UploadVideoResponse {
  url: string;
  filename: string;
  size: number;
  duration: number;
  format: string;
  resolution: string;
  thumbnail_url: string;
  key: string;
}

export interface UploadImageResponse {
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  thumbnail_url: string;
  key: string;
}