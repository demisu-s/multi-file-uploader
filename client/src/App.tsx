import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AddFile from './components/AddFile';
import EditFile from './components/EditFile';


function App() {
  return (
    
      
        <Routes>
          <Route path='/' element={<Home/>}/>
         <Route path='/add' element={<AddFile />}/>
         <Route path='/edit/:id' element={<EditFile uploaderId={0} initialDescription={''} />}/>
        </Routes>
     
    
  );
}

export default App;
