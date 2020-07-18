import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Figure } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import ReactPaginate from 'react-paginate';
// import Loader from 'react-loader-spinner';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllCategoryPagination, removeCategory, updateCategory, baseURL } from '../../../services/serviceCategories';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import auth from '../../../services/authentication';

class AllCategory extends Component {


  constructor(props) {
    super(props)

    this.state = {
      next: "not null",
      totalCategory: 0,
      paginationCount: 0,
      currentPage: 1,
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

  fetchData = async (page = 1) => {
    let pageNo = page
    // console.log('page no: ', pageNo)
    this.showLoader();
    await getAllCategoryPagination(pageNo).then(response => {
      // console.log(response.data.results)
      // localStorage.setItem("shows", JSON.stringify(response.data.results))
      this.setState({ category: response.data.results, next: response.data.next, paginationCount: Math.ceil(response.data.count / 10), totalCategory: response.data.count })
      this.hideLoader();
    })
      .catch(error => {
        toast.error("Error occured while fetching data")
        console.log(error)
        this.hideLoader();
      });
  }

  async componentDidMount() {
    //Load all the category
    this.showLoader();
    this.fetchData(this.state.currentPage)
  }

  async onImageUpload(uniqueSlug, event) {
    // this.setState({ imageUpdating: true })
    // console.log("current edited image category id:, ", uniqueSlug)
    let formData = new FormData();
    switch (event.target.name) {
      case 'featured_image':
        // console.log("featured image switch case ")
        formData.append('featured_image', event.target.files[0])
        break;
      default:
        // console.log("banner image switch case ")
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
          // this.forceUpdate()

          this.setState({ editedCategory: { ...this.state.editedCategory, featuredImageUrl: res.data.featuredImageUrl } })
          // console.log("featuredImageUrl updated")
          // console.log("edited image category id after update:, ", this.state.editedCategory.uniqueSlug)


          this.setState({ editedCategory: { ...this.state.editedCategory, iconImageUrl: res.data.iconImageUrl } })
          // console.log("iconImageUrl updated")
          // this.setState({ imageUpdating: false })
        }
      })
      .catch(err => {
        toast.error('Image upload failed!')
        console.log(err)
      })
  }

  async onDelete(uniqueSlug, name) {
    this.showLoader()
    await removeCategory(uniqueSlug)
      .then(() => {
        toast.success(`Category "${name}" deleted successfully!`)
        if (this.state.next === null && this.state.category.length < 2 && this.state.currentPage !== 1) {
          this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchData(this.state.currentPage))
        }
        else {
          this.fetchData(this.state.currentPage)
        }
      })
      .catch(err => {
        console.log(err)
        toast.error(`Category ${name} delete failed, try again later.`);
        this.hideLoader()
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
    this.showLoader()
    // console.log("data: ", this.state.editedCategory)
    // console.log("id after update: ", this.state.editedCategory.uniqueSlug)
    updateCategory(this.state.editedCategory.uniqueSlug, this.state.editedCategory)
      .then(response => {
        if (response.status === 200) {
          toast.success("Category updated successfully")
          // this.forceUpdate()
          return this.fetchData(this.state.currentPage)
        }
        toast.error("Category updated unsuccessful, please try again later!")
      })
      .catch(error => {
        toast.error("Category updated unsuccessful!")
        console.log(JSON.stringify(error));
        this.hideLoader()
        this.handleShow()
      })
  }

  handlePageClick = data => {
    this.showLoader()
    let selected = data.selected + 1;
    // console.log('selected page no: ', selected)
    this.setState({ currentPage: selected }, () => this.fetchData(this.state.currentPage))
  };

  render() {

    const { category } = this.state
    let imgHash = Date.now()
    const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>

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
                      <Form.Control type="text" placeholder="Enter Category Name here" name="name" value={this.state.editedCategory.name} onChange={this.changeHandler} />
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
        <h2>Category list ({this.state.totalCategory})</h2>

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
              !this.state.isLoading ?
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

                <tr>
                  <td>{loader}</td>
                  <td>{loader}</td>
                  <td>{loader}</td>
                  <td>{loader}</td>
                </tr>
            }
          </tbody>
        </Table>

        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.paginationCount}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    )
  }
}

export default AllCategory
