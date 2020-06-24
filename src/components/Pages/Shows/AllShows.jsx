import React, { Component } from 'react';
import { Table, Button, Alert, Container, Row, Col, Image } from 'react-bootstrap';
import Loader from 'react-loader-spinner';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { getAllShowPaginate, removeShow } from '../../../services/serviceShows';
import ReactPaginate from 'react-paginate';
// import '../pagination.css'
import 'react-toastify/dist/ReactToastify.css';

class AllShows extends Component {


  constructor(props) {
    super(props)

    this.state = {
      total:0,
      count: 0,
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

  fetchData = async () => {
    this.showLoader();
    await getAllShowPaginate().then(response => {
      // console.log(response.data.results)
      // localStorage.setItem("shows", JSON.stringify(response.data.results))
      this.setState({ shows: response.data.results, count: Math.ceil(response.data.count / 10), total: response.data.count })
      this.hideLoader();
    })
      .catch(error => {
        alert(error)
        this.hideLoader();
      });
  }

  async componentDidMount() {
    //Load all the shows

    // if(JSON.parse(localStorage.getItem('shows'))){
    //   this.setState({shows: JSON.parse(localStorage.getItem('shows'))})
    //   return 
    // }
    // else{
    this.fetchData();
    // }  
  }

  async onDelete(uniqueSlug, title) {
    // this.toggleEdit(uniqueSlug)
    await removeShow(uniqueSlug)
      .then(response => {
        if (response.status === 204) {
          alert(`Show ${title} deleted successfully.`);
          window.location.reload()
        }
      })
      .catch(err => console.log(err));
  }

  handlePageClick = data => {
    this.showLoader()
    let selected = data.selected;
    console.log('selected page no: ', selected)
    getAllShowPaginate(selected)
      .then(res => {
        this.setState({ shows: res.data.results, count: Math.ceil(res.data.count / 10) });
        this.hideLoader()
      })
      .catch(err => {
        this.hideLoader()
        console.log(err)
      })
  };

  render() {
    const { shows } = this.state;
    let imgHash = Date.now()
    return (

      <div>
        <Container>
          <Row>
            <Col>
              <h2>List of Shows({this.state.total})</h2>
            </Col>

          </Row>
        </Container> <br></br>

        {(this.state.isLoading) ?<div className="loader"><Loader type="ThreeDots" color="#eb1163" height={100} width={50} /></div> :
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
                shows ?
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
                  null
              }
            </tbody>
          </Table>
          
          </div>
        }
        {this.state.count === 0? <p>Please wait...</p>:
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.count}
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
