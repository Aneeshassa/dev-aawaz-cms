import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button, Figure } from 'react-bootstrap'
import {baseURL} from "../../../services/serviceCategories";
import moment from 'moment';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import auth from '../../../services/authentication';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddCategories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      weight: 1,
      featuredImageView: undefined,
      featured_image:undefined,

      iconImageView:undefined,
      iconImageUrl: undefined,

      sequence: 1,
      short_url:"",
      displayName: "",
      titleColor: "",
      backgroundColor: ""
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

  onIconImageChange = (event) => {
    this.setState({iconImageView: undefined, icon_image: undefined})
    if (event.target.files[0]) {
      let reader = new FileReader();
      this.setState({icon_image: event.target.files[0]})
      reader.onload = (e) => {
        this.setState({iconImageView: e.target.result});
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
        case 'displayName':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'titleColor':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'backgroundColor':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'iconImageView':
          break;
        case 'featuredImageView':
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
      url: `${baseURL}/category/`,
      method: "POST",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(response => {
        if(response.status === 201){
          toast.success(`New category ${response.data.name} created successfully.`)
          this.setState({isLoading: true})
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
            let err = "";
            for (let [, value] of Object.entries(error.response.data)) {
                err = `${err} ${value[0]}. `
            }
            toast.error(err)
            this.setState({ isLoading: false })
        }
        console.log(error)
    })
  }

  render() {
    const { name, weight, sequence, short_url, titleColor, displayName, backgroundColor } = this.state
    return (
      <div>
        <ToastContainer
                    autoClose={5000}
                    hideProgressBar={false}
                    position="top-center" />  
        <h2>Add New Category</h2>       
    
            <Form onSubmit={this.submitHandler}>
            <Form.Group>
              <Form.Row>
                <Col>
                <Form.Label>Category Name: </Form.Label>
                  <Form.Control type="text" placeholder="Enter Category Name here" name="name" value={name} onChange={this.changeHandler}/>
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
              
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Row>
                <Col>
                  <Form.Label>Weight: </Form.Label>
                  <Form.Control type="number"  min="1" placeholder="Weight" name="weight" value={weight} onChange={this.changeHandler}/>
                </Col>
                <Col>
                    <Form.Label>sequence: </Form.Label>
                    <Form.Control type="number"  min="1" placeholder="sequence" name="sequence" value={sequence} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>Display Name: </Form.Label>
                    <Form.Control type="displayName" placeholder="displayName" name="displayName" value={displayName} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>Title Color: </Form.Label>
                    <Form.Control type="titleColor" placeholder="titleColor" name="titleColor" value={titleColor} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>Background Color: </Form.Label>
                    <Form.Control type="backgroundColor" placeholder="backgroundColor" name="backgroundColor" value={backgroundColor} onChange={this.changeHandler}/>
                  </Col>
                </Form.Row>                
              </Form.Group>

              <Form.Group>
              <Form.Label>Short URL: </Form.Label>
                <Form.Control type="text" placeholder="Short URL" name="short_url" value={short_url} onChange={this.changeHandler}/>
              </Form.Group>
              <Form.Group>
              <Form.Label>Icon Image: </Form.Label><br></br>
                  { this.state.iconImageView?                
                <Figure>
                      <Figure.Image src={this.state.iconImageView} thumbnail width={171} height={180} />
                </Figure>: <p>No image selected</p>}
                  <Form.Control type="file" name="icon_image" onChange={this.onIconImageChange}/>
              </Form.Group>
            {!this.state.isLoading? <Button type="submit" variant="info">Publish</Button>: <Loader type="ThreeDots" color="#eb1163" height={100} width={50}/>}
            </Form>
      </div>
    )
  }
}

export default AddCategories
