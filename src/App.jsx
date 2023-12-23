import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './comp/navbar/Navbar';
import Sidebar from './comp/sidebar/Sidebar';
import Course from './comp/corse/Corse';
import Blog from './comp/posts/Blog';


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Sidebar />}
        >
          <Route index element={<h2>Welcome to the homepage!</h2>} />
          <Route path='corse' element={<Course />} />
          <Route path='blog' element={<Blog />} />
        </Route>
        <Route path='*' element={<h2>User not found</h2>} />
      </Routes>
    </>
  );
}
