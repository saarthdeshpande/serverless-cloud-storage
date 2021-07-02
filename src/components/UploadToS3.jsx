import React , {useState} from 'react';
import { Modal, Button } from "react-bootstrap";
import AWS_BUCKET from "../config";


import { isMobile, isBrowser } from "react-device-detect";


const UploadToS3 = (props) => {
    const [progress , setProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [folder, setFolder] = useState(false)
    const [filesDone, setFilesDone] = useState(0)

    const handleFileInput = (e) => {
        setSelectedFiles(e.target.files);
    }
    const uploadFile = () => {
        Array.from(selectedFiles)?.forEach((file) => {
            let Key;
            if (folder)
                Key = props.path ? props.path + '/' +  file.webkitRelativePath : file.webkitRelativePath
            else
                Key = props.path !== "/" ? props.path + '/' + file.name : file.name
            const params = {
                ACL: 'public-read',
                Body: file,
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key
            };
            AWS_BUCKET.putObject(params)
                .on('httpUploadProgress', (evt) => {
                    setProgress(Math.round((evt.loaded / evt.total) * 100))
                })
                .send((err) => {
                    if (err) console.log(err)
                    else {
                        setFilesDone(filesDone + 1)
                    }
                })
        })
        setTimeout(() => {
            props.handler()
            props.refreshTree()
            setProgress(0)
        }, 2000)
    }
    return (
        <div style={{display: 'inline-block'}}>
            <img
                style={{
                    display: 'inline-block',
                    marginLeft: '15px',
                    marginBottom: '3px',
                    cursor: 'pointer'
                }}
                src={"https://img.icons8.com/material-outlined/24/000000/upload--v1.png"}
                alt={'upload'}
                onClick={props.handler}
            />
            <Modal
                show={props.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={props.handler}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {isMobile && (
                            <>
                                Upload Files to <br/>
                                <span style={{fontSize: '15px', color: 'grey'}}>
                                    {props.path}
                                </span>
                            </>
                            )}
                        {isBrowser && (
                            <>
                                Upload {folder ? "a Folder" : "Files"} to <br/>
                                <span style={{fontSize: '15px', color: 'grey'}}>
                                    {props.path}
                                </span>
                            </>
                            )
                        }
                        {isBrowser &&
                            <Button
                                variant="dark"
                                style={{display: 'inline-block', right: '15px', position: 'absolute', top: '30px'}}
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
                        {filesDone > 0 && `${filesDone} files uploaded of ${selectedFiles.length}` }
                        <br/>
                        {filesDone > 0 && filesDone === selectedFiles.length && "Closing Modal in 2 seconds."}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={uploadFile}>Upload</Button>
                    <Button variant={'secondary'} onClick={props.handler}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UploadToS3;