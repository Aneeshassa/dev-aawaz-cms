import React, { Component } from 'react'
import axios from 'axios';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form, Col, Button, Figure } from 'react-bootstrap'
import { getAllChannel, baseURL } from '../../../services/serviceChannels';
import { getAllCategory } from '../../../services/serviceCategories';
import { getAllArtist } from '../../../services/serviceArtists';
import { getAllBadge } from '../../../services/serviceBadges';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import auth from '../../../services/authentication';

class AddShow extends Component {
  constructor(props) {
    super(props)



    this.state = {
      title: '',
      weight: 1,
      bannerShowImageView: undefined,
      featuredShowImageView: undefined,
      featured_image: '',
      banner_image: '',
      short_description: '',
      description: '',
      dateTime: new Date(),
      published_on: `${moment(new Date()).format()}`,
      channel_slug: '',
      category_slug: '',
      badge_slug: '',
      sequence: 1,
      deepLink: '',
      language: '',
      short_url: '',
      season: '',
      artist_slug: '',
      artists: [],
      channels: [],
      categories: [],
      badges: [],
      isLoading:false
    }
  }

  componentDidMount = () => {
    getAllChannel()
      .then(response => {
        this.setState({ channels: response.data.results })
      })
      .catch(error => {
        console.log(error)
      });

    getAllCategory()
      .then(response => {
        this.setState({ categories: response.data.results })
      })
      .catch(error => {
        console.log(error)
      });

    getAllArtist()
      .then(response => {
        this.setState({ artists: response.data.results })
      })
      .catch(error => {
        console.log(error)
      });
    getAllBadge()
      .then(response => {
        this.setState({ badges: response.data.results })
      })
      .catch(error => {
        console.log(error)
      });
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onFeaturedShowImageChange = (event) => {
    this.setState({ featuredShowImageView: undefined, featured_image: '' })
    if (event.target.files[0]) {
      let reader = new FileReader();
      this.setState({ featured_image: event.target.files[0] })
      reader.onload = (e) => {
        this.setState({ featuredShowImageView: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onBannerShowImageChange = (event) => {
    this.setState({ bannerShowImageView: undefined, banner_image: '' })
    if (event.target.files[0]) {
      let reader = new FileReader();
      this.setState({ banner_image: event.target.files[0] })
      reader.onload = (e) => {
        this.setState({ bannerShowImageView: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  handleDateChange = date => {
    this.setState({
      published_on: moment(date).format(),
      dateTime: date
    });
  };

  submitHandler = (e) => {
    e.preventDefault()
    console.log(this.state)
    this.setState({isLoading: true})
    let formData = new FormData();
    for (let [key, value] of Object.entries(this.state)) {
      // if(value === "" || value === undefined || value === null){
      //   this.setState({isLoading: false})
      //   return toast.error(`All filed are required!`);
      // }
      switch(key){
        case 'weight':
        case 'sequence':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'bannerShowImageView':
        case 'featuredShowImageView':
        case 'channels':
        case 'artists':
        case 'deepLink':
        case 'badges':
        case 'categories':
        case 'dateTime':
        case 'isLoading':
          break;
        default:          
          formData.append(`${key}`, value)
      }
    }
    for (var [key,value] of formData.entries()) {
      if(value === '' || value === undefined || value === {} ){
        this.setState({isLoading: false})
        return toast.error(`${key} is required!`)
      }
      console.log(key+ ': ' + value); 
    }
    axios({
      url: `${baseURL}/shows/`,
      method: "POST",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(response => {
        if(response.status === 201) {
          toast.success(`Show ${response.data.title} created successfully`);
          this.setState({isLoading: false})
           window.location.reload(false);
        }
        if(response.status === 400){
          toast.error('Something went wrong, please try again')
          this.setState({isLoading: false})
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
    const channels = this.state.channels
    const categories = this.state.categories

    const { title, weight, short_description, description, short_url, artists, sequence, badges } = this.state
    return (
      <div>
        <ToastContainer position="top-right"/>
        <h2>Add New Show</h2>
        <Form onSubmit={this.submitHandler}>
          <Form.Group>
            <Form.Row>
              <Col>
                <Form.Label>Title: </Form.Label>
                <Form.Control type="text" placeholder="Enter Title here" name="title" value={title} onChange={this.changeHandler} />
              </Col>
              <Col>
                <Form.Label>Artist: </Form.Label>
                <Form.Control as="select" name="artist_slug" onChange={this.changeHandler}>
                  <option defaultValue value="">Select Artist</option>
                  {
                    artists.map((data, index) =>
                      <option key={index} value={data.uniqueSlug}>{data.name}</option>
                    )
                  }
                </Form.Control>
              </Col>
            </Form.Row>

            <Form.Group controlId="exampleForm.ControlTextarea">
              <Form.Label>Description: </Form.Label>
              <Form.Control as="textarea" placeholder="Enter show description here" name="description" value={description} onChange={this.changeHandler} rows="5" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Short Description: </Form.Label>
              <Form.Control as="textarea" placeholder="Short Description here" name="short_description" value={short_description} onChange={this.changeHandler} rows="2" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Row>
                <Col>
                  <Form.Label>Featured Image Upload: </Form.Label><br></br>
                  {this.state.featuredShowImageView ?
                    <Figure>
                      <Figure.Image src={this.state.featuredShowImageView} thumbnail width={171} height={180} />
                    </Figure> : <p>No image selected</p>}
                  <Form.File
                    name="featured_show_image"
                    label="Featured Image Upload"
                    accept="image/*"
                    onChange={this.onFeaturedShowImageChange}
                    custom
                  />
                </Col>
                <Col>
                  <Form.Label>Banner Image Upload: </Form.Label><br></br>
                  {this.state.bannerShowImageView ?
                    <Figure>
                      <Figure.Image src={this.state.bannerShowImageView} thumbnail width={171} height={180} />
                    </Figure> : <p>No image selected</p>}
                  <Form.File
                    name="banner_image_url"
                    label="Banner Image Upload"
                    accept="image/*"
                    onChange={this.onBannerShowImageChange}
                    custom
                  />
                </Col>
              </Form.Row>

            </Form.Group>

            <Form.Group>
              <Form.Label>Published On: </Form.Label>
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
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>Weight: </Form.Label>
                  <Form.Control type="number" min="1" placeholder="Weight" name="weight" value={weight} onChange={this.changeHandler} />
                </Col>
                <Col>
                  <Form.Label>Short: </Form.Label>
                  <Form.Control type="text" placeholder="Short Url" name="short_url" value={short_url} onChange={this.changeHandler} />
                </Col>
                <Col>
                  <Form.Label>Season:</Form.Label><br></br>
                  <Form.Control as="select" name="season" onChange={this.changeHandler}>
                    <option defaultValue value="">Select a season</option>
                    <option value="Season 1">Season 1</option>
                    <option value="Season 2">Season 2</option>
                    <option value="Season 3">Season 3</option>
                    <option value="Season 4">Season 4</option>
                    <option value="Season 5">Season 5</option>
                    <option value="Season 6">Season 6</option>
                    <option value="Season 7">Season 7</option>
                    <option value="Season 8">Season 8</option>
                    <option value="Season 9">Season 9</option>
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form.Group>


          <Form.Group>
            <Form.Row>
              <Col>
                <Form.Label>Channel: </Form.Label> <br></br>
                <Form.Control as="select" name="channel_slug" onChange={this.changeHandler}>
                  <option defaultValue value="">Select a Channel</option>
                  {
                    channels.map((channel, index) =>
                      <option key={index} value={channel.uniqueSlug}>{channel.title}</option>
                    )
                  }
                </Form.Control>
              </Col>
              <Col>
                <Form.Label>Category: </Form.Label> <br></br>
                <Form.Control as="select" name="category_slug" onChange={this.changeHandler}>
                  <option defaultValue value="">Select a Category</option>
                  {
                    categories.map((category, index) =>
                      <option key={index} value={category.uniqueSlug}>{category.name}</option>
                    )
                  }
                </Form.Control>
              </Col>
              <Col>
                <Form.Label>Deep Link URL: </Form.Label>
                <Form.Control type="url" placeholder="Deep link URL" name="deep_link" value={this.state.deep_link} onChange={this.changeHandler} />
              </Col>
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Row>
              <Col>
                <Form.Label>Sequence: </Form.Label>
                <Form.Control type="number" min="1" placeholder="sequence" name="sequence" value={sequence} onChange={this.changeHandler} />
              </Col>
              <Col>
                <Form.Label>Language: </Form.Label>
                <Form.Control as="select" name="language" onChange={this.changeHandler}>
                <option defaultValue value="">Select a Language</option>
                  <option value="En">English</option>
                  <option value="Hi">Hindi</option>
                </Form.Control>
              </Col>
              <Col>
                <Form.Label>Badge: </Form.Label>
                <Form.Control as="select" name="badge_slug" onChange={this.changeHandler}>
                  <option defaultValue value="">Select Badge</option>
                  {
                    badges.map((data, index) => 
                      <option key={index} value={data.uniqueSlug}>{data.name}</option>
                    )}
                </Form.Control>
              </Col>
            </Form.Row>

          </Form.Group>

          <Form.Group>
            <Form.Row>
            {!this.state.isLoading? <Button type="submit" variant="info" block>Publish</Button>: <Loader type="ThreeDots" color="#eb1163" height={100} width={50}/>}
            </Form.Row>
          </Form.Group>
          
        </Form>

      </div>



    )
  }
}

export default AddShow





