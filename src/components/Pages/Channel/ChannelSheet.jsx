import React, { Component } from 'react';
import { Table, Image, Button, Figure, Row, Col, Container } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import update from 'immutability-helper';
import * as Icons from 'react-bootstrap-icons'

import { baseURL, removeChannel, getAllChannel } from '../../../services/serviceChannels';
import axios from 'axios';
import auth from '../../../services/authentication';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';


class ChannelSheet extends Component {

    state = {
        next: "not null",
        totalCategory: 0,
        paginationCount: 0,
        currentPage: 1,
        shows: [],
        editedShow: {title: "edited show"},
        readFeaturedImg: undefined,
        readBannerImg: undefined,
        featuredImg: undefined,
        bannerImg: undefined,
        isLoading: false,
        addNewShow: false,
        uniqueSlug: "",
        title: ""
    }

    hideLoader = () => {
        this.setState({ isLoading: false });
    }

    showLoader = () => {
        this.setState({ isLoading: true });
    }

    fetchData = async () => {
        // console.log('page no: ', pageNo)
        this.showLoader();
        await getAllChannel().then(response => {
            // console.log(response.data.results)
            // localStorage.setItem("shows", JSON.stringify(response.data.results))
            this.setState({ shows: response.data, totalCategory: response.data.length })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Error occured while fetching data")
                console.log(error)
                this.hideLoader();
            });
    }

    beforeunload(e) {
        if (this.state.editedShow.dirty || this.state.addNewShow) {
            e.preventDefault();
            e.returnValue = true;
        }
    }

    componentDidMount = () => {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.fetchData(this.state.currentPage)
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    toggleEdit = (slug, show) => {
        // console.log(event.target.name)
        if (this.state.editedShow.dirty && window.confirm(`There are unsaved values in current channel "${this.state.editedShow.title}", Do you want to proceed without saving? updated values will be lost!`)) {
            if (this.state.addNewShow) {
                let prevShows = this.state.shows
                prevShows.shift()
                this.toggleAddNewShow();
                this.setState({ shows: prevShows })
            }
            this.setState({
                uniqueSlug: slug,
                bannerImg: undefined,
                featuredImg: undefined,
                readBannerImg: undefined,
                readFeaturedImg: undefined,
                editedShow: {
                    title: show.title,
                    description: show.description,
                    short_description: show.shortDescription,
                    featured_image: show.featuredImageUrl,
                    banner_image: show.bannerImageUrl,
                    deep_url: show.deepUrl,
                    published_on: show.publishedOn,
                    short_url: show.shortUrl,
                    weight: show.weight,
                    sequence: show.sequence,
                    channel_slug: show.uniqueSlug,
                    dirty: false
                }
            })
        }
        if (!this.state.uniqueSlug || !this.state.editedShow.dirty) {
            this.setState({
                uniqueSlug: slug,
                bannerImg: undefined,
                featuredImg: undefined,
                readBannerImg: undefined,
                readFeaturedImg: undefined,
                editedShow: {
                    title: show.title,
                    description: show.description,
                    short_description: show.shortDescription,
                    featured_image: show.featuredImageUrl,
                    banner_image: show.bannerImageUrl,
                    deep_url: show.deepUrl,
                    published_on: show.publishedOn,
                    short_url: show.shortUrl,
                    weight: show.weight,
                    sequence: show.sequence,
                    channel_slug: show.uniqueSlug,
                    dirty: false
                }
            })
        }
    }

    toggleAddNewShow = () => {
        this.setState({ addNewShow: !this.state.addNewShow })
    }

    cancelAddNewShow = () => {
        let prevShows = this.state.shows
        prevShows.shift()
        this.toggleAddNewShow();
        this.setState({ shows: prevShows })
    }

    editShowHandler = (event) => {
        let prevEditedShow = this.state.editedShow
        prevEditedShow.dirty = true;
        let newEditedShow = update(prevEditedShow, event.target.name === "weight" || event.target.name === "sequence" ? { [event.target.name]: { $set: parseInt(event.target.value) } } : { [event.target.name]: { $set: event.target.value } })
        // console.log('newEdited show: ', newEditedShow)
        this.setState({ editedShow: newEditedShow })
    }

    updateShowHandler = () => {
        this.showLoader()
        let data = this.state.editedShow;
        let formData = new FormData();
        if (this.state.featuredImg) formData.append('featured_image', this.state.featuredImg)
        if (this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'dirty':
                case 'featured_image':
                case 'banner_image':
                case 'channel_slug':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }

        axios({
            method: "PATCH",
            url: `${baseURL}/channels/${this.state.editedShow.channel_slug}/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                toast.success(`Channel "${this.state.editedShow.title}" updated!`)
                this.setState({ editedShow: {}, uniqueSlug: "" }, () => this.fetchData(this.state.currentPage))
            })
            .catch(err => {
                toast.error('Error occured while updating!')
                console.log(err)
                this.hideLoader()
            })
    }

    deleteShowHandler = (slug, show) => {
        this.showLoader()
        removeChannel(slug)
            .then(() => {
                toast.success(`Channel "${show}" deleted successfully!`)
                if (this.state.next === null && this.state.shows.length < 2 && this.state.currentPage !== 1) {
                    this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchData(this.state.currentPage))
                }
                else {
                    this.fetchData(this.state.currentPage)
                }
            })
            .catch(err => {
                console.log("Channel delete error: ", err)
                toast.error(`Channel "${show}" delete unsuccessful!`)
            })
    }

    updateData = async () => {
        this.fetchData(this.state.currentPage)
    }

    addShowHandler = () => {
        let prevShows = this.state.shows
        prevShows.unshift({
            title: "New Channel",
            description: "",
            short_description: "",
            featured_image: "",
            banner_image: "",
            deep_url: "https://www.example.com",            
            short_url: "blank",
            weight: 1,
            sequence: 1,
            dirty: false
        })
        this.toggleAddNewShow();
        this.setState({ shows: prevShows, uniqueSlug: "" })
    }

    addNewShowHandler = () => {
        this.showLoader()
        let data = this.state.editedShow;
        // console.log("Edited show: ",data)
        let formData = new FormData();
        if (this.state.featuredImg) formData.append('featured_image', this.state.featuredImg)
        if (this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'dirty':
                case 'channel_slug':
                    break;
                case 'published_on':
                    formData.append(`${key}`, `${moment(new Date()).format()}`)
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }
        for (var [key,value] of formData.entries()) {
            if(value === '' || value === undefined || value === {} ){
              this.setState({isLoading: false})
              return toast.error(`${key} is required!`)
            }
            // console.log(key+ ': ' + value); 
          }
        axios({
            method: "POST",
            url: `${baseURL}/channels/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                toast.success(`New category "${this.state.editedShow.title}" added!`)
                this.setState({ editedShow: {}, addNewShow: false }, () => this.fetchData(this.state.currentPage))
            })
            .catch(err => {
                toast.error('Add new category failed!')
                console.log(err);
                this.hideLoader()
            })
    }

    onFeaturedImageChange = (event) => {
        // console.log("Featured image func triggered")
        this.setState({ readFeaturedImg: undefined, featuredImg: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            let editedShow = this.state.editedShow
            editedShow.dirty = true
            this.setState({ featuredImg: event.target.files[0], editedShow: editedShow })
            reader.onload = (e) => {
                this.setState({ readFeaturedImg: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onBannerImageChange = (event) => {
        // console.log("Banner image func triggered")
        this.setState({ readBannerImg: undefined, bannerImg: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            let editedShow = this.state.editedShow
            editedShow.dirty = true
            this.setState({ bannerImg: event.target.files[0], editedShow: editedShow })
            reader.onload = (e) => {
                this.setState({ readBannerImg: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    // componentDidUpdate(prevState){
    //     if (prevState !== this.state){
    //         console.log(this.state)
    //     }
    // }

    cancelEditing = () => {
        this.setState({ editedShow: {}, uniqueSlug: "" })
    }

    render() {
        const { shows, editedShow } = this.state;
        const numberStyle = {
            width: "40px"
        }
        const imgHash = Date.now();
        const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>
        return (
            <Container>
                <ToastContainer position="top-right" />
                <Row>
                    <Col>
                        <h1>Channel List ({this.state.totalCategory})</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>(Double click on a row to edit)</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {!this.state.addNewShow ? <Button variant="outline-success" title="Add New Channel" onClick={this.addShowHandler}><Icons.Plus /></Button> : null} &nbsp;
                            <Button variant="outline-info" title="Refresh List" onClick={this.updateData}><Icons.ArrowClockwise /></Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Featured&nbsp;Image</th>
                                            <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Banner&nbsp;Image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                            <th>Description</th>
                                            <th>Short Description</th>
                                            <th>Weight</th>
                                            <th>Sequence</th>
                                            <th>Short URL</th>
                                            <th>Deep URL</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.isLoading ?
                                            shows.map((show, index) =>

                                                this.state.uniqueSlug === show.uniqueSlug ?
                                                    <tr key={index} style={{ backgroundColor: "#ededed" }}>


                                                        <td>{index + 1}</td>
                                                        <td><input type="text" name="title" value={editedShow.title} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td align="center">{this.state.featuredImg ? <Figure><Figure.Image src={this.state.readFeaturedImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.featured_image}?${imgHash}`} />}<label htmlFor="image-change1" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change1" onChange={this.onFeaturedImageChange} style={{ display: "none" }} /></td>
                                                        <td align="center">{this.state.bannerImg ? <Figure><Figure.Image src={this.state.readBannerImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.banner_image}?${imgHash}`} />}<label htmlFor="image-change2" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change2" onChange={this.onBannerImageChange} style={{ display: "none" }} /></td>
                                                        <td><textarea value={editedShow.description} name="description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                                                        <td><textarea value={editedShow.short_description} name="short_description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                                                        <td><input type="number" name="weight" value={editedShow.weight} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td><input type="number" name="sequence" value={editedShow.sequence} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>                                                        
                                                        <td><input type="text" value={editedShow.short_url|| ""} name="short_url" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td><input type="text" value={editedShow.deep_url || ""} name="deep_url" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td>
                                                            {this.state.addNewShow && !show.uniqueSlug ? <div><Button variant="outline-success" onClick={this.addNewShowHandler}>Add</Button>&nbsp;<Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new category?")) this.cancelAddNewShow() }}>Cancel</Button></div> : <div><Button variant="outline-info" onClick={this.updateShowHandler}>Update</Button>&nbsp;<Button variant="outline-warning" onClick={() => { if (window.confirm("Do you wish to cancel editing category? changes will be lost!")) this.cancelEditing() }}>Cancel</Button></div>}
                                                        </td>
                                                    </tr>
                                                    :
                                                    <tr key={index} onDoubleClick={this.toggleEdit.bind(this, show.uniqueSlug, show)}>
                                                        <td>{index + 1}</td>
                                                        {this.state.uniqueSlug === show.uniqueSlug ? <td><input type="text" name="title" value={show.title ? show.title : ""} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td> : <td><input type="text" value={show.title} disabled ></input></td>}
                                                        <td align="center">{show.featuredImageUrl ? <Image src={`${show.featuredImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>
                                                        <td align="center">{show.bannerImageUrl ? <Image src={`${show.bannerImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>                                                        
                                                        <td><textarea value={show.description ? show.description : ""} disabled ></textarea></td>
                                                        <td><textarea value={show.shortDescription ? show.shortDescription : ""} disabled></textarea></td>
                                                        <td><input type="number" value={show.weight ? show.weight : ""} style={numberStyle} disabled></input></td>
                                                        <td><input type="number" value={show.sequence ? show.sequence : ""} min="1" disabled style={numberStyle} ></input></td>
                                                        <td><input type="text" value={show.shortUrl ? show.shortUrl : ""} disabled></input></td>
                                                        <td><input type="url" value={show.deepUrl? show.deepUrl: ""} disabled></input></td>                                                    
                                                        <td>
                                                            {this.state.addNewShow && !show.uniqueSlug ? <Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new show?")) this.cancelAddNewShow() }}>Cancel</Button> : <Button variant="outline-danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete show "${show.title}"?`)) this.deleteShowHandler(show.uniqueSlug, show.title) }}>Delete</Button>}
                                                        </td>


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
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ChannelSheet;