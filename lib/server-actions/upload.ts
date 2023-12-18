import { s3Client } from "@/lib/clients/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generateV4UploadSignedUrl(
  fileName: string,
  fileType: string,
  maxFileSize?: number,
) {
  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    ContentLength: maxFileSize,
  });
  const preSignedUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 5 * 60,
  });

  return { url: preSignedUrl };
}

export default generateV4UploadSignedUrl;
