import React, { Component } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true
});

try {
  //Configures loaders for web to avoud error: unexpected token <-
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: 8,
    startWebWorkersOnDemand: true,
    webWorkerPath: "cornerstoneWADOImageLoaderWebWorker.min.js",
    webWorkerTaskPaths: [],
    taskConfiguration: {
      decodeTask: {
        loadCodecsOnStartup: true,
        initializeCodecsOnStartup: false,
        codecsPath: "cornerstoneWADOImageLoaderCodecs.min.js",
        usePDFJS: false,
        strict: true
      }
    }
  });
} catch (error) {
  throw new Error(error);
}

class DicomDetail extends Component {

  componentDidUpdate(){
    const file = this.props.file;
    if(!file){
        return <div>Loading...</div>
    }
    const fileSrc = `http://localhost:8080/server/${file}`;

    const url = "wadouri:" + fileSrc;

    console.log(cornerstone.loadAndCacheImage(url));

    this.dicomWebViewer(url);
  }

  dicomWebViewer = imgId => {
    //Loads image
    var element = document.getElementById("dicom-img");
    console.log(element);
    cornerstone.enable(element);
    cornerstone.loadAndCacheImage(imgId).then(function(image) {
      console.log(image);
      var viewport = cornerstone.getDefaultViewportForImage(element, image);
      cornerstone.displayImage(element, image, viewport);
    });
  };

  render() {
    return (
      <div>
         <div className="ui segment" style={{ width: "512px"}}>
          <h1 className="ui header" id="filename">
            {this.props.file}
          </h1>
        </div>
        <div
          className="ui embed"
          id="dicom-img"
          style={{ width: "512px", height: "512px", position: "absolute" }}
        />
      </div>
    );
  }
}

export default DicomDetail;