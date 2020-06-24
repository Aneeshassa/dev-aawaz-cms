import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Figure } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllCategory, removeCategory, updateCategory, baseURL } from '../../../services/serviceCategories';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import auth from '../../../services/authentication';

class AllCategory extends Component {


  constructor(props) {
    super(props)

    this.state = {
      category: [],
      isLoading: false,
      isEdit: false,
      imageUpdating: false,
      editedCategory: undefined
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  async componentDidMount() {
    //Load all the category
    this.showLoader();
    await getAllCategory().then(response => {
      console.log(response.data.results)
      this.setState({ category: response.data.results })
      this.hideLoader();
    })
      .catch(error => {
        console.log(error)
      });
  }

  async onImageUpload(uniqueSlug, event) {
    // this.setState({ imageUpdating: true })
    console.log("current edited image category id:, ", uniqueSlug)
    let formData = new FormData();
    switch (event.target.name) {
      case 'featured_image':
        console.log("featured image switch case ")
        formData.append('featured_image', event.target.files[0])
        break;
      default:
        console.log("banner image switch case ")
        formData.append('icon_image', event.target.files[0])
    }

    // formData.append('name', 'featured_image')
    await axios({
      url: `${baseURL}/category/${uniqueSlug}/`,
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(res => {
        if (res.status === 200) {
          // console.log("file upload completed")
          // console.log("f Data: ", res.data.featuredImageUrl)
          // console.log("b Data: ", res.data.iconImageUrl)
          this.forceUpdate()
          
            this.setState({ editedCategory: { ...this.state.editedCategory, featuredImageUrl: res.data.featuredImageUrl } })
            console.log("featuredImageUrl updated")
            // console.log("edited image category id after update:, ", this.state.editedCategory.uniqueSlug)
          
          
            this.setState({ editedCategory: { ...this.state.editedCategory, iconImageUrl: res.data.iconImageUrl} })
            console.log("iconImageUrl updated")          
          // this.setState({ imageUpdating: false })
        }
      })
      .catch(err => console.log(err))
  }

  async onDelete(uniqueSlug, name) {

    await removeCategory(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Category ${name} deleted successfully.`);
          this.componentDidMount();
        }
      })
      .catch(err => {
        console.log(err)
        alert(`Category ${name} delete failed, try again later.`);
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
      editedCategory: show,
      isEdit: !this.isEdit
    })
  }

  changeHandler = (event) => {
    let show = this.state.editedCategory
    let editShow = {
      ...show,
      [event.target.name]: event.target.value
    }
    this.setState({ editedCategory: editShow })
  }

  updateHandler = (e) => {
    e.preventDefault()
    this.handleClose()
    console.log("data: ", this.state.editedCategory)
    console.log("id after update: ", this.state.editedCategory.uniqueSlug)
    updateCategory(this.state.editedCategory.uniqueSlug, this.state.editedCategory)
      .then(response => {
        if (response.status === 200) {
          alert("Category updated successfully")
          this.forceUpdate()
          return this.componentDidMount()
        }
        alert("Category updated unsuccessful, please try again later!")
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.forceUpdate()
        this.componentDidMount()
      })
  }
  render() {

    const { category } = this.state
    let imgHash = Date.now()

    return (

      <div>
        <ToastContainer />
        {(this.state.isEdit) ?
          <Modal size="xl" show={this.state.isEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.updateHandler}>
                <Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Label>Category Name: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Category Name here" name="title" value={this.state.editedCategory.title} onChange={this.changeHandler} />
                    </Col>
                  </Form.Row>

                  <Form.Group>
                    <Form.Row>
                      <Col>
                        <Form.Label>Current Featured Image: </Form.Label><br></br>
                        {this.state.editedCategory.featuredImageUrl ?
                          <Figure>
                            <Figure.Image src={`${this.state.editedCategory.featuredImageUrl}?${imgHash}`} width={171} height={180} />
                          </Figure> : <p>No Image uploaded</p>}
                        {
                          this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                        }
                        <br></br>
                        <Form.Label>Change Featured Image: </Form.Label>
                        <Form.Control type="file" placeholder="Featured Image" name="featured_image" onChange={(event) => this.onImageUpload(this.state.editedCategory.uniqueSlug, event)} />
                      </Col>
                      <Col>
                        <Form.Label>Current Banner Image: </Form.Label><br></br>
                        {this.state.editedCategory.iconImageUrl ?
                          <Figure>
                            <Figure.Image src={`${this.state.editedCategory.iconImageUrl}?${imgHash}`} width={171} height={180} />
                          </Figure> : <p>No Image uploaded</p>}
                        {
                          this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                        }
                        <br></br>
                        <Form.Label>Change Banner Image: </Form.Label>
                        <Form.Control type="file" name="icon_image" onChange={(event) => this.onImageUpload(this.state.editedCategory.uniqueSlug, event)} />
                      </Col>
                    </Form.Row>

                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Weight: </Form.Label>
                    <Form.Control type="number" placeholder="Weight" name="weight" value={this.state.editedCategory.weight} onChange={this.changeHandler} />
                  </Form.Group>


                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Sequence: </Form.Label>
                    <Form.Control type="number" placeholder="Sequence" name="sequence" value={this.state.editedCategory.sequence} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description: </Form.Label>
                    <Form.Control as="textarea" rows="4" placeholder="Description" name="description" value={this.state.editedCategory.description} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short Description: </Form.Label>
                    <Form.Control as="textarea" rows="2" placeholder="Short Description" name="shortDescription" value={this.state.editedCategory.shortDescription} onChange={this.changeHandler} />
                  </Form.Group>                  

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Color: </Form.Label>
                    <Form.Control type="text" placeholder="Color" name="color" value={this.state.editedCategory.color} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short URL: </Form.Label>
                    <Form.Control type="text" placeholder="Short URL" name="shortUrl" value={this.state.editedCategory.shortUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Deep url: </Form.Label>
                    <Form.Control type="url" placeholder="Deep url" name="deepUrl" value={this.state.editedCategory.deepUrl} onChange={this.changeHandler} />
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
        <h2>List of Category</h2>
        {(this.state.isLoading) ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Featured Image</th>
                <th scope="col">Category Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                category.length ?
                  category.map((category, index) =>
                    <tr key={index}>
                      <td key={index}>{index + 1}</td>
                      <td><img src={`${category.featuredImageUrl}?${imgHash}`} alt={category.name} width="80px"></img></td>
                      <td>{category.name}</td>
                      <td>
                        <Button variant="primary" onClick={() => this.toggleEdit(category)}>Edit</Button>
                        <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete category ${category.name}?`)) this.onDelete(category.uniqueSlug, category.name) }}>Delete</Button>
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

export default AllCategory
