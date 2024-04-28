import React from "react";
import { useAppSelector } from "../store/store";
import { Uploader } from "../store/features/uploaderSlice";
import "./FileList.style.css";
import { saveAs } from "file-saver";

const FileList = () => {
  const { uploaders, getFileStatus } = useAppSelector((state) => state.uploader);

  const handleDownload = (file: File | null, fileName: string) => {
    if (file) {
      saveAs(file, fileName); // Use FileSaver.js to trigger the download
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Download</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {uploaders.map((uploader) => (
            <tr key={uploader.id}>
              <td>{uploader.id}</td>
              <td>{uploader.description}</td>
              <td>
                {uploader.file ? (
                  <button onClick={() => handleDownload(uploader.file, uploader.description)}>
                    Download
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
              <td>Action</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
