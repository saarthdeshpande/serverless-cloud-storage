import React from 'react';
import { Listing } from "@nteract/directory-listing";
import getData from "./utils/downloadFromS3";
import TreeView from './components/TreeView.jsx'
import SearchField from "react-search-field"
import TreeNode from './components/TreeNode.jsx'
import {NotificationContainer} from 'react-notifications'
import SearchList from './components/SearchList.js'
import Button from 'react-bootstrap/Button'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            tree: [],
            folderOpen: true,
            arrayOfMatches: [],
            searching: false,
            tempArray: []
        }
        this.refreshTree = this.refreshTree.bind(this)
        this.toggleFolder = this.toggleFolder.bind(this)
        this.searchInTree = this.searchInTree.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    toggleFolder = () => this.setState({ folderOpen: !this.state.folderOpen })

    refreshTree = async () => {
        const tree = await getData()
        this.setState({ tree })
    }

    searchInTree = (arr, value) => {
        arr.forEach(treeNode => {
            let nodeName = treeNode.name.toLowerCase();
            if(nodeName.includes(value)) {
                if(!treeNode.children) {
                    let tempArray = this.state.arrayOfMatches;
                    tempArray.push(treeNode);
                    this.setState({arrayOfMatches:tempArray});
                }
            }
            if(treeNode.children) {
                this.searchInTree(treeNode.children,value);
            }
        });
        return;
    }

    handleSearch = (value, event=null) => {
        this.searchInTree(this.state.tree,value);
        this.setState({tempArray:this.state.arrayOfMatches});
        this.setState({arrayOfMatches:[]});
    }

    async componentDidMount() {
        const tree = await getData()
        this.setState({ tree });
    }

    handleOnChange = (value, event) => {
        if(value.toLowerCase().length) this.setState({searching:true});
        else this.setState({searching:false});
        this.handleSearch(value.toLowerCase(),event);
    }

    render() {
        return (
            <div align={'center'} style={{marginTop: '10px'}}>
                <SearchField
                    placeholder="Search Files"
                    onEnter={this.handleSearch}
                    onSearchClick={this.handleSearch}
                    onChange={this.handleOnChange}
                />
                    {
                        this.state.searching?(<SearchList props={this.state.tempArray}/>):
                        ((this.state.tree.length >= 0) &&
                            <Listing>
                                <TreeNode abs_path={'/'} name={'root'} children={this.state.tree} folder={true} refreshTree={this.refreshTree} handler={this.toggleFolder} root={true} />
                                {this.state.folderOpen && <TreeView refreshTree={this.refreshTree} tree={this.state.tree}/>}
                            </Listing>
                        )
                    }
                    <Button onClick={() => {
                        localStorage.removeItem('refresh_token')
                        window.location.reload()
                    }} style={{position: 'absolute', right: '15px', top: '10px'}}>Logout</Button>
                <NotificationContainer/>
            </div>
        );
    }
}

export default App;
