import { useState } from "react";

import Dropdown from 'react-bootstrap/Dropdown'
import { Name, Entry, Icon } from "@nteract/directory-listing/";
import { isMobile } from "react-device-detect";
import ViewFile from './ViewFile.jsx'

import DeleteFromS3 from "./DeleteFromS3.jsx"


const Search = ({props}) => {
    const [deleteFile, toggleDelete] = useState(false)
    const [viewFile, toggleView] = useState(false)
    return (
        <div>
            {
                props.map((file) => {
                    const {name, folder, url, abs_path, refreshTree} = file
                    return (
                        <div key={file._id} align={'left'}  style={{marginLeft: `${isMobile ? 10 : 3}vw`, display: 'flex', alignItems: 'center'}}>
                            <Entry>
                                <Icon fileType={"file"}/>
                                <Name>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                outline: 'none',
                                                color: 'black',
                                                display: 'flex',
                                            }}
                                        >
                                            <span>{name}</span>
                                            <span style={{color: 'grey', fontSize: '10px', marginLeft: '30px', marginTop: '7px'}}>{abs_path}</span>
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
                                            <Dropdown.Item href={url}>Download</Dropdown.Item>
                                            <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>Delete File {name}</Dropdown.Item>
                                            <DeleteFromS3
                                                refreshTree={refreshTree}
                                                folder={folder}
                                                handler={toggleDelete.bind(this, !deleteFile)}
                                                open={deleteFile}
                                                path={abs_path}
                                            />
                                            <Dropdown.Item href="#/action-3">Rename File {name}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Name>
                            </Entry>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Search
