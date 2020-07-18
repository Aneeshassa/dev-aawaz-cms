import React, { Component } from 'react';
import { Card, ListGroup, Row, Col, Container } from 'react-bootstrap';
import './Content.css';
// import WorldAnalytics from './Dashboard/WorldAnalytics';
import { Doughnut } from 'react-chartjs-2';

import { getShowsDropDowns } from '../../services/serviceShows'
import { getCategoryDropDowns } from '../../services/serviceCategories'
import { getChannelDropdown } from '../../services/serviceChannels'
import { getBannerDropDown } from '../../services/serviceBanner'

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Dashboard extends Component {
    state = {
        isLoading: false,
        shows: [],
        categories: [],
        channels: [],
        banners: []
    }
    hideLoader = () => {
        this.setState({ isLoading: false });
    }

    showLoader = () => {
        this.setState({ isLoading: true });
    }

    fetchShowData = async () => {
        this.showLoader();
        await getShowsDropDowns().then(response => {
            this.setState({ shows: response.data, isLoading: false })
        })
            .catch(error => {
                toast.error("Show fetch failed!")
                console.log(error)
                this.hideLoader();
            });
    }

    fetchCategoryData = async () => {
        this.showLoader();
        await getCategoryDropDowns().then(response => {
            this.setState({ categories: response.data, isLoading: false })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Error occured while category fetching data")
                console.log(error)
                this.hideLoader();
            });
    }

    fetchChannelData = async () => {
        this.showLoader();
        await getChannelDropdown().then(response => {
            this.setState({ channels: response.data, isLoading: false })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Error occured while fetching data")
                console.log(error)
                this.hideLoader();
            });
    }

    fetchBannerData = async () => {
        this.showLoader();
        await getBannerDropDown().then(response => {
            this.setState({ banners: response.data, isLoading: false })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Error occured while fetching data")
                console.log(error)
                this.hideLoader();
            });
    }

    componentDidMount = () => {
        this.fetchShowData()
        this.fetchChannelData()
        this.fetchCategoryData()
        this.fetchBannerData()
    }
    render() {
        const style= {"list-style-type": "disc"}
        const { shows, categories, channels, banners } = this.state
        const data = {
            labels: [
                `Shows`,
                `Channels`,
                `Categories`,
                `Banners`
            ],
            datasets: [{
                data: [shows.length, channels.length, categories.length, banners.length],
                backgroundColor: [
                    '#36A2EB',
                    '#de0700',
                    '#FFCE56',
                    "#05fc2e"
                ],
                hoverBackgroundColor: [
                    '#36A2EB',
                    '#de0700',
                    '#FFCE56',
                    "#05fc2e"
                ]
            }]
        };
        return (
            <div>
                {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
                    <div>
                        <ToastContainer position="top-center" />
                        <Card>
                            <Card.Header>Welcome to Aawaz.com Dashboard</Card.Header>
                            <Card.Body>
                                <Card.Title>Aawaz Welcome's You Onboard</Card.Title>
                                <Card.Text>
                                    Real-time data count for content is fetched.
                            Click <a href="https://aawaz-front-end-nqt7qkzhva-uw.a.run.app/" target='_blank' rel="noopener noreferrer">
                                here</a> to view data on Aawaz 2.0 web app.
                        </Card.Text>
                            </Card.Body>
                        </Card>

                        <div className="mt-n1">
                            <Row>
                                <Col className="analytic-grid">
                                    <Card>
                                        <Card.Header>Analytics for Aawaz.com content</Card.Header>
                                        <Card.Body>
                                            <Doughnut data={data} />
                                            <Container>
                                                <ul>
                                                    <li style={style}>{shows.length} Shows</li>
                                                    <li style={style}>{channels.length} Channels</li>
                                                    <li style={style}>{categories.length} Categories</li>
                                                    <li style={style}>{banners.length} Banners</li>
                                                </ul>
                                            </Container>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                {/* <Col className="analytic-grid">
                                    <Card>
                                        <Card.Header>No. of Episodes</Card.Header>
                                        <Card.Body>
                                            Show
                                </Card.Body>
                                    </Card>
                                </Col> */}
                            </Row>
                        </div>

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
                    </div>
                }
            </div>
        );
    }
}

export default Dashboard;