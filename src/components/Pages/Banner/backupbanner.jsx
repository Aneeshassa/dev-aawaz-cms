import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button } from 'react-bootstrap'

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
    console.log(this.state)
    axios
      .post('https://api.samortech.com/api/banners/', this.state)
      .then(response => {
        console.log(response.data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { name, background_image_url, content, start_datetime, end_datetime, sequence, height, width, badge, action, platform } = this.state
    return (
      <div>
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
                    <Form.Control type="text" placeholder="sequence" name="sequence" value={sequence} onChange={this.changeHandler}/>
                  </Col>
                  <Col>
                    <Form.Label>height: </Form.Label>
                    <Form.Control type="text" placeholder="height" name="height" value={height} onChange={this.changeHandler}/>
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
