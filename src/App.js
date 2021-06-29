import React from 'react';
import FolderTree from 'react-folder-tree';
import UploadToS3 from "./components/UploadToS3";
import getData from "./DownloadFromS3";

import './App.css';
import 'react-folder-tree/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tree: {},
            uploadFile: false
        }
        this.uploadHandler = this.uploadHandler.bind(this)
    }


    async componentDidMount() {
        const tree = await getData()
        this.setState({ tree })
    }

    uploadHandler = () => this.setState({ uploadFile: !this.state.uploadFile })

    onNameClick = ({ nodeData }) => {
        if (!nodeData.folder) {
            const link = document.createElement('a');
            link.href = nodeData.url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        // event.preventDefault()
        // switch (event.type) {
        //     case 'renameNode':
        //         break;
        //     case 'addNode':
        //         this.setState({ uploadFile: true })
        //         break;
        // }
        console.log(nodeData)
    };

    render() {
        return (
            <div>
                <UploadToS3 open={this.state.uploadFile} handler={this.uploadHandler} />
                <FolderTree
                    data={ this.state.tree }
                    onNameClick={ this.onNameClick }
                    showCheckbox={ true }
                    indentPixels={ 50 }
                />
            </div>

        );
    }
}

export default App;
