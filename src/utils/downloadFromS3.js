import AWS_BUCKET from '../config'
import _ from 'underscore';

let unique_id = 1;
const config = {
    Bucket: process.env.REACT_APP_S3_BUCKET,
    MaxKeys: 1000
}

function arrangeIntoTree(paths) {
    var tree = [];
    const { REACT_APP_S3_BUCKET, REACT_APP_S3_REGION } = process.env

    _.each(paths, function(path) {
        var pathParts = path.split('/');
        pathParts.shift(); // Remove first blank element from the parts array.
        var currentLevel = tree; // initialize currentLevel to root
        let index = 1;
        _.each(pathParts, function(part) {
            // check to see if the path already exists.
            var existingPath = _.findWhere(currentLevel, {
                name: part
            });
            if (existingPath) {
                // The path to this item was already in the tree, so don't add it again.
                // Set the current level to this path's children
                currentLevel = existingPath.children;
            } else {
                var newPart = {
                    name: part,
                    children: [],
                    _id: unique_id++,
                    checked: 0,
                    url: `https://${REACT_APP_S3_BUCKET}.s3-${REACT_APP_S3_REGION}.amazonaws.com${path}`,
                    abs_path: path.substring(1,),
                }
                if ((path.match(/\//g) || []).length !== index) {
                    delete newPart['url']
                    newPart['folder'] = true
                    newPart['abs_path'] = pathParts.slice(0,index).join('/')
                    newPart['depth'] = (newPart['abs_path'].match(/\//g) || []).length + 1
                }
                else {
                    delete newPart['children']
                    newPart['folder'] = false
                    newPart['depth'] = (path.match(/\//g) || []).length
                }
                currentLevel?.push(newPart);
                currentLevel = newPart.children;
            }
            index++;
        });
    });
    return tree;
}

async function* fetchFromS3() {
    do {
        const data = await AWS_BUCKET.listObjectsV2(config).promise();
        config.ContinuationToken = data.NextContinuationToken;
        yield data;
    } while (config.ContinuationToken);
}


async function getData() {
    let files = []
    for await (const data of fetchFromS3(config)) {
        data.Contents.forEach(({ Key }) => {
            if (!Key.endsWith('/')) {
                files.push('/' + Key)
            }
        })
    }
    const tree = arrangeIntoTree(files)
    return tree;
}

export default getData;