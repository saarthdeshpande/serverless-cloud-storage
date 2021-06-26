import AWS_BUCKET from './config'


const fetchFromS3 = function () {
    const { REACT_APP_S3_BUCKET, REACT_APP_S3_REGION } = process.env
    let folders = [];
    let files = {}
    AWS_BUCKET.listObjectsV2({
        Bucket: REACT_APP_S3_BUCKET,
        MaxKeys: 1000
    }).eachPage((err, data) => {
        if (err) console.log(err)
        else if (data) {
            return data.Contents.forEach(({ Key }) => {
                if (Key.endsWith('/')) {
                    folders.push(Key)
                } else {
                    files[Key] =
                        `https://${REACT_APP_S3_BUCKET}.s3-${REACT_APP_S3_REGION}.amazonaws.com/${Key}`
                }
            })
        }
    });
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve({ folders, files }), 100)
    })
}


export default fetchFromS3;