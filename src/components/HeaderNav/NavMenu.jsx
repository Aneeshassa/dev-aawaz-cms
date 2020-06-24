import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import './Main.css';



export default class NavMenu extends Component {
    state = {  }
    render() { 
        return (
            <React.Fragment>
               <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">

                        {/* <Nav.Link >
                            <Link to="/users">Users</Link>
                        </Nav.Link> */}
                        <NavDropdown title="Add New" id="basic-nav-dropdown">
                            <NavDropdown.Item><Link to="/channel">Channel</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/shows">Shows</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/category">Category</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/banner">Banner</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/pages">Pages</Link></NavDropdown.Item>
                        </NavDropdown>                      
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-light">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </React.Fragment>
         );
    }
}