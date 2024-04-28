import React, { useRef, useState } from "react";
import { useAppDispatch } from "../store/store";
import { saveUploader } from "../store/features/uploaderSlice";
import "./AddForm.style.css"

const AddFile = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form...");

    const formData = {
      description,
      file: file as File
    };

    console.log("Form data:", formData);

    dispatch(saveUploader(formData))
      .then(() => {
        console.log("Save successful");
        setDescription(""); // Reset description state
        setFile(null); // Reset file state
      })
      .catch((error) => {
        console.error("Save failed:", error);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="form-container">
 <article className="articles-header">
        <header>
          <h1>Multi-File Uploader</h1>
        </header>
      </article>

      <div>
        <h3>Add File Form</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default AddFile;
