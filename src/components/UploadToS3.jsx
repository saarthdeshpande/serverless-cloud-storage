import React , {useState} from 'react';
import { Modal, Button } from "react-bootstrap";
import AWS_BUCKET from "../config";


import { isMobile, isBrowser } from "react-device-detect";


const UploadToS3 = (props) => {
    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [folder, setFolder] = useState(false)

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: file.name
        };

        AWS_BUCKET.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
                else {
                    setTimeout(() => {
                        props.handler()
                        setProgress(0)
                    }, 5000)
                }
                setSelectedFile(null)
            })
    }
    return (
        <div>
            <Button variant="primary" onClick={props.handler}>
                Upload File / Folder
            </Button>
            <Modal
                show={props.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {isMobile ? "Upload Files" : (
                            <>
                                Upload {folder ? "a Folder" : "Files"}
                            </>
                            )
                        }
                        {isBrowser &&
                            <Button
                                variant="dark"
                                style={{display: 'inline-block', right: '15px', position: 'absolute'}}
                                onClick={setFolder.bind(this, !folder)}
                            >
                                Upload {folder ? "Files instead?" : "a Folder instead?"}
                            </Button>
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div align={'center'}>
                        {isMobile ? (
                                <React.Fragment>
                                    <input type="file" id="ctrl" onChange={handleFileInput} multiple/>
                                    <div style={{paddingTop: '20px'}}>
                                        File Upload Progress:
                                        <b style={{color: progress === 100 ? 'green' : 'red'}}>
                                            {progress}%
                                        </b>
                                    </div>
                                </React.Fragment>
                            ) :
                            (<React.Fragment>
                                    {folder ?
                                        <input
                                            type="file"
                                            onChange={handleFileInput}
                                            webkitdirectory={""}
                                            directory={""}
                                            multiple
                                        />
                                        :
                                        <input
                                            type="file"
                                            onChange={handleFileInput}
                                            multiple
                                        />
                                    }
                                    <div style={{paddingTop: '20px'}}>
                                        {folder ? "Folder" : "File"} Upload Progress: &nbsp;
                                        <b style={{color: progress === 100 ? 'green' : 'red'}}>
                                            {progress}%
                                        </b>
                                    </div>
                                </React.Fragment>
                            )
                        }
                        {progress === 100 && "Closing Modal in 5 seconds."}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => uploadFile(selectedFile)}>Upload</Button>
                    <Button variant={'secondary'} onClick={props.handler}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UploadToS3;