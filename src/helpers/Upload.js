const fs = require('fs');
const path = require('path');
const async = require('async');
const AWS = require('aws-sdk');
const readdir = require('recursive-readdir');
const bucketName= '';
const rootFolder = path.resolve(__dirname, './');
const uploadFolder = '../';
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: '',
    secretAccessKey: '',
});

const getFiles = (dirPath) => {
    return fs.existsSync(dirPath) ? readdir(dirPath) : [];
};

const deploy = async (upload) => {
    const filesToUpload = await getFiles(path.resolve(__dirname, upload));
    return new Promise((resolve, reject) => {
        async.eachOfLimit(filesToUpload, 10, async.asyncify(async (file) => {
            let Key = file.replace(`${rootFolder}/${uploadFolder}`, '');
            let pointA = Key.indexOf('project');
            Key = Key.substr(pointA, Key.lastIndexOf('.png'));
            console.log(`uploading: [${Key}]`);
            return new Promise((res, rej) => {
                s3.upload({
                    Key,
                    Bucket: bucketName,
                    Body: fs.readFileSync(file),
                }, (err) => {
                    if (err) {
                        return rej(new Error(err));
                    }
                    res({result: true});
                });
            });
        }), (err) => {
            if (err) {
                return reject(new Error(err));
            }
            resolve({result: true});
        });
    });
};

deploy(uploadFolder)
    .then(() => {
        console.log('Upload Completed');
        process.exit(0);
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
