import React, { Component } from "react";
import Hammer from "hammerjs";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
// import * as cornerstoneBase64ImageLoader from "cornerstone-base64-image-loader";

import PNGReader from "png.js";

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
// cornerstoneBase64ImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
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
  componentDidUpdate() {
    const file = this.props.file;
    if (!file) {
      return <div>Loading...</div>;
    }
    const fileSrc = `http://10.16.120.46:8080/server/${file}`;

    const url = "wadouri:" + fileSrc;

    const maskname = file.slice(0, -4);

    // console.log(cornerstone.loadAndCacheImage(url));
    // cornerstoneTools.init();

    this.dicomWebViewer(url, maskname);
  }

  dicomWebViewer = (imgId, maskname) => {
    //Loads image
    cornerstoneTools.init();

    var element = document.getElementById("dicom-img");
    const brushTool = cornerstoneTools.BrushTool;
    const WwwcTool = cornerstoneTools.WwwcTool;
    cornerstone.enable(element);
    cornerstone
      .loadAndCacheImage(imgId)
      .then(function(image) {
        var viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
        cornerstoneTools.addToolForElement(element, WwwcTool);
        cornerstoneTools.setToolActiveForElement(
          element,
          "Wwwc",
          {
            mouseButtonMask: 1
          },
          ["Mouse"]
        );
        cornerstoneTools.addTool(brushTool);
        cornerstoneTools.setToolActive("Brush", { mouseButtonMask: 2 });
      })
      .then(() => {

        const pngfile = `http://10.16.120.46:8080/masks/${maskname}.png`;

        const width = 512;
        const height = 512;
        const channel = 1;
        let pixelData = new Uint8ClampedArray(width * height * channel);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", pngfile, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function(e) {
          if (this.status === 200) {
            var reader = new PNGReader(this.response);
            reader.parse(function(err, png) {
              if (err) console.log(err);
              for(let i=0;i<width * height * channel;i++){
                pixelData[i]=png.pixels[i]/255;
              }
              let toolState = cornerstoneTools.getToolState(
                element,
                brushTool.getReferencedToolDataName()
              );
              if (toolState) {
                toolState.data[0].pixelData=[...pixelData];
              } else {
                cornerstoneTools.addToolState(
                  element,
                  brushTool.getReferencedToolDataName(),
                  { pixelData }
                );
                toolState = cornerstoneTools.getToolState(
                  element,
                  brushTool.getReferencedToolDataName()
                );
              }
              toolState.data[0].invalidated = true;
              cornerstone.updateImage(element);
            });
          }
        };

        xhr.send();

      //   for (let i = 128; i < 256; i++) {
      //     for (let j = 256; j < 384; j++) {
      //       pixelData[i * width + j] = 1;
      //     }
      //   }
      //   let toolState = cornerstoneTools.getToolState(
      //     element,
      //     brushTool.getReferencedToolDataName()
      //   );
      //   if (toolState) {
      //     toolState.data[0].pixelData = [...pixelData];
      //   } else {
      //     cornerstoneTools.addToolState(
      //       element,
      //       brushTool.getReferencedToolDataName(),
      //       { pixelData }
      //     );
      //     toolState = cornerstoneTools.getToolState(
      //       element,
      //       brushTool.getReferencedToolDataName()
      //     );
      //   }
      //   toolState.data[0].invalidated = true;
      //   cornerstone.updateImage(element);
      // });
      })
  };

  render() {
    return (
      <div>
        <div className="ui segment" style={{ width: "512px" }}>
          <h1 className="ui blue center aligned header" id="filename">
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
