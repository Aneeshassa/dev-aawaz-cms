import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';


class SidebarNav extends Component {
    state = {  }
    render() { 
        return ( 
            <React.Fragment>   
                    <div className="sidebar-sticky">
                      <ul className="nav flex-column">
                        <li className="nav-item">
                          <Link to="/" exact="true" className="nav-link active">
                          Dashboard</Link>
                        </li>

                        <li className="nav-item">
                          <NavDropdown title="Badges" id="basic-nav-dropdown">
                            <Link to="/badges/all-badges" exact="true" className="nav-link"><i className="fas fa-home"></i>All Badges</Link>
                            <Link to="/badges/new-badges" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Badges</Link>
                          </NavDropdown>
                        </li>

                        <li className="nav-item">
                          <NavDropdown title="Platforms" id="basic-nav-dropdown">
                            <Link to="/platforms/all-platforms" exact="true" className="nav-link"><i className="fas fa-home"></i>All Platforms</Link>
                            <Link to="/platforms/new-platforms" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Platforms</Link>
                          </NavDropdown>
                        </li> 

                        <li className="nav-item">
                          <NavDropdown title="Channel" id="basic-nav-dropdown">
                            <Link to="/channel/all-channel" exact="true" className="nav-link"><i className="fas fa-home"></i>All Channel</Link>
                            <Link to="/channel/new-channel" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Channel</Link>
                          </NavDropdown>
                        </li>
                    
                        <li className="nav-item">
                          <NavDropdown title="Category" id="basic-nav-dropdown">
                            <Link to="/category/all-category" exact="true" className="nav-link"><i className="fas fa-home"></i>All Category</Link>
                            <Link to="/category/new-category" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Category</Link>
                          </NavDropdown>
                        </li>

                        <li className="nav-item">
                          <NavDropdown title="Shows" id="basic-nav-dropdown">
                            <Link to="/shows/sheet-upload" exact="true" className="nav-link"><i className="fas fa-home"></i>Sheet Upload</Link>
                            <Link to="/shows/all-show" exact="true" className="nav-link"><i className="fas fa-home"></i>All Shows</Link>
                            <Link to="/shows/new-show" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Show</Link>
                          </NavDropdown>
                        </li>

                        <li className="nav-item">
                          <NavDropdown title="Banners" id="basic-nav-dropdown">
                            <Link to="/banners/all-banner" exact="true" className="nav-link"><i className="fas fa-home"></i>All Banners</Link>
                            <Link to="/banners/new-banner" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Banner</Link>
                          </NavDropdown>
                        </li>

                        <li className="nav-item">
                          <NavDropdown title="Section" id="basic-nav-dropdown">
                            <Link to="/section/all-section" exact="true" className="nav-link"><i className="fas fa-home"></i>All Section</Link>
                            <Link to="/section/new-section" exact="true" className="nav-link"><i className="fas fa-home"></i>Add New Section</Link>
                          </NavDropdown>
                        </li>

                      </ul>
                    </div>
                  
          </React.Fragment> 
         );
    }
}
 
export default SidebarNav;