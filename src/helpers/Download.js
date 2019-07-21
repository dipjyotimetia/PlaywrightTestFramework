/* eslint-disable */ 
import { S3 } from 'aws-sdk';
import { existsSync, exists as _exists, writeFileSync } from 'fs';
import { resolve } from 'path';

const s3 = new S3();
const bucketName = '';

const dir = resolve(__dirname, '../backstop_data/prod_reference');
if (existsSync(dir)) {
  s3.listObjects({ Bucket: bucketName }, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      data.Contents.forEach(currentValue => {
        _exists(`${'backstop_data' + '/'}${currentValue.Key}`, exists => {
          if (exists) {
            console.log(`Skipping: ${currentValue.Key}`);
          } else {
            console.log(`Retrieving: ${currentValue.Key}`);
            s3.getObject(
              { Bucket: bucketName, Key: currentValue.Key },
              (err, dataBody) => {
                if (err) console.log(err, err.stack);
                else {
                  writeFileSync(
                    `${dir}/${currentValue.Key}`,
                    dataBody.Body,
                    () => {
                      console.log(`Download Finished: ${currentValue.Key}`);
                    }
                  );
                }
              }
            );
          }
        });
      });
    }
  });
}
