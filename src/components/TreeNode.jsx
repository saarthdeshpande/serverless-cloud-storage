import {useState} from 'react'
import { Entry, Icon, Name } from "@nteract/directory-listing";
import {Dropdown} from 'react-bootstrap'
import UploadToS3 from "./UploadToS3";
import { isMobile } from "react-device-detect";


const TreeNode = ({name, folder, url, handler, abs_path, depth}) => {
    const [upload, toggleUpload] = useState(false)
    return (
        <div align={'left'}  style={{marginLeft: `${isMobile ? depth*10 : depth*5}vw`}}>
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
                            <UploadToS3 open={upload} handler={toggleUpload.bind(this, !upload)} path={abs_path} />
                        </div>

                    }
                    {!folder &&
                        <Dropdown>
                            <Dropdown.Toggle
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'black'
                                }}
                            >
                                <span>{name}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={folder ? "#" : url}>Download</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Delete File {name}</Dropdown.Item>
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
