import React, { Component } from 'react';

import { Navbar }from 'react-bootstrap'
import './Main.css';
import BrandLogo from './BrandLogo';
import NavMenu from './NavMenu';

class Header extends Component {
    render() { 
      const myStyle = {
        backgroundColor: "#eb1163"
      }
        return (
            <Navbar style={myStyle} className="navbar-dark" expand="lg" >
              
              <BrandLogo />
              <NavMenu />

              
            </Navbar>
          );
    }
}
 
export default Header;
