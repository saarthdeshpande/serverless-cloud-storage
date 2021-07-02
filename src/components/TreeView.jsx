import React, {useState} from 'react'
import TreeNode from './TreeNode'


const TreeView = ({ tree, refreshTree }) => {
    return (
        <React.Fragment>
            {tree?.map(child => (
                <div key={child._id}>
                    <TreeNode siblings={tree} refreshTree={refreshTree} {...child} />
                </div>
                )
            )}
        </React.Fragment>
    )
}

export default TreeView;
