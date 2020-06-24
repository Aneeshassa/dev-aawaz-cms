import React, { Component } from 'react'
import axios from 'axios';
import { Form, Col, Button } from 'react-bootstrap'

class AddCategory extends Component {
  constructor(props) {
    super(props) 
    this.state = {
        name: "",
        weight: "",
        icon_url: "",
        featured_image_url: null,
        sequence: null,
        state: "",
        short_url: ""
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
      .post('https://api.samortech.com/api/category/', this.state)
      .then(response => {
        console.log(response.data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { name, weight, icon_url, featured_image_url, proxy_list } = this.state
    return (
      <div>
        <h2>Add New Category</h2>
       
    
            <Form onSubmit={this.submitHandler}>
            <Form.Group>
              <Form.Row>
                <Col>
                <Form.Label>Category name: </Form.Label>
                  <Form.Control type="text" placeholder="Enter name here" name="name" value={name} onChange={this.changeHandler}/>
                </Col>
                <Col>
                <Form.Label>weight: </Form.Label>
                  <Form.Control type="text" placeholder="weight" name="weight" value={weight} onChange={this.changeHandler}/>
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
               <Form.File 
                  id="custom-file"
                  name="icon_url"
                  label="Icon Image Upload"
                  value={icon_url}
                  onChange={this.changeHandler} 
                  custom
                />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.File 
                  id="custom-file"
                  name="featured_image_url"
                  label="Featured Image Upload"
                  value={featured_image_url}
                  onChange={this.changeHandler} 
                  custom
                />    
            </Form.Group>     
            <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Control type="text" placeholder="proxy_list" name="proxy_list" value={proxy_list} onChange={this.changeHandler}/>
            </Form.Group>
            <Button type="submit" variant="info">Publish</Button>
            </Form>
                  
      </div>
    )
  }
}

export default AddCategory
