const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const s3 = new AWS.S3();
const bucketName = '';

let dir = path.resolve(__dirname, '../backstop_data/prod_reference');
if (fs.existsSync(dir)) {
    s3.listObjects({Bucket: bucketName}, (err, data) => {
        if (err) console.log(err, err.stack);
        else {
            data.Contents.forEach((currentValue) => {
                fs.exists('backstop_data' + '/' + currentValue.Key, (exists) => {
                    if (exists) {
                        console.log('Skipping: ' + currentValue.Key);
                    } else {
                        console.log('Retrieving: ' + currentValue.Key);
                        s3.getObject({Bucket: bucketName, Key: currentValue.Key}, (err, data) => {
                            if (err) console.log(err, err.stack);
                            else {
                                fs.writeFileSync(dir + '/' + currentValue.Key, data.Body, () => {
                                    console.log('Download Finished: ' + currentValue.Key);
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}
