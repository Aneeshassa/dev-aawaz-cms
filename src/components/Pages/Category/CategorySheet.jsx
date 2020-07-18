import React, { Component } from 'react';
import { Table, Image, Button, Figure, Row, Col, Container } from 'react-bootstrap';
import ContentLoader from "react-content-loader"
import update from 'immutability-helper';
import * as Icons from 'react-bootstrap-icons'

import { baseURL, removeCategory, getAllCategory } from '../../../services/serviceCategories';
import axios from 'axios';
import auth from '../../../services/authentication';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChromePicker } from 'react-color'


class CategorySheet extends Component {

    state = {
        totalCategory: 0,
        shows: [],
        editedShow: {},
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
        await getAllCategory().then(response => {
            // console.log(response.data.results)
            // localStorage.setItem("shows", JSON.stringify(response.data.results))
            this.setState({ shows: response.data, totalCategory: response.data.length })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Error occured while category fetching data")
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
        this.fetchData()
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    toggleEdit = (slug, show) => {
        // console.log(event.target.name)
        if (this.state.editedShow.dirty && window.confirm(`There are unsaved values in current category "${this.state.editedShow.name}", Do you want to proceed without saving? updated values will be lost!`)) {
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
                    name: show.name,
                    weight: show.weight,
                    featured_image: show.featuredImageUrl,
                    icon_image: show.iconImageUrl,
                    backgroundColor: show.background_color || "#22194D",
                    short_url: show.shortUrl,
                    sequence: show.sequence,
                    show_slug: show.uniqueSlug,
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
                    name: show.name,
                    weight: show.weight,
                    featured_image: show.featuredImageUrl,
                    icon_image: show.iconImageUrl,
                    backgroundColor: show.backgroundColor || "#ffffff",
                    short_url: show.shortUrl,
                    sequence: show.sequence,
                    show_slug: show.uniqueSlug,
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
        if (this.state.bannerImg) formData.append('icon_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'dirty':
                case 'featured_image':
                case 'icon_image':
                case 'show_slug':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }

        axios({
            method: "PATCH",
            url: `${baseURL}/category/${this.state.editedShow.show_slug}/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                toast.success(`Category "${this.state.editedShow.name}" updated!`)
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
        removeCategory(slug)
            .then(() => {
                toast.success(`Category "${show}" deleted successfully!`)
                if (this.state.next === null && this.state.shows.length < 2 && this.state.currentPage !== 1) {
                    this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchData(this.state.currentPage))
                }
                else {
                    this.fetchData(this.state.currentPage)
                }
            })
            .catch(err => {
                console.log("Category delete error: ", err)
                toast.error(`Category "${show}" delete unsuccessful!`)
                this.hideLoader()
            })
    }

    updateData = async () => {
        this.fetchData(this.state.currentPage)
    }

    addShowHandler = () => {
        let prevShows = this.state.shows
        prevShows.unshift({
            name: "Enter name",
            weight: 1,
            featured_image: "",
            icon_image: "",
            short_url: "Enter short URL",
            sequence: 1,
            dirty: false
        })
        this.toggleAddNewShow();
        this.setState({ shows: prevShows, uniqueSlug: "" })
    }

    addNewShowHandler = () => {
        this.showLoader()
        let data = this.state.editedShow;
        let formData = new FormData();
        if (this.state.featuredImg) formData.append('featured_image', this.state.featuredImg)
        if (this.state.bannerImg) formData.append('icon_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'dirty':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }

        axios({
            method: "POST",
            url: `${baseURL}/category/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                toast.success(`New category "${this.state.editedShow.name}" added!`)
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

    colorPickerHandler = (color) => {
        // console.log(color.hex)
        let newSection = this.state.editedShow
        newSection.backgroundColor = color.hex
        newSection.dirty = true
        this.setState({ editedShow: newSection })
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
                        <h1>Category List ({shows.length})</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>(Double click on a row to edit)</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {!this.state.addNewShow ? <Button variant="outline-success" title="Add New Category" onClick={this.addShowHandler}><Icons.Plus /></Button> : null} &nbsp;
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
                                            <th>Name</th>
                                            <th>Weight</th>
                                            <th>Featured&nbsp;Image</th>
                                            <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Icon&nbsp;Image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                            <th>Color</th>
                                            <th>Short URL</th>
                                            <th>Sequence</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.isLoading ?
                                            shows.map((show, index) =>

                                                this.state.uniqueSlug === show.uniqueSlug ?
                                                    <tr key={index} style={{ backgroundColor: "#ededed" }}>


                                                        <td>{index + 1}</td>
                                                        <td><input type="text" name="name" value={editedShow.name} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td><input type="number" name="weight" value={editedShow.weight} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                                                        <td align="center">{this.state.featuredImg ? <Figure><Figure.Image src={this.state.readFeaturedImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.featured_image}?${imgHash}`} />}<label htmlFor="image-change1" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change1" onChange={this.onFeaturedImageChange} style={{ display: "none" }} /></td>
                                                        <td align="center">{this.state.bannerImg ? <Figure><Figure.Image src={this.state.readBannerImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.icon_image}?${imgHash}`} />}<label htmlFor="image-change2" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change2" onChange={this.onBannerImageChange} style={{ display: "none" }} /></td>
                                                        <td><td><ChromePicker color={editedShow.backgroundColor} onChange={this.colorPickerHandler.bind(this)} /></td></td>
                                                        <td><input type="text" value={editedShow.short_url} name="short_url" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>

                                                        <td><input type="number" name="sequence" value={editedShow.sequence} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>

                                                        <td>
                                                            {this.state.addNewShow && !show.uniqueSlug ? <div><Button variant="outline-success" onClick={this.addNewShowHandler}>Add</Button>&nbsp;<Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new category?")) this.cancelAddNewShow() }}>Cancel</Button></div> : <div><Button variant="outline-info" onClick={this.updateShowHandler}>Update</Button>&nbsp;<Button variant="outline-warning" onClick={() => { if (window.confirm("Do you wish to cancel editing category? changes will be lost!")) this.cancelEditing() }}>Cancel</Button></div>}
                                                        </td>
                                                    </tr>
                                                    :
                                                    <tr key={index} onDoubleClick={this.toggleEdit.bind(this, show.uniqueSlug, show)}>
                                                        <td>{index + 1}</td>
                                                        {this.state.uniqueSlug === show.uniqueSlug ? <td><input type="text" name="name" value={show.name ? show.name : ""} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td> : <td><input type="text" value={show.name} disabled ></input></td>}
                                                        <td><input type="number" value={show.weight ? show.weight : ""} style={numberStyle} disabled></input></td>
                                                        <td align="center">{show.featuredImageUrl ? <Image height={10} src={`${show.featuredImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>
                                                        <td align="center">{show.iconImageUrl ? <Image height={10} src={`${show.iconImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>
                                                        <td>
                                                            <svg width="20" height="20">
                                                                <rect width="20" height="20" style={{ fill: show.backgroundColor || "#ffffff", strokeWidth: 3, stroke: "rgb(0,0,0)" }} />
                                                            </svg>
                                                        </td>
                                                        <td><input type="text" value={show.shortUrl ? show.shortUrl : ""} disabled></input></td>

                                                        <td><input type="number" value={show.sequence ? show.sequence : ""} min="1" disabled style={numberStyle} ></input></td>


                                                        <td>
                                                            {this.state.addNewShow && !show.uniqueSlug ? <Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new show?")) this.cancelAddNewShow() }}>Cancel</Button> : <Button variant="outline-danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete show "${show.name}"?`)) this.deleteShowHandler(show.uniqueSlug, show.name) }}>Delete</Button>}
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

export default CategorySheet;