// https://bezkoder.com/react-hooks-file-upload/
import React from "react";
//import React, { useState } from "react";
// import { UploadService } from "../services/FileUploadService";

/**
 * div con due bottoni: selezione file su FS e upload verso IPFS. Manca la crypt AES
 * @component
 */
export function FileUpload(props) {
  //const [selectedFiles, setSelectedFiles] = useState(undefined);
  //const [currentFile, setCurrentFile] = useState(undefined);
  //const [message, setMessage] = useState("");

  /*
  useEffect(() => {
  }, []);
  */

  const selectFile = (event) => {
    //setSelectedFiles(event.target.files);
    props.setUploadInfo(event.target.files);
  };

  return (
    <div>
      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>

      <div className="alert alert-light" role="alert">
        {/* message */}
      </div>
    </div>
  );
}
