import React, { Component } from 'react';
import { Table, Button, Modal, Form, Col, Figure } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import ReactPaginate from 'react-paginate';
// import Loader from 'react-loader-spinner';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllChannelPagination, removeChannel, updateChannel, baseURL } from '../../../services/serviceChannels';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import auth from '../../../services/authentication';

class AllChannel extends Component {


  constructor(props) {
    super(props)

    this.state = {
      next: "not null",
      totalChannel: 0,
      paginationCount: 0,
      currentPage: 1,
      channel: [],
      isLoading: false,
      isEdit: false,
      imageUpdating: false,
      editedChannels: undefined
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
    this.showLoader();
    await getAllChannelPagination(pageNo).then(response => {
      // console.log(response.data.results)
      this.setState({ channel: response.data.results, next: response.data.next, paginationCount: Math.ceil(response.data.count / 10), totalChannel: response.data.count })
      this.hideLoader();
    })
      .catch(error => {
        toast.error("Error occured while fetching data")
        console.log(error)
        this.hideLoader();
      });

  }

  async componentDidMount() {
    //Load all the channel
    this.fetchData(this.state.currentPage)
  }

  async onImageUpload(uniqueSlug, event) {
    this.setState({ imageUpdating: true })
    // console.log("current edited image channel id:, ", uniqueSlug)
    let formData = new FormData();
    switch (event.target.name) {
      case 'featured_image':
        // console.log("featured image switch case ")
        formData.append('featured_image', event.target.files[0])
        break;
      default:
        // console.log("banner image switch case ")
        formData.append('banner_image', event.target.files[0])
    }

    // formData.append('name', 'featured_image')
    await axios({
      url: `${baseURL}/channels/${uniqueSlug}/`,
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
          // console.log("b Data: ", res.data.bannerImageUrl)
          // this.forceUpdate()
          if (res.data.featuredImageUrl !== this.state.editedChannels.featuredImageUrl) {
            this.setState({ editedChannels: { ...this.state.editedChannels, featuredImageUrl: res.data.featuredImageUrl } })
            // console.log("featuredImageUrl updated")
            // console.log("edited image channel id after update:, ", this.state.editedChannels.uniqueSlug)
          }
          if (res.data.bannerImageUrl !== this.state.editedChannels.bannerImageUrl) {
            this.setState({ editedChannels: { ...this.state.editedChannels, bannerImageUrl: res.data.bannerImageUrl } })
            // console.log("bannerImageUrl updated")
          }
          this.setState({ imageUpdating: false })
        }
      })
      .catch(error => {
        toast.error("Error occured while uploading image!")
        console.log(error)
        this.hideLoader();
      });
  }

  async onDelete(uniqueSlug, title) {
    this.showLoader();
    await removeChannel(uniqueSlug)
      .then(()=> {
        toast.success(`Channel "${title}" deleted successfully!`)
        if (this.state.next === null && this.state.channel.length < 2 && this.state.currentPage !== 1) {
          this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchData(this.state.currentPage))
        }
        else {
          this.fetchData(this.state.currentPage)
        }
      })
      .catch(error => {
        toast.error("Error occured while deleting data!")
        console.log(error)
        this.hideLoader();
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
      editedChannels: show,
      isEdit: !this.isEdit
    })
  }

  changeHandler = (event) => {
    let show = this.state.editedChannels
    let editShow = {
      ...show,
      [event.target.name]: event.target.value
    }
    this.setState({ editedChannels: editShow })
  }

  updateHandler = (e) => {
    e.preventDefault()
    this.handleClose()
    this.showLoader()
    // console.log("data: ", this.state.editedChannels)
    // console.log("id after update: ", this.state.editedChannels.uniqueSlug)
    updateChannel(this.state.editedChannels.uniqueSlug, this.state.editedChannels)
      .then(response => {
        if (response.status === 200) {
          toast.success("Channel updated successfully")
          // this.forceUpdate()
          return this.fetchData(this.state.currentPage)
        }
        toast.error("Channel updated unsuccessful, please try again later!")
      })
      .catch(error => {
        toast.error("Error occured while updating channel data!")
        console.log(error)
        this.hideLoader();
        this.handleShow();
      });
  }
  handlePageClick = data => {
    this.showLoader()
    let selected = data.selected + 1;
    // console.log('selected page no: ', selected)
    this.setState({ currentPage: selected }, () => this.fetchData(this.state.currentPage))
  };
  render() {

    const { channel } = this.state
    const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>

    return (

      <div>
        <ToastContainer />
        {(this.state.isEdit) ?
          <Modal size="xl" show={this.state.isEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.updateHandler}>
                <Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Label>Channel Name: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Channel Name here" name="title" value={this.state.editedChannels.title} onChange={this.changeHandler} />
                    </Col>
                  </Form.Row>

                  <Form.Group>
                    <Form.Row>
                      <Col>
                        <Form.Label>Current Featured Image: </Form.Label><br></br>
                        {this.state.editedChannels.featuredImageUrl ?
                          <Figure>
                            <Figure.Image src={this.state.editedChannels.featuredImageUrl} width={171} height={180} />
                          </Figure> : <p>No Image uploaded</p>}
                        {
                          this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                        }
                        <br></br>
                        <Form.Label>Change Featured Image: </Form.Label>
                        <Form.Control type="file" placeholder="Featured Image" name="featured_image" onChange={(event) => this.onImageUpload(this.state.editedChannels.uniqueSlug, event)} />
                      </Col>
                      <Col>
                        <Form.Label>Current Banner Image: </Form.Label><br></br>
                        {this.state.editedChannels.bannerImageUrl ?
                          <Figure>
                            <Figure.Image src={this.state.editedChannels.bannerImageUrl} width={171} height={180} />
                          </Figure> : <p>No Image uploaded</p>}
                        {
                          this.state.imageUpdating ? <p>Updating image please wait... </p> : null
                        }
                        <br></br>
                        <Form.Label>Change Banner Image: </Form.Label>
                        <Form.Control type="file" name="banner_image" onChange={(event) => this.onImageUpload(this.state.editedChannels.uniqueSlug, event)} />
                      </Col>
                    </Form.Row>

                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Weight: </Form.Label>
                    <Form.Control type="number" placeholder="Weight" name="weight" value={this.state.editedChannels.weight} onChange={this.changeHandler} />
                  </Form.Group>


                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Sequence: </Form.Label>
                    <Form.Control type="number" placeholder="Sequence" name="sequence" value={this.state.editedChannels.sequence} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description: </Form.Label>
                    <Form.Control as="textarea" rows="4" placeholder="Description" name="description" value={this.state.editedChannels.description} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short Description: </Form.Label>
                    <Form.Control as="textarea" rows="2" placeholder="Short Description" name="shortDescription" value={this.state.editedChannels.shortDescription} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Color: </Form.Label>
                    <Form.Control type="text" placeholder="Color" name="color" value={this.state.editedChannels.color} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Short URL: </Form.Label>
                    <Form.Control type="text" placeholder="Short URL" name="shortUrl" value={this.state.editedChannels.shortUrl} onChange={this.changeHandler} />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Deep url: </Form.Label>
                    <Form.Control type="url" placeholder="Deep url" name="deepUrl" value={this.state.editedChannels.deepUrl} onChange={this.changeHandler} />
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
        <h2>Channel list ({this.state.totalChannel})</h2>

        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">Sr.no</th>
              <th scope="col">Featured Image</th>
              <th scope="col">Channel Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              !this.state.isLoading ?
                channel.map((channel, index) =>
                  <tr key={channel.uniqueSlug}>
                    <td key={channel.index}>{index + 1}</td>
                    <td><img src={channel.featuredImageUrl} alt={channel.title} width="80px"></img></td>
                    <td>{channel.title}</td>
                    <td>
                      <Button variant="primary" onClick={() => this.toggleEdit(channel)}>Edit</Button>
                      <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete channel ${channel.title}?`)) this.onDelete(channel.uniqueSlug, channel.title) }}>Delete</Button>
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

export default AllChannel
