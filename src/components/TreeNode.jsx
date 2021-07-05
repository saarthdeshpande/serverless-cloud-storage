import {useState} from 'react'
import { Entry, Icon, Name } from "@nteract/directory-listing";
import Button from 'react-bootstrap/esm/Button'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import UploadToS3 from "./UploadToS3.jsx";
import DeleteFromS3 from "./DeleteFromS3.jsx";
import { isMobile } from "react-device-detect";
import { Draggable, Droppable } from 'react-drag-and-drop'
import {NotificationManager} from 'react-notifications'
import ViewFile from './ViewFile.jsx'
import AWS_BUCKET from '../config/aws'

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

    const getSignedUrl = () => {
        const url = AWS_BUCKET.getSignedUrl('getObject', {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: abs_path,
            Expires: 60 * 5
        })
        window.location.href = url
    }

    const fileRenameForm = () => (
        <form onSubmit={e => {
            e.preventDefault()
            if (fileName === name) {
                toggleRename(!renameFile)
            } else if (props.siblings.filter(sibling => sibling.name === fileName).length > 0)
                NotificationManager.error(
                    <span style={{wordWrap: 'break-word', maxWidth: '80%'}}>
                        {fileName} already exists in {parent}
                    </span>,
                    'Name conflict!')
            else {
                moveFile({name: fileName, abs_path, folder}, parent)
                setTimeout(refreshTree, 2000)
                NotificationManager.success(
                    <span style={{wordWrap: 'break-word', maxWidth: '80%'}}>
                        {abs_path} renamed to {parent + '/' + fileName}
                    </span>,
                    'Success!')
            }
        }}
        >
            <input
                onChange={e => setFileName(e.target.value)}
                value={fileName}
                style={{display: 'inline-block', marginLeft: '10px'}}
                required
                pattern="[\_0-9A-Za-z\.]+"
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
                    alt={'yes'}
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
                    alt={'no'}
                />
            </Button>
        </form>
    )
    return (
        <div align={'left'}  style={{marginLeft: `${isMobile ? depth*20 : depth*15}px`}}>
            <Entry>
                <Icon fileType={folder ? "directory" : "file"}/>
                <Name>
                    {folder && (
                        renameFile ? (
                            <>
                                {fileRenameForm()}
                            </>

                    ) : (<Droppable
                            types={['file', 'folder']}
                            onDrop={({file, folder}) => {
                                const data = file ? JSON.parse(file) : JSON.parse(folder)
                                if (children?.filter(child => child.name === data.name).length > 0 || data.abs_path === abs_path)
                                    return NotificationManager.error(
                                        <span style={{wordWrap: 'break-word', maxWidth: '80%'}}>
                                            {data.name} already exists in {abs_path === '/' ? "root" : abs_path}
                                        </span>, 'Name conflict!')
                                else {
                                    moveFile(data, abs_path)
                                    setTimeout(refreshTree, 2000)
                                    NotificationManager.success(
                                        <span style={{wordWrap: 'break-word', maxWidth: '80%'}}>
                                            {data.name} moved to {root ? `root/${data.name}` : abs_path + '/' + data.name}
                                        </span>,
                                        'Success!')
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
                                            marginTop: '5px',
                                        }}
                                    >
                                        <Button
                                            variant={'link'}
                                            onClick={e => {
                                                e.preventDefault()
                                                toggleFolderView(!folderView)
                                            }}
                                            style={{
                                                display: 'inline-block',
                                                marginLeft: '0px',
                                                wordWrap: 'break-word',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {name}
                                        </Button>
                                    </Draggable>
                                }
                                {root &&
                                    <Button
                                        variant={'link'}
                                        onClick={e => {
                                            e.preventDefault()
                                            handler()
                                        }}
                                        style={{
                                            display: 'inline-block',
                                            marginLeft: '10px',
                                            wordWrap: 'break-word',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {name}
                                    </Button>
                                }
                                <UploadToS3
                                    refreshTree={refreshTree}
                                    open={upload}
                                    handler={toggleUpload.bind(this, !upload)}
                                    path={abs_path}
                                />
                                {!root &&
                                    <>
                                        <img
                                            src="https://img.icons8.com/material-sharp/24/000000/edit-file.png"
                                            onClick={toggleRename.bind(this, !renameFile)}
                                            style={{
                                                cursor: 'pointer',
                                                marginLeft: '14px'
                                            }}
                                            alt={'rename-folder'}
                                        />
                                        <DeleteFromS3
                                            refreshTree={refreshTree}
                                            folder={folder}
                                            handler={toggleDelete.bind(this, !deleteFile)}
                                            open={deleteFile}
                                            path={abs_path}
                                        />
                                    </>
                                }
                            </div>
                        </Droppable>
                        ))}
                    {!folder &&
                        (
                            renameFile ? (
                                <Dropdown>
                                    {fileRenameForm()}
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={toggleView.bind(this, !viewFile)}>View</Dropdown.Item>
                                        {!folder &&
                                            <ViewFile
                                                open={viewFile}
                                                handler={toggleView.bind(this, !viewFile)}
                                                abs_path={abs_path}
                                                name={name}
                                                url={url}
                                            />
                                        }
                                        <Dropdown.Item onClick={getSignedUrl}>Download</Dropdown.Item>
                                        <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>
                                            Delete File {name}
                                        </Dropdown.Item>
                                        <DeleteFromS3
                                            refreshTree={refreshTree}
                                            folder={folder}
                                            handler={toggleDelete.bind(this, !deleteFile)}
                                            open={deleteFile}
                                            path={abs_path}
                                        />
                                        <Dropdown.Item onClick={toggleRename.bind(this, !renameFile)}>
                                            Rename File {name}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) :  (
                            <Draggable type={'file'} data={JSON.stringify({name, abs_path, folder})}>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            color: 'black',
                                            wordWrap: 'break-word'
                                        }}
                                    >
                                        <span>
                                            {name}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={toggleView.bind(this, !viewFile)}>View</Dropdown.Item>
                                        <ViewFile
                                            open={viewFile}
                                            handler={toggleView.bind(this, !viewFile)}
                                            abs_path={abs_path}
                                            name={name}
                                            url={url}
                                        />
                                        <Dropdown.Item onClick={getSignedUrl}>Download</Dropdown.Item>
                                        <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>
                                            Delete File {name}
                                        </Dropdown.Item>
                                        <DeleteFromS3
                                            refreshTree={refreshTree}
                                            folder={folder}
                                            handler={toggleDelete.bind(this, !deleteFile)}
                                            open={deleteFile}
                                            path={abs_path}
                                        />
                                        <Dropdown.Item onClick={toggleRename.bind(this, !renameFile)}>
                                            Rename File {name}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Draggable>
                        )
                        )}
                </Name>
            </Entry>
            {folderView && folder && children.map(child =>
                <TreeNode key={child._id} refreshTree={refreshTree} siblings={children} {...child} />
            )}
        </div>
    )
}

export default TreeNode;
