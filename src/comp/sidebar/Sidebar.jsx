import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Sidebar.css'; 

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logingIn,setLogingIn]=useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logIn = ()=>{
    setLogingIn(true);
  }
  useEffect (
    ()=>{

      
    }
    ,[logingIn]
  )

  return (
    <>
      <div className={`container-fluid ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="row flex-nowrap">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              {/* Button to toggle sidebar */}
             

              {/* Rest of your sidebar content */}
              <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Menu</span>
              </a>
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li className="nav-item">
              <Link to={'/'} className="nav-link align-middle px-0">
                <i className="fs-4 bi-house" /> <span className="ms-1 d-none d-sm-inline">Home</span>
              </Link>
            </li>
            <li>
              <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-speedometer2" /> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </a>
              <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                <li className="w-100">
                  <Link to={'/blog'} className="nav-link px-0"> <span className="d-none d-sm-inline">Blog</span>Posts</Link>
                </li>
                <li>
                  <Link to={'/corse'} className="nav-link px-0"> <span className="d-none d-sm-inline">Blog</span>Corses</Link>
                </li>
              </ul>
            </li>    
          </ul>
            </div>
          </div>
          <div className="col py-3 hh">
          <button className="btn text-white tt" onClick={toggleSidebar}>
                Toggle Sidebar
              </button>
              {
                logingIn? <Outlet /> : (
                    <>
                <p>you should log in</p>
                <button onClick={logIn}>log in</button>
                </>
                )

                

              }
           
          </div>
        </div>
      </div>
    </>
  );
}
