import React from 'react'
import TreeNode from './TreeNode.jsx'


const TreeView = ({ tree, refreshTree }) => {
    return (
        <React.Fragment>
            {tree?.map(child => (
                <TreeNode key={child._id} siblings={tree} refreshTree={refreshTree} {...child} />
                )
            )}
        </React.Fragment>
    )
}

export default TreeView;
