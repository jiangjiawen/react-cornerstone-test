import React from "react";
import FileItem from "./fileItem";

const FileList = ({ files, onFileSelect }) => {
  const renderedList = files.map(file => {
    return (
      <FileItem file={file} onFileSelect={onFileSelect} key={file}/>
    );
  });
  return <div className="ui relaxed divided list">{renderedList}</div>;
};

export default FileList;