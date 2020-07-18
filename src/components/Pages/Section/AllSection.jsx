import React, { Component } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import * as Icons from 'react-bootstrap-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import auth from '../../../services/authentication'
import { getAll, removeSection, createSection, baseURL } from '../../../services/serviceSections';
import { getChannelDropdown } from '../../../services/serviceChannels';

import update from 'immutability-helper';
import axios from 'axios'
import { ChromePicker } from 'react-color'
import { getAllSectionTypes } from '../../../services/serviceSectionTypes'
import { getShowsDropDowns } from '../../../services/serviceShows'
import { getCategoryDropDowns } from '../../../services/serviceCategories'
import Select from 'react-select';

class AllSection extends Component {

  editedSectionContent = []

  state = {
    totalSections:0,
    options: [],
    sections: [],
    sectionTypes: [],
    editedSection: {},
    uniqueSlug: "",
    isLoading: false,
    isShowLoading: true,
    addNewSection: false
  }

  addDefaultContent = (items) => {
    if (!items) return []
    let content = items;
    let newContent = [];
    content.forEach(data => {
      newContent.push({ value: data.uniqueSlug, label: data.title || data.name })
    })
    // console.log("New content", newContent)
    return newContent
  }

  getTypeApi(type) {
    console.log("type:", type)
    this.setState({ isShowLoading: true });
    switch (type) {
      case "set-d62f14":
        getChannelDropdown()
          .then(res => {
            let channels = res.data;
            let channelOptions = [];
            channels.forEach(data => {
              channelOptions.push({ value: data.uniqueSlug, label: data.title })
            })
            this.setState({ options: channelOptions, isShowLoading: false })
          })
          .catch(err => {
            console.log(err)
            toast.error("channel data fetch failed")
          })
        break
      case "set-a02e66":
        getCategoryDropDowns()
          .then(res => {
            let categories = res.data;
            let categoriesOptions = [];
            categories.forEach(data => {
              categoriesOptions.push({ value: data.uniqueSlug, label: data.name })
            })
            this.setState({ options: categoriesOptions, isShowLoading: false })
          })
          .catch(err => {
            console.log(err)
            toast.error("Category data fetch failed")
          })
        break
      default:
        getShowsDropDowns()
          .then(response => {
            let shows = response.data
            let showOptions = [];
            shows.forEach(data => {
              showOptions.push({ value: data.uniqueSlug, label: data.title })
            })
            this.setState({ options: showOptions, isShowLoading: false })
            // console.log('options: ', this.state.options)
          })
          .catch(err => alert("Couldn't fetch shows data"))
    }
  }

  hideLoader = () => {
    this.setState({ isLoading: false });
  }

  showLoader = () => {
    this.setState({ isLoading: true });
  }

  fetchSectionData = async () => {
    this.showLoader()
    await getAll()
      .then(response => {
        this.setState({ sections: response.data, totalSections: response.data.length, isLoading:false })
      })
      .catch(err => {
        this.hideLoader()
        toast.error("Couldn't fetch Sections")
      })
  }

  async componentDidMount() {
    this.showLoader()
      await getAllSectionTypes()
      .then(response => {
        this.setState({ sectionTypes: response.data.results})
      })
      .catch(err => {
        this.hideLoader()
        toast.error("Couldn't fetch section types")
      })

    await getShowsDropDowns()
      .then(response => {
        let newOptions = this.state.options
        let show = response.data

        show.forEach(data => {
          newOptions.push({ value: data.uniqueSlug, label: data.title })
        })
        this.setState({ options: newOptions })
        
        // console.log('options: ', this.state.options)
      })
      .catch(err => toast.error("Couldn't fetch shows"))
      await this.fetchSectionData()
    // this.toggleAddNewSectionHandler()
  }

  deleteSectionHandler = (slug, section) => {
    this.showLoader()
    removeSection(slug)
      .then(() => {
        toast.success(`Show "${section}" deleted successfully!`)
        this.fetchSectionData()
      })
      .catch(err => {
        console.log("Show delete error: ", err)
        toast.error(`Section "${section}" delete unsuccessful, please try again later!`)
        this.hideLoader()
      })
  }

  toggleSectionEdit = (slug, section) => {
    if (this.state.editedSection.dirty && window.confirm(`There are unsaved values in current section "${this.state.editedSection.name}", Do you want to proceed without saving? updated values will be lost!`)) {
      if (this.state.addNewSection) {
        let newSection = this.state.sections
        newSection.shift()
        this.toggleAddNewSectionHandler();
        this.setState({ sections: newSection })
      }
      this.setState({
        uniqueSlug: slug,
        editedSection: {
          name: section.name,
          color: section.color,
          subtitle: section.subtitle,
          sequence: section.sequence,
          sectionType: section.sectionType,
          content_slug: this.addDefaultContent(section.items),
          dirty: false
        }
      })
    }
    if (!this.state.uniqueSlug || !this.state.editedSection.dirty) {
      this.setState({
        uniqueSlug: slug,
        editedSection: {
          name: section.name,
          color: section.color,
          subtitle: section.subtitle,
          sequence: section.sequence,
          sectionType: section.sectionType,
          content_slug: this.addDefaultContent(section.items),
          dirty: false
        }
      })
    }
  }

  cancelSectionHandler = () => {
    this.setState({ editedSection: {}, uniqueSlug: "" })
  }

  editSectionHandler = (event) => {
    if (event.target.name === "section_type_slug") {
      this.getTypeApi(event.target.value)
    }
    let prevEditedSection = this.state.editedSection
    prevEditedSection.dirty = true;
    let newEditedSection = update(prevEditedSection, event.target.name === "sequence" ? { [event.target.name]: { $set: parseInt(event.target.value) } } : { [event.target.name]: { $set: event.target.value } })
    this.setState({ editedSection: newEditedSection })
  }

  updateSectionHandler = () => {
    this.showLoader()
    let contentSlug = this.state.editedSection.content_slug.map(data => {
      return data.value
    })
    let content_slug = contentSlug.join()
    let data = this.state.editedSection;
    console.log(data)
    let formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case 'dirty':
        case 'sectionType':
        case 'sequence':
          if (!value) formData.append(`${key}`, 1)
          break;
        case 'content_slug':
          formData.append(`${key}`, content_slug)
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
        toast.success(`Section "${this.state.editedSection.name}" updated!`)
        this.setState({ editedSection: {}, uniqueSlug:"" }, () => this.fetchSectionData())
      })
      .catch(err => {
        toast.error("Error updating section!")
        this.hideLoader()
      })
  }

  colorPickerHandler = (color) => {
    // console.log(color.hex)
    let newSection = this.state.editedSection
    newSection.color = color.hex
    newSection.dirty = true
    this.setState({ editedSection: newSection })
  }

  toggleAddNewSectionHandler = () => {
    this.setState({ addNewSection: !this.state.addNewSection })
  }

  addNewSectionHandler = () => {
    let prevSection = this.state.sections
    prevSection.unshift({
      name: "New Section",
      color: "#ffffff",
      subtitle: "",
      sequence: 1,
      sectionType: "",
      content_slug: [],
      dirty: false
    })
    this.toggleAddNewSectionHandler()
    this.setState({ sections: prevSection, uniqueSlug: "" })
  }

  selectHandler = (value) => {
    let prevEditedSection = this.state.editedSection
    prevEditedSection.dirty = true;
    let newEditedSection = update(prevEditedSection, { content_slug: { $set: value } })
    this.setState({ editedSection: newEditedSection }, () => console.log(this.state.editedSection.content_slug))
  }

  cancelNewSectionHandler = () => {
    let prevSection = this.state.sections
    prevSection.shift()
    this.toggleAddNewSectionHandler();
    this.setState({ sections: prevSection })
  }

  postNewSectionHandler = () => {
    let contentSlug = this.state.editedSection.content_slug.map(data => {
      return data.value
    })
    let content_slug = contentSlug.join()
    let formData = new FormData()
    for (let [key, value] of Object.entries(this.state.editedSection)) {
      switch (key) {
        case 'dirty':
        case 'sectionType':
          break;
        case 'content_slug':
          formData.append(`${key}`, content_slug)
          break;
        default:
          formData.append(`${key}`, value)
      }

    }
    createSection(formData)
      .then(response => {
        toast.success(`New section "${response.data.name}" created succesfully`)
        this.setState({editedSection:{}}, () => {
          this.toggleAddNewSectionHandler()
        this.fetchSectionData()
        })        
      })
      .catch(err => {
        this.hideLoader();
        toast.error(JSON.stringify(err))
      })
  }

  render() {
    const { sections, editedSection, sectionTypes } = this.state
    const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>

    return (
      <Container>
        <ToastContainer position="top-right" />
        <div>
          <Row>
            <Col>
              <h2>Sections list ({this.state.totalSections})</h2>
              <p>(Double click on a row to edit)</p>
            </Col>
          </Row>
          <Row>
            <Col>
              {!this.state.addNewSection ? <Button variant="outline-success" title="Add New Show" onClick={this.addNewSectionHandler}><Icons.Plus /></Button> : null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive hover>
                <thead>
                  <tr key="header">
                    <th scope="col">Sr.no</th>
                    <th scope="col">Name</th>
                    <th scope="col">Subtitle</th>
                    <th scope="col">Color</th>
                    <th scope="col">Type</th>
                    <th scope="col">Sequence</th>
                    <th scope="col">Content</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !this.state.isLoading ?
                      sections.map((section, index) =>
                        this.state.uniqueSlug === section.uniqueSlug ?
                          <tr key={index} style={{ backgroundColor: "#ededed" }}>
                            <td>{index + 1}</td>
                            <td><input type="text" name="name" value={editedSection.name} onChange={this.editSectionHandler.bind(this)} placeholder="Enter name" autoComplete="off" /></td>
                            <td><input type="text" name="subtitle" value={editedSection.subtitle ? editedSection.subtitle : ""} placeholder="Enter subtitle" onChange={this.editSectionHandler.bind(this)} autoComplete="off" /></td>
                            <td><ChromePicker color={editedSection.color ? editedSection.color : "#fffff"} onChange={this.colorPickerHandler.bind(this)} /></td>
                            <td>
                              <select name="section_type_slug" onChange={this.editSectionHandler.bind(this)}>
                                <option defaultValue value={editedSection.sectionType ? editedSection.sectionType.uniqueSlug : ""}>{editedSection.sectionType ? editedSection.sectionType.name : "Select type"}</option>
                                {
                                  sectionTypes.map((sectionType, index) =>
                                    <option key={index} value={sectionType.uniqueSlug ? sectionType.uniqueSlug : ""}>{sectionType.name ? sectionType.name : "NA"}</option>
                                  )
                                }
                              </select>
                            </td>
                            <td><input type="number" min="1" name="sequence" value={editedSection.sequence ? editedSection.sequence : 1} onChange={this.editSectionHandler.bind(this)} autoComplete="off" /></td>
                            <td>{section.uniqueSlug ? <Select isMulti defaultValue={editedSection.content_slug} styles={{ control: styles => ({ ...styles, width: 300 }) }} name="content_slug" onChange={this.selectHandler} isLoading={this.state.isShowLoading} options={this.state.options} />
                              : <Select isMulti defaultValue styles={{ control: styles => ({ ...styles, width: 300 }) }} name="content_slug" onChange={this.selectHandler} isLoading={this.state.isShowLoading} options={this.state.options} />}</td>
                            <td> {this.state.uniqueSlug ? <div><Button variant="outline-success" onClick={this.updateSectionHandler}>Update</Button>&nbsp;<Button variant="outline-warning" onClick={() => { if (window.confirm("Do you wish to cancel ongoing changes?")) this.cancelSectionHandler() }}>Cancel</Button></div> : <div><Button variant="outline-success" onClick={this.postNewSectionHandler}>Add</Button><Button variant="outline-danger" onClick={() => { if (window.confirm(`Cancel adding new section "${section.name}"?`)) this.cancelNewSectionHandler() }}>Cancel</Button></div>}</td>
                            {/* <td> {this.state.uniqueSlug? <div><Button variant="outline-success" onClick={this.updateSectionHandler}>Update</Button>&nbsp;<Button variant="outline-warning" onClick={() => { if (window.confirm("Do you wish to cancel ongoing changes?")) this.cancelSectionHandler() }}>Cancel</Button></div>:<div>null</div>}</td> */}
                          </tr>
                          :
                          <tr key={index} onDoubleClick={this.toggleSectionEdit.bind(this, section.uniqueSlug, section)}>
                            <td>{index + 1}</td>
                            <td>{section.name ? section.name : "NA"}</td>
                            <td>{section.subtitle ? section.subtitle : "NA"}</td>
                            <td>
                              <svg width="20" height="20">
                                <rect width="20" height="20" style={{ fill: section.color, strokeWidth: 3, stroke: "rgb(0,0,0)" }} />
                              </svg>
                            </td>
                            <td>{section.sectionType ? section.sectionType.name : "NA"}</td>
                            <td>{section.sequence ? section.sequence : "NA"}</td>
                            <td >{this.state.addNewSection && !section.uniqueSlug ? <p>No Content</p> : section.items.length}</td>
                            <td>{this.state.addNewSection && !section.uniqueSlug ? <Button variant="outline-danger" onClick={() => { if (window.confirm(`Cancel adding new section "${section.name}"?`)) this.cancelNewSectionHandler() }}>Cancel</Button> : <Button variant="outline-danger" onClick={() => { if (window.confirm(`Are you sure you want to delete section "${section.name}"?`)) this.deleteSectionHandler(section.uniqueSlug, section.name) }}>Delete</Button>}</td>
                          </tr>

                      )
                      :
                      <tr>
                        <td>{loader}</td>
                        <td>{loader}</td>
                        <td>{loader}</td>
                        <td>{loader}</td>
                        <td>{loader}</td>
                        <td>{loader}</td>
                        <td>{loader}</td>
                      </tr>
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default AllSection;