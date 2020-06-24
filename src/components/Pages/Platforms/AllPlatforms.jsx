import React, { Component } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllPlatform, removePlatform, updatePlatform, baseURL } from '../../../services/servicesPlatform';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import auth from '../../../services/authentication';

class AllPlatform extends Component {


  constructor(props) {
    super(props)

    this.state = {
      platform: [],
      isLoading: false,
      isEdit: false,
      imageUpdating:false,
      editedPlatform: undefined
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  async componentDidMount() {
    //Load all the platform
    this.showLoader();
    await getAllPlatform().then(response => {
      console.log(response.data.results)
      this.setState({ platform: response.data.results })
      this.hideLoader();
    })
      .catch(error => {
        console.log(error)
      });
  }

  async onImageUpload(uniqueSlug, event){
    this.setState({imageUpdating: true})
    console.log("current edited image platform id:, ",uniqueSlug)
    let formData = new FormData();
    switch(event.target.name){
      case 'featured_image':
        console.log("featured image switch case ")
        formData.append('featured_image', event.target.files[0])
        break;
      default:
        console.log("banner image switch case ")
        formData.append('banner_image', event.target.files[0]) 
    }
    
    // formData.append('name', 'featured_image')
    await axios({
      url: `${baseURL}/platforms/${uniqueSlug}/`,
      method: "PATCH",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    } )
    .then(res => {
      if(res.status === 200){
        console.log("file upload completed")
        console.log("f Data: ", res.data.featuredImageUrl)
        console.log("b Data: ", res.data.bannerImageUrl)
        this.forceUpdate()
        if(res.data.featuredImageUrl !== this.state.editedPlatform.featuredImageUrl){
          this.setState({editedPlatform:{...this.state.editedPlatform, featuredImageUrl: res.data.featuredImageUrl}})
          console.log("featuredImageUrl updated")
          console.log("edited image platform id after update:, ",this.state.editedPlatform.uniqueSlug)
        }
        if(res.data.bannerImageUrl !== this.state.editedPlatform.bannerImageUrl){
          this.setState({editedPlatform:{...this.state.editedPlatform,bannerImageUrl: res.data.bannerImageUrl}})
          console.log("bannerImageUrl updated")
        }
        this.setState({imageUpdating: false})
      }
    })
    .catch(err => console.log(err))
  }

  async onDelete(uniqueSlug, name) {

    await removePlatform(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Platform ${name} deleted successfully.`);
          this.componentDidMount();
        }
      })
      .catch(err => {
        console.log(err)
        alert(`Platform ${name} delete failed, try again later.`);
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
      editedPlatform: show,
      isEdit: !this.isEdit
    })
  }

  changeHandler = (event) => {
    let show = this.state.editedPlatform
    let editShow = {
      ...show,
      [event.target.name]: event.target.value
    }
    this.setState({ editedPlatform: editShow })
  }

  updateHandler = (e) => {
    e.preventDefault()
    this.handleClose()
    console.log("data: ", this.state.editedPlatform)
    console.log("id after update: ", this.state.editedPlatform.uniqueSlug)
    updatePlatform(this.state.editedPlatform.uniqueSlug, this.state.editedPlatform)
      .then(response => {
        if(response.status === 200){
          alert("Platform updated successfully")
          this.forceUpdate()
          return this.componentDidMount()
        }
          alert("Platform updated unsuccessful, please try again later!")       
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.forceUpdate()
        this.componentDidMount()
      })
  }
  render() {

    const { platform } = this.state
    

    return (

      <div>
        <ToastContainer />
        {(this.state.isEdit) ?
          <Modal size="xl" show={this.state.isEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Platform</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.updateHandler}>
                <Form.Group>
                    <Form.Label>Platform Name: </Form.Label>
                    <Form.Control type="text" placeholder="Enter Platform Name here" name="title" value={this.state.editedPlatform.title} onChange={this.changeHandler} />
                </Form.Group>
                 { 
                    this.state.imageUpdating ? <p>Updating image please wait... </p> :
                <Button type="submit" variant="info">Update</Button>}
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
          : null
        }
        <h2>List of Platform</h2>
        {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Platform Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                platform.length ?
                  platform.map((platform, index) =>
                    <tr key={index}>
                      <td key={index}>{index + 1}</td>
                      <td>{platform.name}</td>
                      <td>
                        <Button variant="primary" onClick={() => this.toggleEdit(platform)}>Edit</Button>
                        <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete platform ${platform.name}?`)) this.onDelete(platform.uniqueSlug, platform.name) }}>Delete</Button>
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

export default AllPlatform
