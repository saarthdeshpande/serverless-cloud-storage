import React from 'react';
import FolderTree, { testData } from 'react-folder-tree';
import UploadToS3 from "./components/UploadToS3";
import fetchFromS3 from "./DownloadFromS3";

import './App.css';
import 'react-folder-tree/dist/style.css';


class App extends React.Component {

    componentDidMount() {
        fetchFromS3()
            .then(r => console.log(r))
    }

    onTreeStateChange = (state, event) => console.log(state, event);

    render() {
        return (
            <div>
                <UploadToS3 />
                <FolderTree
                    data={ testData }
                    onChange={ this.onTreeStateChange }
                    showCheckbox={ false }
                    indentPixels={ 50 }
                />
            </div>

        );
    }
}

export default App;
