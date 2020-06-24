import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Figure } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllBanner, removeBanner, updateBanner, removeAllBanner, baseURL } from '../../../services/serviceBanner';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

class AllBanner extends Component {


  constructor(props) {
    super(props)

    this.state = {
      banner: [],
      isLoading: false,
      isEdit: false,
      imageUpdating:false,
      editedBanner: undefined
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  async componentDidMount() {
    //Load all the Banner
    this.showLoader();
    await getAllBanner().then(response => {
      console.log(response.data.results)
      this.setState({ banner: response.data.results })
      this.hideLoader();
    })
      .catch(error => {
        console.log(error)
      });
  }

  async onImageUpload(uniqueSlug, event){
    this.setState({imageUpdating: true})
    console.log("current edited image banner id:, ",uniqueSlug)
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
      url: `${baseURL}/banner/${uniqueSlug}/`,
      method: "PATCH",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData
    } )
    .then(res => {
      if(res.status === 200){
        console.log("file upload completed")
        console.log("f Data: ", res.data.featuredImageUrl)
        console.log("b Data: ", res.data.bannerImageUrl)
        this.forceUpdate()
        if(res.data.featuredImageUrl !== this.state.editedBanner.featuredImageUrl){
          this.setState({editedBanner:{...this.state.editedBanner, featuredImageUrl: res.data.featuredImageUrl}})
          console.log("featuredImageUrl updated")
          console.log("edited image banner id after update:, ",this.state.editedBanner.uniqueSlug)
        }
        if(res.data.bannerImageUrl !== this.state.editedBanner.bannerImageUrl){
          this.setState({editedBanner:{...this.state.editedBanner,bannerImageUrl: res.data.bannerImageUrl}})
          console.log("bannerImageUrl updated")
        }
        this.setState({imageUpdating: false})
      }
    })
    .catch(err => console.log(err))
  }

  async onDelete(uniqueSlug, name) {

    await removeBanner(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Banner ${name} deleted successfully.`);
          this.componentDidMount();
        }
      })
      .catch(err => console.log(err));
  }

  async deleteAll(uniqueSlug, name) {

    await removeAllBanner(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Banner ${name} deleted successfully.`);
          this.componentDidMount();
        }
      })
      .catch(err => console.log(err));
  }


  // removeAllTutorials() {
  //   TutorialDataService.deleteAll()
  //     .then(response => {
  //       console.log(response.data);
  //       this.refreshList();
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  handleClose = () => {
    this.setState({ isEdit: false })
  };
  handleShow = () => {
    this.setState({ isEdit: true });
  }

  toggleEdit = show => {
    this.setState({
      editedBanner: show,
      isEdit: !this.isEdit
    })
  }

  changeHandler = (event) => {
    let show = this.state.editedBanner
    let editShow = {
      ...show,
      [event.target.name]: event.target.value
    }
    this.setState({ editedBanner: editShow })
  }

  updateHandler = (e) => {
    e.preventDefault()
    this.handleClose()
    console.log("data: ", this.state.editedBanner)
    console.log("id after update: ", this.state.editedBanner.uniqueSlug)
    updateBanner(this.state.editedBanner.uniqueSlug, this.state.editedBanner)
      .then(response => {
        if(response.status === 200){
          alert("Banner updated successfully")
          this.forceUpdate()
          return this.componentDidMount()
        }
          alert("Banner updated unsuccessful, please try again later!")       
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.forceUpdate()
        this.componentDidMount()
      })
  }
  render() {

    const { banner } = this.state

    return (

      <div>
        <ToastContainer />
        {(this.state.isEdit) ?
          <Modal size="xl" show={this.state.isEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Banner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.updateHandler}>
                <Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Label>Banner Name: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Banner Name here" name="name" value={this.state.editedBanner.name} onChange={this.changeHandler} />
                    </Col>
                  </Form.Row>

                  <Form.Group>
                    <Form.Label>Current Featured Image: </Form.Label><br></br>
                    {this.state.editedBanner.featuredImageUrl? 
                    <Figure>
                      <Figure.Image src={this.state.editedBanner.featuredImageUrl} width={171} height={180} />
                    </Figure> : <p>No Image uploaded</p>}
                    {
                      this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                    }
                    <br></br>
                    <Form.Label>Change Featured Image: </Form.Label>
                    <Form.Control type="file" placeholder="Featured Image" name="featured_image" onChange={(event)=> this.onImageUpload(this.state.editedBanner.uniqueSlug, event)} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Weight: </Form.Label>
                    <Form.Control type="number" placeholder="Weight" name="weight" value={this.state.editedBanner.weight} onChange={this.changeHandler} />
                  </Form.Group>


                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Sequence: </Form.Label>
                    <Form.Control type="number" placeholder="Sequence" name="sequence" value={this.state.editedBanner.sequence} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short Description: </Form.Label>
                    <Form.Control type="text" placeholder="Short Description" name="shortDescription" value={this.state.editedBanner.shortDescription} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description: </Form.Label>
                    <Form.Control type="text" placeholder="Description" name="description" value={this.state.editedBanner.description} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Color: </Form.Label>
                    <Form.Control type="text" placeholder="Color" name="color" value={this.state.editedBanner.color} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short URL: </Form.Label>
                    <Form.Control type="text" placeholder="Short URL" name="shortUrl" value={this.state.editedBanner.shortUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Deep url: </Form.Label>
                    <Form.Control type="url" placeholder="Deep url" name="deepUrl" value={this.state.editedBanner.deepUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Current Banner Image: </Form.Label><br></br>
                  {this.state.editedBanner.bannerImageUrl? 
                    <Figure>
                      <Figure.Image src={this.state.editedBanner.bannerImageUrl} width={171} height={180} />
                    </Figure> : <p>No Image uploaded</p>}
                    {
                      this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                    }
                    <br></br>
                    <Form.Label>Change Banner Image: </Form.Label>                    
                      <Form.Control type="file" name="banner_image" onChange={(event)=> this.onImageUpload(this.state.editedBanner.uniqueSlug, event)} />
                  </Form.Group>

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
        <h2>List of Banner</h2>
        {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
      
           
          <Table responsive hover>
             {/* <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete all banner ${banner.name}?`)) this.deleteAll(banner.uniqueSlug, banner.name) }}>Delete All</Button> */}
        
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Banner Image</th>
                <th scope="col">Banner Name</th>
                <th scope="col">Platform</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                banner.length ?
                  banner.map((banner, index) =>
                    <tr key={banner.uniqueSlug}>
                      <td key={banner.index}>{index + 1}</td>
                      <td><img src={banner.backgroundImageUrl} alt={banner.name} width="180px"></img></td>
                      <td>{banner.name}</td>
                      <td>{banner.platform}</td>
                      <td>
                        <Button variant="primary" onClick={() => this.toggleEdit(banner)}>Edit</Button>
                        <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete banner ${banner.name}?`)) this.onDelete(banner.uniqueSlug, banner.name) }}>Delete</Button>
                        
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

export default AllBanner
