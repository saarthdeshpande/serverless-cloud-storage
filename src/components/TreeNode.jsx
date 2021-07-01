import {useState} from 'react'
import { Entry, Icon, Name } from "@nteract/directory-listing";
import {Dropdown} from 'react-bootstrap'
import UploadToS3 from "./UploadToS3";
import DeleteFromS3 from "./DeleteFromS3";
import { isMobile } from "react-device-detect";

import './TreeNode.css'

const TreeNode = ({name, folder, url, handler, abs_path, depth, refreshTree, children, root}) => {
    const [upload, toggleUpload] = useState(false)
    const [deleteFile, toggleDelete] = useState(false)
    return (
        <div align={'left'}  style={{marginLeft: `${isMobile ? depth*10 : depth*3}vw`}}>
            <Entry>
                <Icon fileType={folder ? "directory" : "file"}/>
                <Name>
                    {folder &&
                        <div>
                            <a
                                href={""}
                                onClick={e => {
                                    e.preventDefault()
                                    handler()
                                }}
                                style={{display: 'inline-block', marginLeft: '10px'}}
                            >
                                {name}
                            </a>
                            <UploadToS3
                                refreshTree={refreshTree}
                                open={upload}
                                handler={toggleUpload.bind(this, !upload)}
                                path={abs_path}
                            />
                            {!root && <DeleteFromS3
                                refreshTree={refreshTree}
                                folder={folder}
                                handler={toggleDelete.bind(this, !deleteFile)}
                                open={deleteFile}
                                path={abs_path}
                            />}
                        </div>

                    }
                    {!folder &&
                        <Dropdown>
                            <Dropdown.Toggle
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'black',
                                }}
                            >
                                <span>{name}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={folder ? "#" : url}>Download</Dropdown.Item>
                                <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>Delete File {name}</Dropdown.Item>
                                <DeleteFromS3 refreshTree={refreshTree} folder={folder} handler={toggleDelete.bind(this, !deleteFile)} open={deleteFile} path={abs_path} />
                                <Dropdown.Item href="#/action-3">Rename File {name}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Name>
            </Entry>
        </div>
    )
}

export default TreeNode;
