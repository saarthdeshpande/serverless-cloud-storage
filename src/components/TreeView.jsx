import React, {useState} from 'react'
import TreeNode from './TreeNode'


const TreeView = ({ tree }) => {
    const [folderView, toggleFolderView] = useState(false)
    console.log(tree)
    return (
        <React.Fragment>
            {tree?.map(child => (
                <div key={child._id}>
                    <TreeNode handler={toggleFolderView.bind(this, !folderView)} {...child} />
                    {folderView && child.folder && <TreeView tree={child.children}/>}
                </div>
                )
            )}
        </React.Fragment>
    )
}

export default TreeView;
