import React from "react";
import FileItem from "./fileItem";
import {Dropdown} from "semantic-ui-react";

const FileList = ({ files, onFileSelect }) => {
  // const renderedList = files.map(file => {
  //   return <FileItem file={file} onFileSelect={onFileSelect} key={file} />;
  // });
  const renderedList=files.map(file=>{
    return {key: file, text: file, value: file, onClick:()=>onFileSelect(file)}
  })
  return (
   <Dropdown
    placeholder='Select Dicom'
    fluid
    floating
    search
    selection
    options={renderedList}
   />
  );
};

export default FileList;
