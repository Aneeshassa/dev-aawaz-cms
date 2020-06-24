import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Figure } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllBadge, removeBadge, updateBadge, baseURL } from '../../../services/serviceBadges';
import auth from '../../../services/authentication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

class AllBadge extends Component {


  constructor(props) {
    super(props)

    this.state = {
      badge: [],
      isLoading: false,
      isEdit: false,
      imageUpdating:false,
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

  async onImageUpload(uniqueSlug, event){
    this.setState({imageUpdating: true})
    console.log("current edited image badge id:, ",uniqueSlug)
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
      url: `${baseURL}/badge/${uniqueSlug}/`,
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
        if(res.data.featuredImageUrl !== this.state.editedBadge.featuredImageUrl){
          this.setState({editedBadge:{...this.state.editedBadge, featuredImageUrl: res.data.featuredImageUrl}})
          console.log("featuredImageUrl updated")
          console.log("edited image badge id after update:, ",this.state.editedBadge.uniqueSlug)
        }
        if(res.data.bannerImageUrl !== this.state.editedBadge.bannerImageUrl){
          this.setState({editedBadge:{...this.state.editedBadge,bannerImageUrl: res.data.bannerImageUrl}})
          console.log("bannerImageUrl updated")
        }
        this.setState({imageUpdating: false})
      }
    })
    .catch(err => console.log(err))
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
        alert(`Badge ${name} delete failed, try again later.`);
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
    })
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
    console.log("data: ", this.state.editedBadge)
    console.log("id after update: ", this.state.editedBadge.uniqueSlug)
    updateBadge(this.state.editedBadge.uniqueSlug, this.state.editedBadge)
      .then(response => {
        if(response.status === 200){
          alert("Badge updated successfully")
          this.forceUpdate()
          return this.componentDidMount()
        }
          alert("Badge updated unsuccessful, please try again later!")       
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.forceUpdate()
        this.componentDidMount()
      })
  }
  render() {

    const { badge } = this.state
    

    return (

      <div>
        <ToastContainer />
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
                      <Form.Control type="text" placeholder="Enter Badge Name here" name="title" value={this.state.editedBadge.title} onChange={this.changeHandler} />
                    </Col>
                  </Form.Row>

                  <Form.Group>
                    <Form.Label>Current Featured Image: </Form.Label><br></br>
                    {this.state.editedBadge.featuredImageUrl? 
                    <Figure>
                      <Figure.Image src={this.state.editedBadge.featuredImageUrl} width={171} height={180} />
                    </Figure> : <p>No Image uploaded</p>}
                    {
                      this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                    }
                    <br></br>
                    <Form.Label>Change Featured Image: </Form.Label>
                    <Form.Control type="file" placeholder="Featured Image" name="featured_image" onChange={(event)=> this.onImageUpload(this.state.editedBadge.uniqueSlug, event)} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Weight: </Form.Label>
                    <Form.Control type="number" placeholder="Weight" name="weight" value={this.state.editedBadge.weight} onChange={this.changeHandler} />
                  </Form.Group>


                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Sequence: </Form.Label>
                    <Form.Control type="number" placeholder="Sequence" name="sequence" value={this.state.editedBadge.sequence} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short Description: </Form.Label>
                    <Form.Control type="text" placeholder="Short Description" name="shortDescription" value={this.state.editedBadge.shortDescription} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description: </Form.Label>
                    <Form.Control type="text" placeholder="Description" name="description" value={this.state.editedBadge.description} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Color: </Form.Label>
                    <Form.Control type="text" placeholder="Color" name="color" value={this.state.editedBadge.color} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short URL: </Form.Label>
                    <Form.Control type="text" placeholder="Short URL" name="shortUrl" value={this.state.editedBadge.shortUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Deep url: </Form.Label>
                    <Form.Control type="url" placeholder="Deep url" name="deepUrl" value={this.state.editedBadge.deepUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Current Banner Image: </Form.Label><br></br>
                  {this.state.editedBadge.bannerImageUrl? 
                    <Figure>
                      <Figure.Image src={this.state.editedBadge.bannerImageUrl} width={171} height={180} />
                    </Figure> : <p>No Image uploaded</p>}
                    {
                      this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                    }
                    <br></br>
                    <Form.Label>Change Banner Image: </Form.Label>                    
                      <Form.Control type="file" name="banner_image" onChange={(event)=> this.onImageUpload(this.state.editedBadge.uniqueSlug, event)} />
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
        <h2>List of Badge</h2>
        {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Badge Image</th>
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
                      <td><img src={badge.iconUrl} alt={badge.name} width="80px"></img></td>
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
