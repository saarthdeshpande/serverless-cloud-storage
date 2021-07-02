import React, {useState} from 'react'
import TreeNode from './TreeNode'


const TreeView = ({ tree, refreshTree }) => {
    const [folderView, toggleFolderView] = useState(false)
    return (
        <React.Fragment>
            {tree?.map(child => (
                <div key={child._id}>
                    <TreeNode siblings={tree} refreshTree={refreshTree} handler={toggleFolderView.bind(this, !folderView)} {...child} />
                    {folderView && child.folder && <TreeView refreshTree={refreshTree} tree={child.children}/>}
                </div>
                )
            )}
        </React.Fragment>
    )
}

export default TreeView;
