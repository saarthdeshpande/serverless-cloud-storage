import AWS_BUCKET from "../config/aws";

const moveFile = (source, destination) => {
    if (source.folder) {
        let params = {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Prefix: source.abs_path
        }
        const moveMultiple = () => {
            AWS_BUCKET.listObjectsV2(params, function(err, data) {
                if (err) return console.log(err);

                if (data.Contents.length === 0) return;

                params = {Bucket: process.env.REACT_APP_S3_BUCKET};
                params.Delete = {Objects:[]}

                data.Contents.forEach(function(content) {
                    params.Delete.Objects.push({Key: content.Key});
                    AWS_BUCKET.copyObject({
                        Bucket: process.env.REACT_APP_S3_BUCKET,
                        CopySource: process.env.REACT_APP_S3_BUCKET + '/' + content.Key,
                        Key: destination === "root" || destination === "/" ? source.name + content.Key.replace(source.abs_path, '') :
                            destination + '/' + source.name + content.Key.replace(source.abs_path, '')
                    })
                        .promise()
                        .then(() =>
                            AWS_BUCKET.deleteObject({
                                Bucket: process.env.REACT_APP_S3_BUCKET,
                                Key: content.Key
                            }).promise()
                        )
                        .catch((e) => console.log(e))
                });

                AWS_BUCKET.deleteObjects(params, function(err, data) {
                    if (err) return console.log(err);
                    if(data.Contents?.length === 1000) moveMultiple();
                    else return;
                });
            });
        }
        moveMultiple()
    } else {
        AWS_BUCKET.copyObject({
            Bucket: process.env.REACT_APP_S3_BUCKET,
            CopySource: process.env.REACT_APP_S3_BUCKET + '/' + source.abs_path,
            Key: destination.endsWith("/") ? source.name : destination + '/' + source.name
        })
            .promise()
            .then(() =>
                AWS_BUCKET.deleteObject({
                    Bucket: process.env.REACT_APP_S3_BUCKET,
                    Key: source.abs_path
                }).promise()
            )
            .catch((e) => console.error(e))
    }
}

export default moveFile;
