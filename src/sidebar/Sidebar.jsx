import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="wrapper">
      <div className={`sidebar ${sidebarVisible ? "expand" : ""}`}>
        <ul className="sidebar-nav" style={{ color: "black" }}>
          <li className="sidebar-item">
            <NavLink
              to="/"
              className="sidebar-link"
              activeClassName="active"
              style={{ color: "black" }}
            >
              <span>Home</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/Scenario/add"
              className="sidebar-link"
              activeClassName="active"
              style={{ color: "black" }}
            >
              <span>AddScenario</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/Vehicle/add"
              className="sidebar-link"
              activeClassName="active"
              style={{ color: "black" }}
            >
              <span>Add-vehicle</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/scenarios"
              className="sidebar-link"
              activeClassName="active"
              style={{ color: "black" }}
            >
              <span>Allscenarios</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
