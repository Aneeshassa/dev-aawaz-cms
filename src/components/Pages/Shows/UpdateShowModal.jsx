import React, { Component } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import {update} from '../../../services/serviceShows';

// const { useState } = React;
class UpdateShowModal extends Component{
  constructor(props){
    super();
    this.state = {
      showData: props.data || null,
      showModal: false
    }
  }

  handleClose = () => {
 
    this.setState({showModal: false})};
  handleShow = () => {
    
    this.setState({showModal: true});
  }
  changeHandler = (event) => {
    this.setState({ showData: {
      [event.target.name]: event.target.value
    }
  }
  )}

  updateHandler =(e) => {
    e.preventDefault()
    this.handleClose()
    update(this.state.editedShow.unique_slug, this.state.editedShow)
      .then(response => {
        console.log(response.data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render(){
    return ( 
      <>
      <Button variant="success" onClick={this.handleShow}>
        Edit
      </Button>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
    <Modal.Title>Edit Show</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={this.updateHandler}>
                      <Form.Group>
                        <Form.Row>
                          <Col>
                            <Form.Label>Title: </Form.Label>
                            <Form.Control type="text" placeholder="Enter Title here" name="title" value={this.state.showData.title} onChange={this.changeHandler} />
                          </Col>
                          <Col>
                            <Form.Label>Artist: </Form.Label>
                            <Form.Control type="text" placeholder="Artist" name="artist" value={this.state.showData.artist} onChange={this.changeHandler} />
                          </Col>
                        </Form.Row>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Description: </Form.Label>
                          <Form.Control type="text" placeholder="Enter show description here" name="description" value={this.state.showData.description} onChange={this.changeHandler} />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Short Description: </Form.Label>
                          <Form.Control type="textarea" placeholder="Short Description here" name="short_description" value={this.state.showData.short_description} onChange={this.changeHandler} />
                        </Form.Group>

                        <Form.Group>
                          <Form.Row>
                            <Col>
                              <Form.Label>Weight: </Form.Label>
                              <Form.Control type="text" placeholder="Weight" name="weight" value={this.state.showData.weight} onChange={this.changeHandler} />
                            </Col>
                            <Col>
                              <Form.Label>Short: </Form.Label>
                              <Form.Control type="text" placeholder="Short Url" name="short_url" value={this.state.showData.short_url} onChange={this.changeHandler} />
                            </Col>
                            <Col>
                              <Form.Label>Season: </Form.Label>
                              <Form.Control type="text" placeholder="Season" name="season" value={this.state.showData.season} onChange={this.changeHandler} />
                            </Col>
                          </Form.Row>
                        </Form.Group>
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control type="text" placeholder="banner_image_url" name="banner_image_url" value={this.state.showData.banner_image_url} onChange={this.changeHandler} />
                        <Form.Control type="text" placeholder="featured_image_url" name="featured_image_url" value={this.state.showData.featured_image_url} onChange={this.changeHandler} />
                        <Form.Control type="text" placeholder="channel" name="channel" value={this.state.showData.channel} onChange={this.changeHandler} />
                        <Form.Control type="text" placeholder="sequence" name="sequence" value={this.state.showData.sequence} onChange={this.changeHandler} />
                        <Form.Control type="text" placeholder="language" name="language" value={this.state.showData.language} onChange={this.changeHandler} />
                      </Form.Group> 
                      <Button type="submit" variant="info">Update</Button>
                    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={this.submitHandler}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
     )
  }
  }
 
export default UpdateShowModal;