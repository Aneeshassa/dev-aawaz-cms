import React, { Component } from 'react';
import { Card,  Button, ListGroup, Row, Col } from 'react-bootstrap';
import './Content.css';
import IndAnalytics from './Dashboard/IndAnalytics';
import WorldAnalytics from './Dashboard/WorldAnalytics';


class Dashboard extends Component {
    state = {  }
    render() { 
        return ( 
            <React.Fragment>
                <Card>
                    <Card.Header>Welcome to Aawaz.com Dashboard</Card.Header>
                    <Card.Body>
                        <Card.Title>Dashboard Welcome's You Onboard</Card.Title>
                        <Card.Text>
                        This page welcomes you with a short documentation on this backend read it carefully to handle your queries by reading it with carefully. Click the button below to open the documentation. This documentation is made simple and clear to understand by anyone with an ease. 
                        </Card.Text>
                        <Button variant="primary">Read Documentation</Button>
                    </Card.Body>
                </Card>
                {/* Chart JS */}
                <div className="mt-n1">
                    <Row>
                        <Col className="analytic-grid">
                            <Card>
                                <Card.Header>Analytics for India</Card.Header>
                                <Card.Body>
                                    <IndAnalytics />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="analytic-grid">
                            <Card>
                                <Card.Header>Analytics for Worldwide</Card.Header>
                                <Card.Body>
                                <WorldAnalytics/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* List */}

                <div className="mt-n1">
                    <Row >
                            <Col>
                                <Card>
                                    <Card.Header>Latest Shows</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col>
                                <Card >
                                    <Card.Header>Trending Shows</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Header>Most Viewed</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Header>Featured Shows</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                </div>
                
                    
            </React.Fragment>
        );
    }
}
 
export default Dashboard;