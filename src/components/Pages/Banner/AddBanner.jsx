import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button } from 'react-bootstrap'
import { baseURL } from "../../../services/serviceBanner";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import auth from '../../../services/authentication';

class AddBanner extends Component {
  constructor(props) {
    super(props)
    
     
    
    this.state = {
      name: "",
      background_image_url: "",
      content: "",
      start_datetime: "",
      end_datetime: "",
      sequence: null,
      height: null,
      width: null,
      badge: null,
      action: null,
      platform: null
    }
  }

 

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
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
        url: `${baseURL}/banner/`,
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData,
        auth: auth,
    })
        .then(response => {
            if (response.status === 201) {
                toast.success(`New badge  ${response.data.name} is created successfully.`)
                this.setState({ isLoading: true })
                window.location.reload(false);
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
    const { name, background_image_url, content, start_datetime, end_datetime, sequence, height, width, badge, action, platform } = this.state
    return (
      <div>
        <ToastContainer
                    autoClose={5000}
                    hideProgressBar={false}
                    position="top-center" />
        <h2>Add New Banner</h2>
       
    
            <Form onSubmit={this.submitHandler}>
            <Form.Group>
              <Form.Row>
                <Col>
                <Form.Label>Title: </Form.Label>
                  <Form.Control type="text" placeholder="Enter Title here" name="name" value={name} onChange={this.changeHandler}/>
                </Col>
                <Col>
                <Form.Label>background_image_url: </Form.Label>
                  <Form.Control type="text" placeholder="background_image_url" name="background_image_url" value={background_image_url} onChange={this.changeHandler}/>
                </Col>
              </Form.Row>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>content: </Form.Label>
                <Form.Control type="text" placeholder="Enter show description here" name="content" value={content} onChange={this.changeHandler}/>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>start_datetime: </Form.Label>
                <Form.Control type="text" placeholder="start_datetime" name="start_datetime" value={start_datetime} onChange={this.changeHandler}/>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Label>end_datetime: </Form.Label>
                    <Form.Control type="text" placeholder="end_datetime" name="end_datetime" value={end_datetime} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>sequence: </Form.Label>
                    <Form.Control type="text"  min="1" placeholder="sequence" name="sequence" value={sequence} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>height: </Form.Label>
                    <Form.Control type="text"  min="1" placeholder="height" name="height" value={height} onChange={this.changeHandler}/>
                  </Col>
                </Form.Row>
              </Form.Group>
              </Form.Group>
              
                     
                  <Form.Group controlId="exampleForm.ControlSelect1">

                  <Form.Control type="text" placeholder="width" name="width" value={width} onChange={this.changeHandler}/>

                  <Form.Control type="text" placeholder="badge" name="badge" value={badge} onChange={this.changeHandler}/>

                  <Form.Control type="text" placeholder="action" name="action" value={action} onChange={this.changeHandler}/>

                  <Form.Control type="text" placeholder="platform" name="platform" value={platform} onChange={this.changeHandler}/>

                
                  </Form.Group>
            <Button type="submit" variant="info">Publish</Button>
            </Form>
            
     

      
      </div>
    )
  }
}

export default AddBanner
