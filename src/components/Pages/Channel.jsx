import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button } from 'react-bootstrap'

class AddChannel extends Component {
  constructor(props) {
    super(props)
    
     
    
    this.state = {
      title: "",
      featured_image_url: "",
      published_on: "",
      width: null,
      sequence: null,
      short_description: "",
      description: "",
      color: "",
      deep_url: "",
      banner_image_url: ""
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
    console.log(this.state)
    axios
      .post('https://api.samortech.com/api/channels/', this.state)
      .then(response => {
        console.log(response.data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { title, featured_image_url, published_on, weight, sequence, short_description, description, color, deep_url, banner_image_url } = this.state
    return (
      <div>
        <h2>Add New Channel</h2>
       
    
            <Form onSubmit={this.submitHandler}>
            <Form.Group>
              <Form.Row>
                <Col>
                <Form.Label>Title: </Form.Label>
                  <Form.Control type="text" placeholder="Enter Title here" name="title" value={title} onChange={this.changeHandler}/>
                </Col>
                <Col>
                <Form.Label>featured_image_url: </Form.Label>
                    <Form.File 
                      id="custom-file"
                      name="featured_image_url"
                      label="Featured Image Upload"
                      value={featured_image_url}
                      onChange={this.changeHandler} 
                      custom
                    />  
                </Col>
              </Form.Row>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>published_on: </Form.Label>
                <Form.Control type="text" placeholder="Enter show description here" name="published_on" value={published_on} onChange={this.changeHandler}/>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>weight: </Form.Label>
                <Form.Control type="text" placeholder="weight" name="weight" value={weight} onChange={this.changeHandler}/>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Label>sequence: </Form.Label>
                    <Form.Control type="text" placeholder="sequence" name="sequence" value={sequence} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>sequence: </Form.Label>
                    <Form.Control type="text" placeholder="short_description" name="short_description" value={short_description} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>description: </Form.Label>
                    <Form.Control type="text" placeholder="description" name="description" value={description} onChange={this.changeHandler}/>
                  </Col>
                </Form.Row>
              </Form.Group>
              </Form.Group>
              
                     
                  <Form.Group controlId="exampleForm.ControlSelect1">

                  <Form.Control type="text" placeholder="color" name="color" value={color} onChange={this.changeHandler}/>
                  </Form.Group>
                  <Form.Group>
                  <Form.Control type="text" placeholder="deep_url" name="deep_url" value={deep_url} onChange={this.changeHandler}/>
                  </Form.Group>  
                  <Form.Group>  
                    <Form.File 
                      id="custom-file"
                      name="banner_image_url"
                      label="Banner Image Upload"
                      value={banner_image_url}
                      onChange={this.changeHandler} 
                      custom
                    />                  
                  </Form.Group>
            <Button type="submit" variant="info">Publish</Button>
            </Form>
            
     

      
      </div>
    )
  }
}

export default AddChannel
