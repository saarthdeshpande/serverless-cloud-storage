import React from "react";

import { Document, Page, pdfjs } from 'react-pdf';

import Button from "react-bootstrap/Button";
import Jupyter from 'react-jupyter';
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import io from "socket.io-client";

import AWS_BUCKET from '../config/aws'

import './ViewFile.css'
import {TerminalUI} from "./TerminalUI";


class ViewButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeFile: null,
            extension: /(?:\.([^.]+))?$/.exec(this.props.name)[0].toLowerCase(),
            numPages: 0,
            pageNumber: 1,
            text: null,
            zippedFiles: [],
            terminal: undefined,
        }
        this.ref = React.createRef()
        this.socket = null
        this.serverAddress = "https://terminal-shscs.herokuapp.com";
    }

    modalSet = () => {
        this.props.handler()
        if (this.state.zippedFiles) {
            this.setState({ pageNumber: 1 })
            this.setState({ activeFile: null })
        }
        if (this.socket !== null) {
            this.state.terminal.closeConnection()
        }
    }

    getData = async () => {
        try {
            var getParams = {
                Bucket: process.env.REACT_APP_S3_BUCKET, // your bucket name,
                Key: this.props.abs_path // path to the object you're looking for
            }
            const data = await AWS_BUCKET.getObject(getParams).promise()
            if (this.state.extension === '.zip') {
                return data.Body
            } else if (this.state.extension === '.pdf') {
                return "data:application/pdf;base64," + data.Body.toString('base64')
            } else if((this.state.extension.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) || {}).input) {
                return `data:image/${this.state.extension};base64,` + data.Body.toString('base64')
            }
            return data.Body.toString('utf-8')
        } catch (e) {
            throw new Error(`Could not retrieve file from S3: ${e.message}`)
        }
    }

    getContainer = () => {
        this.socket = io(this.serverAddress, {
            reconnection: true,
            withCredentials: true,
        })
        document.getElementById('open-terminal').disabled=true
        this.startTerminal(this.ref.current, this.socket);
    }

    startTerminal = (container, socket) => {
        // Create an xterm.js instance (TerminalUI class is a wrapper with some utils. Check that file for info.)
        this.setState({ terminal: new TerminalUI(socket) }, () => {

            // Attach created terminal to a DOM element.
            this.state.terminal.attachTo(container, this.props.url, this.props.name);

            // When terminal attached to DOM, start listening for input, output events.
            // Check TerminalUI startListening() function for details.
            this.state.terminal.startListening();
        })
    }


    componentDidMount() {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.getData()
            .then(text => {
                if (this.state.extension === '.zip') {
                    const blob = new Blob([text], { type: 'application/zip' })
                    const zip = window.zip
                    zip.createReader(new zip.BlobReader(blob), (reader) => {
                        reader.getEntries(entries => {
                            if (entries.length) {
                                let zippedFiles = []
                                for (const entry of entries)
                                    if (entry.filename.substring(entry.filename.lastIndexOf('/'),).includes('.'))
                                        zippedFiles.push(entry)
                                this.setState({ zippedFiles })
                            }
                        });
                    }, function(error) {
                        console.log(error)
                    });
                } else {
                    this.setState({ text })
                }
            })
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    stateHandler = () => {
        this.setState({ text: undefined })
        this.setState({ pageNumber: 1 })
        this.setState({ activeFile: null })
    }

    zipListButton = () => (
            <Button
                title={'List of Files'}
                style={{
                    background: 'transparent',
                }}
                className={'file-list-btn'}
                onClick={this.stateHandler}
            >
                <img
                    src="https://img.icons8.com/cotton/32/000000/list--v1.png"
                    alt={'file-list'}
                />
            </Button>
    )

    selectComponent = () => {
        const filter = this.state.activeFile ? /(?:\.([^.]+))?$/.exec(this.state.activeFile)[0].toLowerCase()
                        : this.state.extension
        switch(filter) {
            case (filter.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) || {}).input:
                return (
                    <img
                        src={this.state.text}
                        style={{
                            maxHeight: '50vh'
                        }}
                        alt={'file-display'}
                    />
                )
            case (filter.match(/\.(avi|wmv|flv|mpg|mp4)$/i) || {}).input:
                return (
                    <video
                        controls
                        src={this.state.text}
                        style={{
                            maxHeight: '50vh'
                        }}
                        alt={'file-video'}
                    />
                )
            case '.pdf':
                return (
                    <div align={'center'}>
                        <div style={{display: 'inline-block', marginTop: '10px'}}>
                            <img
                                src="https://img.icons8.com/fluent-systems-filled/96/000000/left.png"
                                alt={'pdf-left'}
                                style={{
                                    width: '10%',
                                    height: '10%',
                                    cursor: this.state.pageNumber > 1 ? 'pointer' : 'default',
                                    marginRight: '7px',
                                }}
                                onClick={() =>
                                    this.state.pageNumber > 1 ?
                                        this.setState({ pageNumber: this.state.pageNumber - 1 }) :
                                        ''
                                }
                            />
                            <span>Page {this.state.pageNumber} of {this.state.numPages}</span>
                            <img
                                src="https://img.icons8.com/fluent-systems-filled/96/000000/right.png"
                                alt={'pdf-right'}
                                style={{
                                    width: '10%',
                                    height: '10%',
                                    cursor: this.state.pageNumber < this.state.numPages ? 'pointer' : 'default',
                                    marginLeft: '5px',
                                    marginBottom: '1px'
                                }}
                                onClick={() =>
                                    this.state.pageNumber < this.state.numPages ?
                                        this.setState({ pageNumber: this.state.pageNumber + 1 })
                                        : ''
                                }
                            />
                        </div>
                        <Document
                            file={this.state.text}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <Page pageNumber={this.state.pageNumber} />
                        </Document>
                    </div>
                )
            case '.ipynb':
                return (
                    <Jupyter
                        notebook={JSON.parse(this.state.text)}
                        showCode={true} // optional
                        loadMathjax={true} // optional
                    />
                )
            case '.zip':
                return (
                    <div align={'center'}>
                        {this.state.zippedFiles.map(zippedFile => (
                            <div key={zippedFile.crc32 + zippedFile.filename}>
                                <Button
                                    onClick={() => {
                                        this.setState({ activeFile: zippedFile.filename })
                                        if (/(?:\.([^.]+))?$/.exec(zippedFile.filename)[0].toLowerCase() === '.pdf'
                                            || (/(?:\.([^.]+))?$/.exec(zippedFile.filename)[0].toLowerCase())
                                                .match(/\.(gif|jpe?g|tiff?|png|webp|bmp|avi|wmv|flv|mpg|mp4)$/i)
                                        ) {
                                            zippedFile.getData(new window.zip.BlobWriter(), (text) => {
                                                // text contains the entry data as a String
                                                let type;
                                                const filter = /(?:\.([^.]+))?$/.exec(zippedFile.filename)[0].toLowerCase()
                                                switch(filter) {
                                                    case '.pdf':
                                                        type = 'application/pdf'
                                                        break;
                                                    case (filter.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) || {}).input:
                                                        type = `image/${zippedFile.filename.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)}`
                                                        break;
                                                    case (filter.match(/\.(avi|wmv|flv|mpg|mp4)$/i) || {}).input:
                                                        type = 'video/mp4'
                                                        break;
                                                    default:
                                                        type = 'text/plain'
                                                        break;

                                                }
                                                const fileText = new Blob([text], { type });
                                                this.setState({ text: URL.createObjectURL(fileText) })
                                            }, function(current, total) {
                                                // onprogress callback
                                            });
                                        } else {
                                            zippedFile.getData(new window.zip.TextWriter(), (text) => {
                                                // text contains the entry data as a String
                                                this.setState({ text })
                                            }, function(current, total) {
                                                // onprogress callback
                                            });
                                        }
                                    }}
                                    style={{
                                        marginBottom: '5px',
                                        marginTop: '5px',
                                        maxWidth: '90%',
                                        wordWrap: 'break-word'
                                    }}
                                >
                                    {zippedFile.filename}
                                </Button>
                            </div>
                        ))}
                    </div>
                )
            default:
                return (
                    <textarea
                        rows="21"
                        value={this.state.text || undefined}
                        style={{
                            color: 'white',
                            backgroundColor: 'black',
                            width: "110%"
                        }}
                        readOnly
                    />
                )
        }
    }

    render() {
        return (
            <Modal
                show={this.props.open}
                onHide={this.modalSet}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <span style={{
                        maxWidth: '80%',
                        wordWrap: 'break-word'
                    }}>
                        {this.props.name}
                    </span>
                    <Button
                        id='open-terminal'
                        onClick={this.getContainer}
                        title='Terminal'
                        className='console-btn'
                    >
                        >_
                    </Button>
                    <Button variant={'secondary'} onClick={() => {
                        this.modalSet()
                    }}>X</Button>
                </Modal.Header>
                <Container fluid="xl">
                    <Row>
                        {/*<Col>*/}
                            {this.state.activeFile && this.zipListButton()}
                            {this.selectComponent()}
                        {/*</Col>*/}
                    </Row>
                        <Row>
                            <div ref={this.ref}></div>
                        </Row>
                </Container>
                <Modal.Footer>
                    <Button variant={'secondary'} onClick={() => {
                        this.modalSet()
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ViewButton;
