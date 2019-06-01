import React from "react";
import filesys from "../api/filesys";
import FileList from "./fileList";
import { getfilename } from "../utils/getfilename";
import DicomDetail from "./dicomDetail";
import {Header,Icon} from "semantic-ui-react";

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
      <div>
      <Header as='h3' textAlign='center' inverted color='brown' icon>
        <Icon name='stethoscope' />
           Dicom Show
      </Header>
      <div className="ui container">
        <div className="ui grid">
          <div className="ui row">
            <div className="seven wide column">
              <FileList
                files={filenames}
                onFileSelect={this.onFileSelect}
                id="select-file"
              />
            </div>
            <div className="nine wide column">
              <DicomDetail file={this.state.selectedContent}/>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default App;
