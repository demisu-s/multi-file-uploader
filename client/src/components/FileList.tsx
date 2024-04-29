import React from "react";
import { useAppSelector, useAppDispatch } from "../store/store";
import { Uploader, deleteUploader } from "../store/features/uploaderSlice";
import "./FileList.style.css";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const FileList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { uploaders, getFileStatus } = useAppSelector((state) => state.uploader);

  const handleDownload = (file: string) => {
      saveAs(file); // Use FileSaver.js to trigger the download
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUploader(id));
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleView = (description: string) => {
    // Show popup or modal with description and file content
    alert(`Description: ${description}\nFile:`);
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
                {
                uploader.link  ? (
                  <button onClick={() => handleDownload(uploader.link!)}>Download</button>
                ) : (
                  "N/A"
                )
                }
              </td>
              <td>
                <button onClick={() => handleView(uploader.description)}>View</button>
                <button onClick={() => handleEdit(uploader.id)}>Edit</button>
                <button onClick={() => handleDelete(uploader.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
