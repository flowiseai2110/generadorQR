import { S3Client } from '@aws-sdk/client-s3';

// Validar que las variables de entorno existan
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
 const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

 if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
 
  throw new Error('Missing R2 environment variables');
}

// Cliente de R2 (compatible con S3)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
//https://a2af1a9fdadfd9264aea0a633e88d74d.r2.cloudflarestorage.com
export const R2_BUCKET_NAME = bucketName;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';