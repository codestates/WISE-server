import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { AWS_CONFIG_REGION, AWS_IDENTITY_POOLID, AWS_S3_BUCKET_NAME } = process.env;

const bucket = AWS_S3_BUCKET_NAME as string;

AWS.config.update({
  region: AWS_CONFIG_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITY_POOLID as string,
  }),
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: bucket },
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: 'public-read',
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, `wise/${Date.now().toString()}${extension}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 }, // 용량 제한
});

export const deleteImage = (key : string) => {
  s3.deleteObject({ Bucket: `${bucket}/wise`, Key: key },
    (err, data) => {
      if (err)console.log(err);
      else console.log(data);
    });
};
