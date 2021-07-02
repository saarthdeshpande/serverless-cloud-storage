import React from "react";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import {Modal, Button} from "react-bootstrap";
import Jupyter from 'react-jupyter'

import './ViewFile.css'

class ViewButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeFile: null,
            extension: /(?:\.([^.]+))?$/.exec(this.props.name)[0],
            numPages: 0,
            pageNumber: 1,
            text: null,
            zippedFiles: [],
        }
    }

    modalSet = () => {
        this.props.handler()
        if (this.state.zippedFiles) {
            this.setState({ pageNumber: 1 })
            this.setState({ activeFile: null })
        }
    }

    componentDidMount() {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        fetch(this.props.url)
            .then(res => this.state.extension === '.zip' ? res.blob() : res.text())
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
        const filter = this.state.activeFile ? /(?:\.([^.]+))?$/.exec(this.state.activeFile)[0] : this.state.extension
        switch(filter) {
            case (filter.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) || {}).input:
                return (
                    <img
                        src={this.state.activeFile ? this.state.text : this.props.url}
                        style={{
                            maxHeight: '50vh'
                        }}
                        alt={'file-image'}
                    />
                )
            case '.pdf':
                return (
                    <div align={'center'}>
                        <img
                            src="https://img.icons8.com/fluent-systems-filled/96/000000/left.png"
                            alt={'pdf-left'}
                            style={{
                                width: '2%',
                                height: '2%',
                                cursor: this.state.pageNumber > 1 ? 'pointer' : 'default',
                                marginRight: '5px'
                            }}
                            onClick={() =>
                                this.state.pageNumber > 1 ?
                                    this.setState({ pageNumber: this.state.pageNumber - 1 }) :
                                    ''
                            }
                        />
                        Page {this.state.pageNumber} of {this.state.numPages}
                        <img
                            src="https://img.icons8.com/fluent-systems-filled/96/000000/right.png"
                            alt={'pdf-right'}
                            style={{
                                width: '2%',
                                height: '2%',
                                cursor: this.state.pageNumber < this.state.numPages ? 'pointer' : 'default',
                                marginLeft: '5px'
                            }}
                            onClick={() =>
                                this.state.pageNumber < this.state.numPages ?
                                    this.setState({ pageNumber: this.state.pageNumber + 1 })
                                    : ''
                            }
                        />
                        <Document
                            file={this.state.extension === '.zip' ? this.state.text : this.props.url}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <Page pageNumber={this.state.pageNumber} />
                        </Document>
                    </div>
                )
            case '.ipynb':
                return (
                    <Jupyter
                        notebook={JSON.parse(this.state.fileUrl)}
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
                                        if (/(?:\.([^.]+))?$/.exec(zippedFile.filename)[0] === '.pdf'
                                            || (/(?:\.([^.]+))?$/.exec(zippedFile.filename)[0]).match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
                                            zippedFile.getData(new window.zip.BlobWriter(), (text) => {
                                                // text contains the entry data as a String
                                                const type = /(?:\.([^.]+))?$/.exec(zippedFile.filename)[0] === '.pdf' ?
                                                    'application/pdf' : `image/${zippedFile.filename.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)}`
                                                const pdfText = new Blob([text], { type });
                                                this.setState({ text: URL.createObjectURL(pdfText) })
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
                    <textarea rows="20" value={this.state.text} style={{color: 'white', backgroundColor: 'black'}} readOnly />
                )
        }
    }

    render() {
        return (
            <Modal
                show={this.props.open}
                onHide={this.modalSet}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    {this.props.name}
                    <Button variant={'secondary'} onClick={() => {
                        this.stateHandler()
                        this.props.handler()
                    }}>X</Button>
                </Modal.Header>
                {this.state.activeFile && this.zipListButton()}
                {this.selectComponent()}
                <Modal.Footer>
                    <Button variant={'secondary'} onClick={() => {
                        this.stateHandler()
                        this.props.handler()
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ViewButton;
