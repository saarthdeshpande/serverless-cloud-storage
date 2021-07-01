import {useState} from 'react'
import { Entry, Icon, Name } from "@nteract/directory-listing";
import {Dropdown} from 'react-bootstrap'
import UploadToS3 from "./UploadToS3";
import DeleteFromS3 from "./DeleteFromS3";
import { isMobile } from "react-device-detect";
import { Draggable, Droppable } from 'react-drag-and-drop'
import {NotificationManager} from 'react-notifications'
import ViewFile from './ViewFile'

import moveFile from '../utils/moveFile'

import './TreeNode.css'

const TreeNode = (props) => {
    const {name, folder, url, handler, abs_path, depth, refreshTree, children, root} = props
    const [upload, toggleUpload] = useState(false)
    const [deleteFile, toggleDelete] = useState(false)
    const [viewFile, toggleView] = useState(false)
    return (
        <div align={'left'}  style={{marginLeft: `${isMobile ? depth*10 : depth*3}vw`}}>
            <Entry>
                <Icon fileType={folder ? "directory" : "file"}/>
                <Name>
                    {folder &&
                        <Droppable
                            types={['file', 'folder']}
                            onDrop={({file, folder}) => {
                                const data = file ? JSON.parse(file) : JSON.parse(folder)
                                if (children.filter(child => child.name === data.name).length > 0)
                                    return NotificationManager.error(`${data.name} already exists in ${abs_path}`,
                                        'Name conflict!')
                                else {
                                    moveFile(data, abs_path)
                                    setTimeout(refreshTree, 2000)
                                }
                            }}
                        >
                                <div>
                                    {!root &&
                                        <Draggable
                                            type={'folder'}
                                            data={JSON.stringify({name, abs_path, folder})}
                                            style={{
                                                display: 'inline-block',
                                                marginTop: '5px'
                                            }}
                                        >
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
                                        </Draggable>
                                    }
                                    {root &&
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
                                    }
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
                        </Droppable>

                    }
                    {!folder &&
                        <Draggable type={'file'} data={JSON.stringify({name, abs_path, folder})}>
                                <Dropdown>
                                <Dropdown.Toggle
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'black',
                                    }}
                                >
                                    <span>
                                        {name}
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={toggleView.bind(this, !viewFile)}>View</Dropdown.Item>
                                    {!folder &&
                                        <ViewFile
                                            open={viewFile}
                                            handler={toggleView.bind(this, !viewFile)}
                                            name={name}
                                            url={url}
                                        />
                                    }
                                    <Dropdown.Item href={folder ? "#" : url}>Download</Dropdown.Item>
                                    <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>Delete File {name}</Dropdown.Item>
                                    <DeleteFromS3 refreshTree={refreshTree} folder={folder} handler={toggleDelete.bind(this, !deleteFile)} open={deleteFile} path={abs_path} />
                                    <Dropdown.Item href="#/action-3">Rename File {name}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Draggable>
                    }
                </Name>
            </Entry>
        </div>
    )
}

export default TreeNode;
