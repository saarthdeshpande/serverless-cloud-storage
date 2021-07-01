import { Name, Entry, Icon } from "@nteract/directory-listing";
import { useState } from "react";
import { Draggable, Droppable } from 'react-drag-and-drop'
import DeleteFromS3 from "./components/DeleteFromS3"
import { isMobile } from "react-device-detect";
import {Dropdown} from 'react-bootstrap'

const Search = ({props}) => {
    const [deleteFile, toggleDelete] = useState(false)
    console.log(props);
    return (
        <div>
            {
                props.map((file, index) => {
                    const {name, folder, url, handler, abs_path, depth, refreshTree, children, root} = file
                    return (
                        <div key={index} align={'left'}  style={{marginLeft: `${isMobile ? 10 : 3}vw`, display: 'flex', alignItems: 'center'}}>
                            <Entry>
                                <Icon fileType={folder ? "directory" : "file"}/>
                            <Name>
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
                                        <span>{name}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href={folder ? "#" : url}>Download</Dropdown.Item>
                                        <Dropdown.Item onClick={toggleDelete.bind(this, !deleteFile)}>Delete File {name}</Dropdown.Item>
                                        <DeleteFromS3 refreshTree={refreshTree} folder={folder} handler={toggleDelete.bind(this, !deleteFile)} open={deleteFile} path={abs_path} />
                                        <Dropdown.Item href="#/action-3">Rename File {name}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Draggable>
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
