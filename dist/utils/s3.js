"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.upload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { AWS_CONFIG_REGION, AWS_IDENTITY_POOLID, AWS_S3_BUCKET_NAME } = process.env;
const bucket = AWS_S3_BUCKET_NAME;
aws_sdk_1.default.config.update({
    region: AWS_CONFIG_REGION,
    credentials: new aws_sdk_1.default.CognitoIdentityCredentials({
        IdentityPoolId: AWS_IDENTITY_POOLID,
    }),
});
const s3 = new aws_sdk_1.default.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: bucket },
});
exports.upload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const extension = path_1.default.extname(file.originalname);
            cb(null, `wise/${Date.now().toString()}${parseInt(String(Math.random() * 1000), 10)}${extension}`);
        },
    }),
    limits: { fileSize: 3 * 1024 * 1024 }, // 용량 제한
});
const deleteImage = (key) => {
    s3.deleteObject({ Bucket: `${bucket}/wise`, Key: key }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
};
exports.deleteImage = deleteImage;
