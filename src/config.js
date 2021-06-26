import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY
})

const AWS_BUCKET = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET},
    region: process.env.REACT_APP_S3_REGION,
})
 export default AWS_BUCKET;