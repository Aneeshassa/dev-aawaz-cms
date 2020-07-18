import React, { Component } from 'react';
import { Table, Button, Alert, Container, Row, Col, Image } from 'react-bootstrap';
import ContentLoader from "react-content-loader"

import { getAllShowPaginate, removeShow } from '../../../services/serviceShows';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AllShows extends Component {


  constructor(props) {
    super(props)

    this.state = {
      next: "not null",
      totalShow: 0,
      paginationCount: 0,
      currentPage: 1,
      shows: [],
      isLoading: false
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  fetchData = async (page = 1) => {
    this.showLoader();
    await getAllShowPaginate(page).then(response => {
      // console.log(response.data.results)
      // localStorage.setItem("shows", JSON.stringify(response.data.results))
      this.setState({ shows: response.data.results, next: response.data.next, paginationCount: Math.ceil(response.data.count / 10), totalShow: response.data.count })
      this.hideLoader();
    })
      .catch(error => {
        toast.error("Error occured while fetching data")
        console.log(error)
        this.hideLoader();
      });
  }

  async componentDidMount() {
    this.fetchData(this.state.currentPage);
  }

  async onDelete(uniqueSlug, title) {
    // this.toggleEdit(uniqueSlug)
    await removeShow(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          toast(`Show ${title} deleted successfully.`);
          if (this.state.next === null && this.state.shows.length < 2 && this.state.currentPage !== 1) {
            this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchData(this.state.currentPage))
          }
          else {
            this.fetchData(this.state.currentPage)
          }
        }
      })
      .catch(err => {
        toast.error(`Show ${title} deleted failed.`);
        console.log(err)
      });
  }

  handlePageClick = data => {
    this.showLoader()
    let selected = data.selected + 1;
    // console.log('selected page no: ', selected)
    this.setState({ currentPage: selected }, () => this.fetchData(this.state.currentPage))
  };

  render() {
    const { shows } = this.state;
    let imgHash = Date.now()
    const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>
    return (

      <div>
        <ToastContainer position="top-right" />
        <Container>
          <Row>
            <Col>
              <h2>Shows list ({this.state.totalShow})</h2>
            </Col>

          </Row>
        </Container> <br></br>

        <div>
          <Table responsive hover>
            <thead>
              <tr key="header">
                <th scope="col">Sr.no</th>
                <th scope="col">Featured Image</th>
                <th scope="col">Show Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                !this.state.isLoading ?
                  shows.map((show, index) =>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><Image src={`${show.featuredImageUrl}?${imgHash}`} alt={show.title} width="80px" thumbnail></Image></td>
                      <td>{show.title}</td>
                      <td>
                        <Alert.Link href={"/shows/edit-show-episode?unique=" + show.uniqueSlug}>Edit Episodes</Alert.Link> &nbsp;
                      <Alert.Link href={"/shows/edit-show?unique=" + show.uniqueSlug}>Edit Show</Alert.Link> &nbsp;
                      <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete show ${show.title}?`)) this.onDelete(show.uniqueSlug, show.title) }}>Delete</Button>
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

        </div>

        {this.state.count === 0 ? <p>Please wait...</p> :
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
          ></ReactPaginate>}
      </div>
    )
  }
}

export default AllShows
