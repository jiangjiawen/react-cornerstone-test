import React from "react";
import filesys from "../api/filesys";
import FileList from "./fileList";
import { getfilename } from "../utils/getfilename";
import DicomDetail from "./dicomDetail";

class App extends React.Component {

  state = { maincontent: [], selectedContent: null };

 

  componentDidMount() {
    this.onMainSubmit("/server/");
  }

  onMainSubmit = async term => {
    const response = await filesys.get(term);

    this.setState({
      maincontent: response.data
    });
  };

  onFileSelect = file => {
    this.setState({ selectedContent: file });
  };

  render() {
    const filenames = getfilename(this.state.maincontent);

    return (
      <div className="ui container">
        <div className="ui grid">
          <div className="ui row">
            <div className="five wide column">
              <FileList
                files={filenames}
                onFileSelect={this.onFileSelect}
                id="select-file"
              />
            </div>
            <div className="eleven wide column">
              <DicomDetail file={this.state.selectedContent}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
