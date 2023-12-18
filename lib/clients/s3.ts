import { S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY as string,
  },
});

export { s3Client };
