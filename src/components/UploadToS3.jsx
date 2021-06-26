import React , {useState} from 'react';
import { Modal, Button } from "react-bootstrap";
import AWS_BUCKET from "../config";

import 'bootstrap/dist/css/bootstrap.min.css';


const UploadToS3 = () => {
    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalShow, setModalShow] = useState(false);

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
                        setModalShow(false)
                        setProgress(0)
                    }, 5000)
                }
                setSelectedFile(null)
            })
    }


    return (
        <div>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                Upload File / Folder
            </Button>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload File / Folder
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div align={'center'}>
                        <input type="file" onChange={handleFileInput}/>
                        <div style={{ paddingTop: '20px'}}>
                            File Upload Progress: <b style={{ color: progress === 100 ? 'green' : 'red' }}>{progress}%</b>
                        </div>
                        {progress === 100 && "Closing Modal in 5 seconds."}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => uploadFile(selectedFile)}>Upload</Button>
                    <Button variant={'secondary'} onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UploadToS3;