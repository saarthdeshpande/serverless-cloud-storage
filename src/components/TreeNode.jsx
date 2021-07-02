import {useState} from 'react'
import { Entry, Icon, Name } from "@nteract/directory-listing";
import {Dropdown} from 'react-bootstrap'
import UploadToS3 from "./UploadToS3";
import DeleteFromS3 from "./DeleteFromS3";
import { isMobile } from "react-device-detect";
import { Button } from 'react-bootstrap'
import { Draggable, Droppable } from 'react-drag-and-drop'
import {NotificationManager} from 'react-notifications'
import ViewFile from './ViewFile'

import moveFile from '../utils/moveFile'

import './TreeNode.css'

const TreeNode = (props) => {
    const [folderView, toggleFolderView] = useState(false)
    const {name, folder, url, handler, abs_path, depth, refreshTree, children, root, parent} = props
    const [upload, toggleUpload] = useState(false)
    const [deleteFile, toggleDelete] = useState(false)
    const [viewFile, toggleView] = useState(false)
    const [renameFile, toggleRename] = useState(false)
    const [fileName, setFileName] = useState(name)
    const fileRenameForm = () => (
        <form onSubmit={e => {
            e.preventDefault()
            if (props.siblings.filter(sibling => sibling.name === fileName).length > 0)
                return NotificationManager.error(`${fileName} already exists in ${parent}`,
                    'Name conflict!')
            else {
                moveFile({name: fileName, abs_path, folder}, abs_path.replace(name, ''))
                setTimeout(refreshTree, 2000)
            }
        }}
        >
            <input
                onChange={e => setFileName(e.target.value)}
                value={fileName}
                style={{display: 'inline-block', marginLeft: '10px'}}
            />
            <Button
                style={{
                    display: 'inline-block',
                    marginLeft: '10px',
                    background: 'transparent',
                    height: '30px',
                    marginBottom: '4px'
                }}
                type={'submit'}
            >
                <img
                    style={{paddingBottom: '10px'}}
                    height={'25px'}
                    src="https://img.icons8.com/material-outlined/24/000000/checked-2--v1.png"
                />
            </Button>
            <Button
                type={'button'}
                variant={'danger'}
                style={{
                    display: 'inline-block',
                    marginLeft: '10px',
                    background: 'transparent',
                    height: '30px',
                    marginBottom: '4px'
                }}
                onClick={() => {
                    toggleRename(false)
                    setFileName(name)
                }}
            >
                <img
                    height={'25px'}
                    style={{paddingBottom: '10px'}}
                    src="https://img.icons8.com/ios/50/000000/x.png"
                />
            </Button>
        </form>
    )
    return (
        <div align={'left'}  style={{marginLeft: `${isMobile ? depth*20 : depth*15}px`}}>
            <Entry>
                <Icon fileType={folder ? "directory" : "file"}/>
                <Name>
                    {folder &&
                        <Droppable
                            types={['file', 'folder']}
                            onDrop={({file, folder}) => {
                                const data = file ? JSON.parse(file) : JSON.parse(folder)
                                if (children?.filter(child => child.name === data.name).length > 0)
                                    return NotificationManager.error(`${data.name} already exists in 
                                        ${abs_path === '/' ? "root" : abs_path}`, 'Name conflict!')
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
                                            {!renameFile &&
                                                <a
                                                    href={""}
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        toggleFolderView(!folderView)
                                                    }}
                                                    style={{display: 'inline-block', marginLeft: '10px'}}
                                                >
                                                    {name}
                                                </a>
                                            }
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
                                    {!renameFile &&
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
                                    }
                                    {renameFile && fileRenameForm()}
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
                                    <Dropdown.Item onClick={toggleRename.bind(this, !renameFile)}>Rename File {name}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Draggable>
                    }
                </Name>
            </Entry>
            {folderView && folder && children.map(child =>
                <TreeNode key={child._id} refreshTree={refreshTree} siblings={children} {...child} />
            )}
        </div>
    )
}

export default TreeNode;
