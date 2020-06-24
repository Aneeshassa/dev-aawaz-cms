import React, { Component } from 'react';
import { Table, Button, Alert, Container, Row, Col, Image } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import auth from '../../../services/authentication'
import { getAllSectionsPagination, removeSection, baseURL} from '../../../services/serviceSections';
import ReactPaginate from 'react-paginate';
import update from 'immutability-helper';
import axios from 'axios'

class AllSection extends Component {
  state = {
    totalSections: 0,
    paginationCount: 0,
    sections: [],
    editedSection: {},
    uniqueSlug: "",
    isLoading: false
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  componentDidMount() {
    this.showLoader()
    getAllSectionsPagination()
      .then(response => {
        this.setState({ sections: response.data.results, paginationCount: Math.ceil(response.data.count / 10), totalSections: response.data.count })
        this.hideLoader()
      })
  }

  handlePageClick = data => {
    this.showLoader()
    let selected = data.selected;
    console.log('selected page no: ', selected)
    getAllSectionsPagination(selected)
      .then(res => {
        this.setState({ sections: res.data.results, count: Math.ceil(res.data.count / 10) });
        this.hideLoader()
      })
      .catch(err => {
        this.hideLoader()
        alert(err)
        console.log(err)
      })
  };

  deleteSectionHandler = (slug, section) => {
    this.showLoader()
    removeSection(slug)
      .then(() => {
        alert(`Show "${section}" deleted successfully!`)
        this.hideLoader()
        window.location.reload()
      })
      .catch(err => {
        console.log("Show delete error: ", err)
        alert(`Show "${section}" delete unsuccessful, please try again later!`)
        this.hideLoader()
      })
  }

  toggleSectionEdit = (slug, section) => {
    if (this.state.editedSection.dirty && window.confirm(`There are unsaved values in current section "${this.state.editedSection.name}", Do you want to proceed without saving? updated values will be lost!`)) {
      /* if (this.state.addNewShow) {
          let prevShows = this.state.shows
          prevShows.shift()
          this.toggleAddNewShow();
          this.setState({ shows: prevShows })
      } */
      this.setState({
        uniqueSlug: slug,
        editedSection: {
          name: section.name,
          dirty: false
        }
      })
    }
    if (!this.state.uniqueSlug || !this.state.editedSection.dirty) {
      this.setState({
        uniqueSlug: slug,
        editedSection: {
          name: section.name,
          dirty: false
        }
      })
    }
  }

  cancelSectionHandler = () => {
    this.setState({ editedSection: {}, uniqueSlug: "" })
  }

  editSectionHandler = (event) => {
    let prevEditedSection = this.state.editedSection
    prevEditedSection.dirty = true;
    let newEditedSection = update(prevEditedSection, event.target.name === "weight" || event.target.name === "sequence" ? { [event.target.name]: { $set: parseInt(event.target.value) } } : { [event.target.name]: { $set: event.target.value } })
    this.setState({ editedSection: newEditedSection })
  }

  updateSectionHandler = () => {
    this.showLoader()
    let data = this.state.editedSection;
    let formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case 'dirty':
          break;
        default:
          formData.append(`${key}`, value)
      }      
    }
    axios({
      method: "PATCH",
      url: `${baseURL}/section/${this.state.uniqueSlug}/`,
      headers: {
          "Content-Type": "multipart/form-data"
      },
      auth: auth,
      data: formData
  })
      .then(() => {
          alert(`Section "${this.state.editedSection.name}" updated!`)
          this.setState({ editedSection: {} }, () => window.location.reload())
      })
      .catch(err => {
          alert(err)
          this.hideLoader()
      })
  }

  render() {
    const { sections, editedSection } = this.state
    

    return (
      <Container>
        <div>
          <Row>
            <Col>
              <h2>List of sections({this.state.totalSections})</h2>
              <p>(Double click on a row to edit)</p>
            </Col>
          </Row>
          <Row>
            <Col>
              {}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive hover>
                <thead>
                  <tr key="header">
                    <th scope="col">Sr.no</th>
                    <th scope="col">Section Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !this.state.isLoading?
                      sections.map((section, index) =>
                        this.state.uniqueSlug === section.uniqueSlug ?
                          <tr key={index} style={{ backgroundColor: "#ededed" }}>
                            <td>{index + 1}</td>
                            <td><input type="text" name="name" value={editedSection.name} onChange={this.editSectionHandler.bind(this)} autoComplete="off" /></td>
                            <td> <Button variant="outline-success" onClick={this.updateSectionHandler}>Update</Button> &nbsp; <Button variant="outline-warning" onClick={() => { if (window.confirm("Do you wish to cancel ongoing changes?")) this.cancelSectionHandler() }}>Cancel</Button></td>
                          </tr>
                          :
                          <tr key={index} onDoubleClick={this.toggleSectionEdit.bind(this, section.uniqueSlug, section)}>
                            <td>{index + 1}</td>
                            <td>{section.name}</td>
                            <td><Button variant="outline-danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete section "${section.name}"?`)) this.deleteSectionHandler(section.uniqueSlug, section.name) }}>Delete</Button></td>
                          </tr>

                      )
                      :
                      <tr>
                        <td ><ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="300" height="6" /><rect x="0" y="72" rx="3" ry="3" width="200" height="6" /></ContentLoader></td>
                        <td ><ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="300" height="6" /><rect x="0" y="72" rx="3" ry="3" width="200" height="6" /></ContentLoader></td>
                        <td ><ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="300" height="6" /><rect x="0" y="72" rx="3" ry="3" width="200" height="6" /></ContentLoader></td>
                      </tr>
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              {this.state.paginationCount === 0 ? <p>Retrieving data, please wait...</p> :
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
              }
            </Col>
          </Row>

        </div>
      </Container>
    );
  }
}

export default AllSection;