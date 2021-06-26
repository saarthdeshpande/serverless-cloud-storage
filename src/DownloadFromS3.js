import AWS_BUCKET from './config'


const fetchFromS3 = async function (folder='') {
    const { Contents } = await AWS_BUCKET.listObjectsV2({
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Prefix: folder,
        MaxKeys: 1000,
        StartAfter: 'test-folder'
    }).promise();
    // let URLs = {};
    // let folders = []
    // await Promise.all((Contents || []).map(({ Key }) => {
    //     if (Key.endsWith('/')) {
    //         if (folders.includes(Key)) {
    //
    //         } else {
    //             folders.push(Key)
    //             URLs
    //         }
    //     }
    //     console.log(folders)
    //         // `https://${process.env.REACT_APP_S3_BUCKET}.s3${process.env.REACT_APP_S3_REGION}.amazonaws.com/${Key}`
    //     }));
    let keys = [];
    Contents.map(content => keys.push(content.Key))
    console.log(keys)
}

export default fetchFromS3;