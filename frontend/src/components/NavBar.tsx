import  { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function NavBar() {
  const authContext = useContext(AuthContext);
  const authenticated = authContext?.authenticated ?? false;
  const logout = authContext?.logout ?? (() => {});
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <a className="navbar-brand" href="/">
          React MyBlog RNEM
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* <li className="nav-item"> 
                        <Link to="/" className='nav-link active'>Home</Link> 
                    </li> */}
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Home
              </NavLink>
             
            </li>
            <li className="nav-item">
              {/* <Link to="/posts" className='nav-link'>Posts</Link> */}
              <NavLink
                to="/posts"
               className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                Posts
              </NavLink>
            </li>
            <li className="nav-item">
              {/* <Link to="/contact" className='nav-link'>Contact Us</Link> */}
              <NavLink
                to="/contact"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                Contact Us
              </NavLink>
            </li>
            {!authenticated && (
              <li className="nav-item">
                <NavLink
                  to="/mylogin"
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                  Login
                </NavLink>
              </li>
            )}
            {!authenticated && (
              <li className="nav-item">
                <NavLink
                  to="/myregister"
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                  Register
                </NavLink>
              </li>
            )}

            {authenticated && (
              <li className="nav-item dropdown">
                <button className="dropbtn">Admin</button>
                <div className="dropdown-content">
                  <NavLink
                    to="/add-post"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  >
                    Add post
                  </NavLink>
                  <NavLink
                    to="/view-posts"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  >
                    View Posts
                  </NavLink>
                  <NavLink
                    to="/view-users"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  >
                    View Users
                  </NavLink>
                </div>
              </li>
            )}
            {authenticated && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  onClick={logout}
                  to="/"
                >
                  Logout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}