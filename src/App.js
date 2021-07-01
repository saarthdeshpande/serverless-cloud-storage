import React from 'react';
import { Listing } from "@nteract/directory-listing";
import getData from "./DownloadFromS3";
import TreeView from './components/TreeView'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tree: [],
        }
    }


    async componentDidMount() {
        const tree = await getData()
        this.setState({ tree })
    }

    render() {

        return (
            <div>
                {this.state.tree.length > 0 &&
                    <Listing>
                        <TreeView tree={this.state.tree}/>
                    </Listing>
                }
            </div>

        );
    }
}

export default App;
