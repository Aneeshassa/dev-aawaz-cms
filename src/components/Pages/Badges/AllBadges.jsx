import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col,Image } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllBadge, removeBadge, updateBadge, baseURL } from '../../../services/serviceBadges';
import auth from '../../../services/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

class AllBadge extends Component {


  constructor(props) {
    super(props)

    this.state = {
      badge: [],
      isLoading: false,
      isEdit: false,
      imageUpdating: false,
      editedBadge: undefined
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  async componentDidMount() {
    //Load all the badge
    this.showLoader();
    await getAllBadge().then(response => {
      console.log(response.data.results)
      this.setState({ badge: response.data.results })
      this.hideLoader();
    })
      .catch(error => {
        console.log(error)
      });
  }

  async onImageUpload(uniqueSlug, event) {
    
    // console.log("current edited image badge id:, ", uniqueSlug)
    let formData = new FormData();
    formData.append('icon', event.target.files[0])
    await axios({
      url: `${baseURL}/badges/${uniqueSlug}/`,
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(res => {
        // console.log("Response from API: ", res)
        if (res.status === 200) {
          this.setState({ editedBadge: { ...this.state.editedBadge, iconUrl: res.data.iconUrl, imageUpdating: false } })
        }
      })
      .catch((err) => toast.error(JSON.stringify(err.response.data)))
  }

  async onDelete(uniqueSlug, name) {

    await removeBadge(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Badge ${name} deleted successfully.`);
          this.componentDidMount();
        }
      })
      .catch(err => {
        console.log(err)
        toast.error(`Badge ${name} delete failed, try again later.`);
      });
  }

  handleClose = () => {
    this.setState({ isEdit: false })
  };
  handleShow = () => {
    this.setState({ isEdit: true });
  }

  toggleEdit = show => {
    this.setState({
      editedBadge: show,
      isEdit: !this.isEdit
    }, () => console.log("Edited badge: ", this.state.editedBadge))
  }

  changeHandler = (event) => {
    let show = this.state.editedBadge
    let editShow = {
      ...show,
      [event.target.name]: event.target.value
    }
    this.setState({ editedBadge: editShow })
  }

  updateHandler = (e) => {
    e.preventDefault()
    this.handleClose()
    let data = {
      name: this.state.editedBadge.name,
      color: this.state.editedBadge.color
    }
    updateBadge(this.state.editedBadge.uniqueSlug, data)
      .then(response => {
        if (response.status === 200) {
          alert("Badge updated successfully")
          return this.componentDidMount()
        }        
      })
      .catch(() => {
        toast.error("Update failed, try again later")        
      })
  }
  render() {

    const { badge } = this.state
    let imgHash = Date.now()

    return (

      <div>
        <ToastContainer position="top-center"/>
        {(this.state.isEdit) ?
          <Modal size="xl" show={this.state.isEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Badge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.updateHandler}>
                <Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Label>Badge Name: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Badge Name here" name="name" value={this.state.editedBadge.name} onChange={this.changeHandler} />
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Form.Label>Current Icon Image: </Form.Label>
                  </Form.Row>
                  <Form.Row>
                    {this.state.editedBadge.iconUrl ?
                      <Image src={`${this.state.editedBadge.iconUrl}?${imgHash}`} thumbnail width={171} height={180} />
                      : null}
                      <br></br>
                    {
                      this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                    }
                  </Form.Row>
                  <Form.Row>
                    <Form.Label>Change Icon Image: </Form.Label>
                    <Form.Control type="file" name="iconUrl" onChange={(event) => this.onImageUpload(this.state.editedBadge.uniqueSlug, event)} />
                  </Form.Row>
                  <Form.Row>
                    <Form.Label>Color: </Form.Label>
                    <Form.Control type="text" placeholder="Color" name="color" value={this.state.editedBadge.color} onChange={this.changeHandler} />
                  </Form.Row><br></br>
                  <Form.Row>
                    <Button type="submit" variant="outline-primary">
                      Update
                    </Button>
                  </Form.Row>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
          </Button>
            </Modal.Footer>
          </Modal>
          : null
        }
        <h2>List of Badge</h2>
        {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Icon Image</th>
                <th scope="col">Badge Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                badge.length ?
                  badge.map((badge, index) =>
                    <tr key={index}>
                      <td key={index}>{index + 1}</td>
                      <td>{badge.iconUrl ? <Image src={`${badge.iconUrl}?${imgHash}`} thumbnail width="80px" /> : <p>No image</p>}</td>
                      <td>{badge.name}</td>
                      <td>
                        <Button variant="primary" onClick={() => this.toggleEdit(badge)}>Edit</Button>
                        <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete badge ${badge.name}?`)) this.onDelete(badge.uniqueSlug, badge.name) }}>Delete</Button>
                      </td>
                    </tr>
                  ) :

                  null
              }
            </tbody>
          </Table>
        }


      </div>
    )
  }
}

export default AllBadge
