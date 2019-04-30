import React from "react";

const FileItem = ({ file, onFileSelect }) => {
  return (
    <div onClick={()=>onFileSelect(file)} className="item">
        <div className="content">
            <div className="header">{file}</div>
        </div>
    </div>
  );
};

export default FileItem;