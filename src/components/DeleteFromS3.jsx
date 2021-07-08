import React from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import AWS_BUCKET from "../config/aws";


const DeleteFromS3 = (props) => {
    const deleteFile = () => {
        let params = {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Prefix: props.path
        }
        AWS_BUCKET.listObjectsV2(params, function(err, data) {
            if (err) return console.log(err);

            if (data.Contents.length === 0) return;

            params = {Bucket: process.env.REACT_APP_S3_BUCKET};
            params.Delete = {Objects:[]};

            data.Contents.forEach(function(content) {
                params.Delete.Objects.push({Key: content.Key});
            });

            AWS_BUCKET.deleteObjects(params, function(err, data) {
                if (err) return console.log(err);
                if(data.Contents?.length === 1000) deleteFile();
                else return;
            });
        });
        setTimeout(() => {
            props.handler()
            props.refreshTree()
        }, 2000)
    }
    return (
        <div style={{display: props.folder ? 'inline-block' : 'none'}}>
            {props.folder === true && <img
                style={{
                    display: 'inline-block',
                    marginLeft: '15px',
                    marginBottom: '3px',
                    cursor: 'pointer'
                }}
                src={"https://img.icons8.com/material-outlined/24/000000/trash.png"}
                alt={'delete'}
                onClick={props.handler}
            />}
            <Modal
                show={props.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={props.handler}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <>
                            Delete {props.folder ? "Folder" : "File"} <br/>
                            <span style={{fontSize: '20px', color: 'red'}}>
                                {props.path}
                            </span>
                        </>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant={'danger'} onClick={deleteFile}>Delete</Button>
                    <Button variant={'secondary'} onClick={props.handler}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteFromS3;
