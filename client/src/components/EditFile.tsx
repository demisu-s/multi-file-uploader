import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUploader } from '../store/features/uploaderSlice';
import { useNavigate } from "react-router-dom";

interface EditFileProps {
  uploaderId: number;
  initialDescription: string;
}




const EditFile: React.FC<EditFileProps> = ({ uploaderId, initialDescription }) => {
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const [description, setDescription] = useState<string>(initialDescription);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(updateUploader({ id: uploaderId, description, file: null }));
  };

  const handleEditFileClick = () => {
    console.log("Add file button clicked");
    navigate('/');
  };

  return (
    <div className='form-container'>
      <article className="articles-header">
        <header>
          <h1>Multi-File Uploader</h1>
        </header>
      </article>

      <div>
        <h3>Edit File Form</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <div>
        <input
          type="submit"
          value="edit"
          onClick={handleEditFileClick} 
        />
        </div>
      </form>
      
    </div>
  );
};

export default EditFile;
