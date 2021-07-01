import React from 'react';
import { Listing } from "@nteract/directory-listing";
import getData from "./DownloadFromS3";
import TreeView from './components/TreeView'
import TreeNode from './components/TreeNode'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tree: [],
            folderOpen: true
        }
        this.refreshTree = this.refreshTree.bind(this)
        this.toggleFolder = this.toggleFolder.bind(this)
    }

    toggleFolder = () => this.setState({ folderOpen: !this.state.folderOpen })

    refreshTree = async () => {
        const tree = await getData()
        this.setState({ tree })
    }

    async componentDidMount() {
        const tree = await getData()
        this.setState({ tree })
    }

    render() {
    console.log(this.state.tree)
        return (
            <div>
                {this.state.tree.length > 0 &&
                    <Listing>
                        <TreeNode name={'root'} folder={true} refreshTree={this.refreshTree} handler={this.toggleFolder} root={true} />
                        {this.state.folderOpen && <TreeView refreshTree={this.refreshTree} tree={this.state.tree}/>}
                    </Listing>
                }
            </div>

        );
    }
}

export default App;
