import React, { Component } from 'react';
import { Button, Form, Col, Figure, Card, Accordion, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getShow, baseURL } from '../../../services/serviceShows';
import { removeEpisode } from '../../../services/serviceEpisodes';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import auth from '../../../services/authentication';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class EditShowEpisode extends Component {
    state = {
        show_slug: "",
        isLoading: false,
        editedShow: {},
        title: "",
        bannerImageView: undefined,
        featuredImageView: undefined,
        featured_image: undefined,
        audio_file: undefined,
        dateTime: new Date(),
        published_on: `${moment(new Date()).format()}`,
        episode_no: 0,
        weight: 0,
        sequence: 0,
        short_description: "",
        description: "",
        short_url: "",
        banner_image: undefined,
        isEdit: false
    }

    UNSAFE_componentWillMount = () => { //Triggeres first
        console.log("will mount triggered")
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let unique = params.get('unique');
        this.setState({ isLoading: true, show_slug: unique })
    }

    componentDidMount = () => {
        this.setState(() => {
            return { isLoading: true }
        })
        getShow(this.state.show_slug)
            .then(res => {
                if (res.status === 200) {
                    this.setState({ editedShow: res.data, isLoading: false })
                }
            })
            .catch(res => {
                console.log(res);
                this.setState({ isLoading: false })
            })
    }

    handleDateChange = date => {
        this.setState({
            published_on: moment(date).format(),
            dateTime: date
        });
    };

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onFeaturedImageChange = (event) => {
        this.setState({ featuredImageView: undefined, featured_image: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            this.setState({ featured_image: event.target.files[0] })
            reader.onload = (e) => {
                this.setState({ featuredImageView: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onBannerImageChange = (event) => {
        this.setState({ bannerImageView: undefined, banner_image: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            this.setState({ banner_image: event.target.files[0] })
            reader.onload = (e) => {
                this.setState({ bannerImageView: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onAudioFileChange = (event) => {
        this.setState({ audio_file: event.target.files[0] })
    }

    submitHandler = (e) => {
        e.preventDefault()
        // console.log(this.state)
        this.setState({ isLoading: true })
        let formData = new FormData();
        for (let [key, value] of Object.entries(this.state)) {
            switch (key) {
                case 'weight':
                case 'sequence':
                case 'episode_no':
                    formData.append(`${key}`, parseInt(value))
                    break;
                case 'bannerImageView':
                case 'featuredImageView':
                case 'dateTime':
                case 'editedShow':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }
        for (var [key, value] of formData.entries()) {
            if (value === '' || value === undefined || value === {}) {
                this.setState({ isLoading: false })
                return toast.error(`${key} is required!`)
            }
            console.log(key + ': ' + value);
        }
        axios({
            url: `${baseURL}/episodes/`,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData,
            auth: auth
        })
            .then(response => {
                if (response.status === 201) {
                    toast.success(`New Episode ${response.data.title} created successfully.`)
                    this.setState({ isLoading: true })
                    window.location.reload(false);
                }
                if (response.status === 400) {
                    toast.error('Something went wrong, please try again')
                    this.setState({ isLoading: false })
                }
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.status === 400) {                    
                    toast.error(JSON.stringify(error.response.data))
                    this.setState({ isLoading: false })
                }
                console.log(error)
            })
    }

    deleteEpisode = (id) => {
        removeEpisode(id)
            .then(() => {
                alert("Delete successful");
            })
            .catch(() => {
                alert("Delete failed!")
            })
    }

    updateEpisode = data => {
        this.setState(() => {
            return {
                isEdit: true,
                title: data.title,
                
                episode_no: data.episodeNo,
                weight: data.weight,
                sequence: data.sequence,
                short_description: data.shortDescription,
                description: data.description,
                short_url: data.shortUrl,
                currentData:{
                    featured_image: data.featuredImageUrl,
                    banner_image: data.bannerImageUrl,
                    audio_file: data.audioFileUrl,
                    episode_slug: data.uniqueSlug
                }
            }
        });
    }

    handleModalClose = () => {
        this.setState({ isEdit: false })
    };

    updateHandler = (e) => {
        e.preventDefault()
        // console.log(this.state)
        this.setState({ isLoading: true })
        let formData = new FormData();
        if(this.state.featured_image) formData.append("featured_image", this.state.featured_image)
        if(this.state.banner_image) formData.append("banner_image", this.state.banner_image)
        if(this.state.audio_file) formData.append("audio_file", this.state.audio_file)
        for (let [key, value] of Object.entries(this.state)) {
            switch (key) {
                case 'weight':
                case 'sequence':
                case 'episode_no':
                    formData.append(`${key}`, parseInt(value))
                    break;
                case 'bannerImageView':
                case 'featuredImageView':
                case 'featured_image':
                case 'banner_image':
                case 'audio_file':                    
                case 'currentData':
                case 'editedShow':
                case 'isLoading':
                case 'isEdit':
                case 'show_slug':
                case 'dateTime':
                case 'published_on':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }
        for (var [key, value] of formData.entries()) {
            if (value === '' || value === undefined || value === {}) {
                this.setState({ isLoading: false })
                return toast.error(`${key} is required!`)
            }
            console.log(key + ': ' + value);
        }

        axios({
            url: `${baseURL}/episodes/${this.state.currentData.episode_slug}/`,
            method: "PATCH",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData

        })
            .then(response => {
                if (response.status === 200) {
                    toast.success(`Episode "${response.data.title}" updated successfully.`)
                    this.setState({ isLoading: true })
                    window.location.reload(false);
                }
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.status === 400) {                    
                    toast.error(JSON.stringify(error.response.data))
                    this.setState({ isLoading: false })
                }
                console.log(error)
            })
    }

    render() {
        const { title, weight, sequence, short_description, description, short_url, episode_no, editedShow } = this.state
        return (
            <div>
                {this.state.isEdit ?
                    
                    <Modal size="xl" show={this.state.isEdit} onHide={this.handleModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Episode</Modal.Title>
                        </Modal.Header>
                       
                        <Modal.Body>
                            <Form onSubmit={this.updateHandler}>
                                <Form.Group>
                                    <Form.Label>Title<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control type="text" placeholder="Episode Title" name="title" value={title} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Description<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control as="textarea" rows="4" placeholder="Episode Description" name="description" value={description} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Short Description<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control as="textarea" rows="2" placeholder="Episode Short Description" name="short_description" value={short_description} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Short URL<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control type="text" placeholder="Episode Short URL" name="short_url" value={short_url} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Form.Label>Current Audio File<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            {this.state.currentData.audio_file ? <audio controls src={this.state.currentData.audio_file} /> : <p>Audio file not present</p>}
                                        </Col>

                                        <Col>
                                            <Form.Label>New Audio File<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            <Form.File name="audio_file" onChange={this.onAudioFileChange} />
                                        </Col>
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Form.Label>Current Featured Image<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            {this.state.currentData.featured_image ?
                                                <Figure>
                                                    <Figure.Image src={this.state.currentData.featured_image} thumbnail width={171} height={180} />
                                                </Figure> : <p>No image selected</p>}
                                        </Col>
                                        <Col>
                                            <Form.Label>New Featured Image<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            {this.state.featuredImageView ?
                                                <Figure>
                                                    <Figure.Image src={this.state.featuredImageView} thumbnail width={171} height={180} />
                                                </Figure> : <p>No image selected</p>}
                                            <Form.File type="file" name="featured_image" onChange={this.onFeaturedImageChange} />
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <Form.Label>Current Banner Image<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            {this.state.currentData.banner_image ?
                                                <Figure>
                                                    <Figure.Image src={this.state.currentData.banner_image} thumbnail width={171} height={180} />
                                                </Figure> : <p>No image selected</p>}
                                        </Col>
                                        <Col>
                                            <Form.Label>New Banner Image<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                            {this.state.bannerImageView ?
                                                <Figure>
                                                    <Figure.Image src={this.state.bannerImageView} thumbnail width={171} height={180} />
                                                </Figure> : <p>No image selected</p>}
                                            <Form.File type="file" name="featured_image" onChange={this.onBannerImageChange} />
                                        </Col>
                                    </Form.Row>

                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Episode Number<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control type="number" min="0" placeholder="Episode No" name="episode_no" value={episode_no} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Weight<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control type="number" min="0" placeholder="Weight" name="weight" value={weight} onChange={this.changeHandler} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Sequence<span style={{color:"red"}}>*</span> </Form.Label>
                                    <Form.Control type="number" min="0" placeholder="Sequence" name="sequence" value={sequence} onChange={this.changeHandler} />
                                </Form.Group>
                                <Button type="submit" variant="info">Update</Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleModalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    : null}
                {!this.state.isLoading ? <div>
                    <ToastContainer
            autoClose={5000}
            hideProgressBar={false}
            position="top-center" />
                    <Form onSubmit={this.submitHandler}>
                  
                        <Form.Group>
                            <Form.Row>
                                <Button variant="warning" onClick={this.componentDidMount}>Refresh Episodes</Button>
                            </Form.Row><br></br>

                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Add Episode
                                                </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>

                                            <Form.Group>
                                                <Form.Label>Title<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control type="text" placeholder="Episode Title" name="title" value={title} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Description<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control as="textarea" rows="4" placeholder="Episode Description" name="description" value={description} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Short Description<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control as="textarea" rows="2" placeholder="Episode Short Description" name="short_description" value={short_description} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Short URL<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control type="text" placeholder="Episode Short URL" name="short_url" value={short_url} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Row>
                                                    <Col>
                                                        <Form.Label>Published On<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                                        <DatePicker
                                                            name="published_on"
                                                            selected={this.state.dateTime}
                                                            onChange={this.handleDateChange}
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            timeCaption="time"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                        />
                                                    </Col>

                                                    <Col>
                                                        <Form.Label>Audio File Upload<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                                        <Form.File name="audio_file" onChange={this.onAudioFileChange} />
                                                    </Col>
                                                </Form.Row>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Row>
                                                    <Col>
                                                        <Form.Label>Featured Image Upload<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                                        {this.state.featuredImageView ?
                                                            <Figure>
                                                                <Figure.Image src={this.state.featuredImageView} thumbnail width={171} height={180} />
                                                            </Figure> : <p>No image selected</p>}
                                                        <Form.File type="file" name="featured_image" onChange={this.onFeaturedImageChange} />
                                                    </Col>
                                                    <Col>
                                                        <Form.Label>Banner Image Upload<span style={{color:"red"}}>*</span> </Form.Label><br></br>
                                                        {this.state.bannerImageView ?
                                                            <Figure>
                                                                <Figure.Image src={this.state.bannerImageView} thumbnail width={171} height={180} />
                                                            </Figure> : <p>No image selected</p>}
                                                        <Form.File type="file" name="banner_image" onChange={this.onBannerImageChange} />
                                                    </Col>
                                                </Form.Row>

                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Episode Number<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control type="number" min="0" placeholder="Episode No" name="episode_no" value={episode_no} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Weight<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control type="number" min="0" placeholder="Weight" name="weight" value={weight} onChange={this.changeHandler} />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Sequence<span style={{color:"red"}}>*</span> </Form.Label>
                                                <Form.Control type="number" min="0" placeholder="Sequence" name="sequence" value={sequence} onChange={this.changeHandler} />
                                            </Form.Group>
                                            <Button type="submit" variant="info">Publish</Button>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                            </Accordion>

                        </Form.Group>
                    </Form>
                    <h3>Episodes in show "{editedShow.title}":</h3>

                    {
                        editedShow.episodes.length === 0 ?
                            <Alert variant="danger">No episodes found. Please Add Episode to the show.</Alert>
                            :
                            editedShow.episodes.map((data, index) =>
                                <Card key={index}>
                                    <Card.Header>Episode {index + 1}: {data.title}</Card.Header>
                                    <Card.Body>
                                        <p>Description: {data.description}</p>
                                        <p>Episode No: {data.episodeNo}</p>
                                        {data.audioFileUrl ? <audio controls src={data.audioFileUrl} /> : <p>Audio file not present</p>}
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete episode "${data.title}"?`)) this.deleteEpisode(data.uniqueSlug) }}>Delete Episode</Button>{' '}
                                        <Button variant="info" onClick={() => { this.updateEpisode(data) }}>Edit Episode</Button>{' '}
                                    </Card.Footer>
                                </Card>
                            )

                    }



                </div> : <Loader type="ThreeDots" color="#eb1163" height={100} width={50} />}
            </div>
        );
    }
}

export default EditShowEpisode;