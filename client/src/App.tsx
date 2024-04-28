import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AddFile from './components/AddFile';


function App() {
  return (
    
      
        <Routes>
          <Route path='/' element={<Home/>}/>
         <Route path='add' element={<AddFile />}/>
        </Routes>
     
    
  );
}

export default App;
