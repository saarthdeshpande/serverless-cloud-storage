import React , {useState} from 'react';
import { Modal, Button } from "react-bootstrap";
import AWS_BUCKET from "../config/aws";


import { isMobile, isBrowser } from "react-device-detect";


const UploadToS3 = (props) => {
    const [progress , setProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [folder, setFolder] = useState(false)
    const [filesDone, setFilesDone] = useState(0)
    const [uploading, setUploading] = useState(false)

    const handleFileInput = (e) => {
        setSelectedFiles(e.target.files);
    }

    const closeModal = () => {
        setProgress(0)
        setSelectedFiles([])
        setFilesDone(0)
        setUploading(false)
        props.handler()
    }

    const uploadFile = () => {
        setUploading(true)
        const updateLocalData = setInterval(() => {
            if (filesDone > 0 && filesDone === selectedFiles.length) {
                props.refreshTree()
                closeModal()
                clearInterval(updateLocalData)
            }
        }, 2000)
        Array.from(selectedFiles)?.forEach((file) => {
            let Key;
            if (folder)
                Key = props.path !== "/" ? props.path + '/' +  file.webkitRelativePath : file.webkitRelativePath
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
                    if (evt.loaded === evt.total) {
                        setFilesDone(filesDone => filesDone + 1)
                    }
                })
                .send((err) => {
                    if (err) console.log(err)
                })
        })
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
                onHide={uploading ? () => null : props.handler}
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
                                {!uploading && <Button
                                    variant="dark"
                                    style={{display: 'inline-block', right: '15px', position: 'absolute', top: '30px'}}
                                    onClick={setFolder.bind(this, !folder)}
                                >
                                    Upload {folder ? "Files instead?" : "a Folder instead?"}
                                </Button>}
                            </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div align={'center'}>
                        {isMobile ? (
                                <form onSubmit={e => e.preventDefault()}>
                                    {!uploading && <input required type="file" id="ctrl" onChange={handleFileInput} multiple/>}
                                    <div style={{paddingTop: '20px'}}>
                                        File Upload Progress:
                                        <b style={{color: progress === 100 ? 'green' : 'red'}}>
                                            {progress}%
                                        </b>
                                    </div>
                                </form>
                            ) :
                            (<React.Fragment>
                                <form onSubmit={e => e.preventDefault()}>
                                    {folder ?
                                            !uploading && <input
                                                type="file"
                                                onChange={handleFileInput}
                                                webkitdirectory={""}
                                                directory={""}
                                                multiple
                                                required
                                            />
                                            :
                                            !uploading && <input
                                                type="file"
                                                onChange={handleFileInput}
                                                multiple
                                                required
                                            />
                                    }
                                </form>
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
                {!uploading && <Modal.Footer>
                    <Button onClick={uploadFile}>Upload</Button>
                    <Button variant={'secondary'} onClick={closeModal}>Close</Button>
                </Modal.Footer>}
            </Modal>
        </div>
    )
}

export default UploadToS3;