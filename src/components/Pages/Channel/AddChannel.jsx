import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button, Figure } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {baseURL} from "../../../services/serviceChannels";
import moment from 'moment';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import auth from '../../../services/authentication';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddChannel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      bannerImageView:undefined,
      featuredImageView:undefined,
      featured_image: undefined,
      dateTime: new Date(),
      published_on:`${moment(new Date()).format()}`,
      weight: 1,
      sequence: 1,
      short_description: "",
      description: "",
      color: "",
      deep_url: "",
      short_url:"",
      banner_image: undefined,
      isLoading: false
    }
  }

  handleDateChange = date => {
    this.setState({
      published_on: moment(date).format(),
      dateTime: date
    });
  };

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onFeaturedImageChange = (event) => {
    this.setState({featuredImageView: undefined, featured_image: undefined})
    if (event.target.files[0]) {
      let reader = new FileReader();
      this.setState({featured_image: event.target.files[0]})
      reader.onload = (e) => {
        this.setState({featuredImageView: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onBannerImageChange = (event) => {
    this.setState({bannerImageView: undefined, banner_image: undefined})
    if (event.target.files[0]) {
      let reader = new FileReader();
      this.setState({banner_image: event.target.files[0]})
      reader.onload = (e) => {
        this.setState({bannerImageView: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  
  
  submitHandler = (e) => {
    e.preventDefault()
    // console.log(this.state)
    this.setState({isLoading: true})
    let formData = new FormData();
    for (let [key, value] of Object.entries(this.state)) {
      switch(key){
        case 'weight':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'sequence':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'bannerImageView':
          break;
        case 'featuredImageView':
          break;
        case 'dateTime':
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
      // console.log(key + ': ' + value);
  }

    axios({
      url: `${baseURL}/channels/`,
      method: "POST",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(response => {
        if(response.status === 201){
          toast.success(`New Channel ${response.data.title} created successfully.`)
          this.setState({isLoading: false}, () => setTimeout(() => window.location.reload(), 5000))          
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
    const { title, weight, sequence, short_description, description, color, deep_url, short_url } = this.state
    return (
      <div>
          <ToastContainer
            autoClose={5000}
            hideProgressBar={false}
            position="top-center" />
        <h2>Add New Channel</h2>
    
            <Form onSubmit={this.submitHandler}>
            <Form.Group>
              <Form.Row>
                <Col>
                <Form.Label>Channel Name: </Form.Label>
                  <Form.Control type="text" placeholder="Enter Channel Name here" name="title" value={title} onChange={this.changeHandler}/>
                </Col>
                <Col>
                <Form.Label>Featured Image: </Form.Label><br></br>
                { this.state.featuredImageView?                
                <Figure>
                      <Figure.Image src={this.state.featuredImageView} thumbnail width={171} height={180} />
                </Figure>: <p>No image selected</p>}
                <Form.Control type="file" name="featured_image" onChange={this.onFeaturedImageChange}/>
                </Col>
              </Form.Row>

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
                          {}
                        </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Row>
                <Col>
                  <Form.Label>Weight: </Form.Label>
                  <Form.Control type="number" placeholder="Weight" min="1" name="weight" value={weight} onChange={this.changeHandler}/>
                </Col>
                <Col>
                    <Form.Label>sequence: </Form.Label>
                    <Form.Control type="number" placeholder="sequence" min="1" name="sequence" value={sequence} onChange={this.changeHandler}/>
                  </Col>
                </Form.Row>                
              </Form.Group>

              <Form.Group>
              <Form.Label>Description: </Form.Label>
                <Form.Control type="text" placeholder="Description" name="description" value={description} onChange={this.changeHandler}/>                                                                        
              </Form.Group>
              </Form.Group>

              <Form.Group>
              <Form.Label>Short Description: </Form.Label>
                    <Form.Control type="text" placeholder="Short Description" name="short_description" value={short_description} onChange={this.changeHandler}/> 
              </Form.Group>

              <Form.Group>
              <Form.Label>Color: </Form.Label>
                <Form.Control type="text" placeholder="color" name="color" value={color} onChange={this.changeHandler}/>
              </Form.Group>
              <Form.Group>
              <Form.Label>Deep URL: </Form.Label>
                <Form.Control type="url" placeholder="Deep URL" name="deep_url" value={deep_url} onChange={this.changeHandler}/>
              </Form.Group>
              <Form.Group>
              <Form.Label>Short URL: </Form.Label>
                <Form.Control type="text" placeholder="Short URL" name="short_url" value={short_url} onChange={this.changeHandler}/>
              </Form.Group>
              <Form.Group>
              <Form.Label>Banner Image: </Form.Label><br></br>
                  { this.state.bannerImageView?                
                <Figure>
                      <Figure.Image src={this.state.bannerImageView} thumbnail width={171} height={180} />
                </Figure>: <p>No image selected</p>}
                  <Form.Control type="file" name="banner_image" onChange={this.onBannerImageChange}/>
              </Form.Group>
            {!this.state.isLoading? <Button type="submit" variant="info">Publish</Button>: <Loader type="ThreeDots" color="#eb1163" height={100} width={50}/>}
            </Form>
      </div>
    )
  }
}

export default AddChannel
