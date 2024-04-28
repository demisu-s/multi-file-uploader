import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { fetchUploader } from "../store/features/uploaderSlice";
import FileList from "./FileList";
import "./Home.style.css"

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUploader());
  }, []);

  const handleAddFileClick = () => {
    console.log("Add file button clicked");
    navigate('/add');
  };

  return (
    <div>
      <article className="articles-header">
        <header>
          <h1>Multi-File Uploader</h1>
        </header>
      </article>
      <section className="section-content">
        <input
          type="button"
          value="Add file"
          onClick={handleAddFileClick} 
        />
        <FileList />
       
      </section>
    </div>
  );
};

export default Home;
