import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import Logo from './logo.png';

class BrandLogo extends Component {
    state = {  }
    render() { 
        return ( 
                <Navbar.Brand href="#home">
                    <img src={ Logo } width="80px" alt="Aawaz Logo"/> 
                </Navbar.Brand>
         );
    }
}
 
export default BrandLogo;
     