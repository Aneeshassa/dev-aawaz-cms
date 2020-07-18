import React, { Component } from 'react';
import { Table, Image, Button, Alert, Figure, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentLoader from "react-content-loader"

import update from 'immutability-helper';
import * as Icons from 'react-bootstrap-icons'

import { baseURL, removeShow, getAllShow } from '../../../services/serviceShows';
import { getChannelDropdown } from '../../../services/serviceChannels';
import { getCategoryDropDowns } from '../../../services/serviceCategories';
import { getBadgeDropDown } from '../../../services/serviceBadges';
import { getArtistDropDown } from '../../../services/serviceArtists';
import axios from 'axios';
import auth from '../../../services/authentication';
import Select from 'react-select';

class SheetUpload extends Component {

    state = {
        totalShow: 0,
        shows: [],
        editedShow: {},
        readFeaturedImg: undefined,
        readBannerImg: undefined,
        featuredImg: undefined,
        bannerImg: undefined,
        channels: [],
        categories: [],
        badges: [],
        artists: [],
        isLoading: false,
        addNewShow: false,
        uniqueSlug: "",
        title: ""
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

    hideLoader = () => {
        this.setState({ isLoading: false });
    }

    showLoader = () => {
        this.setState({ isLoading: true });
    }

    fetchShowData = async () => {
        this.showLoader();
        await getAllShow().then(response => {
            this.setState({ shows: response.data, totalShow: response.data.length })
            this.hideLoader();
        })
            .catch(error => {
                toast.error("Show fetch failed!")
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

    componentDidMount = async () => {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        await this.fetchShowData(this.state.currentPage)
        getChannelDropdown()
            .then(response => {
                let newOptions = []
                let channels = response.data

                channels.forEach(data => {
                    newOptions.push({ value: data.uniqueSlug, label: data.title })
                })
                this.setState({ channels: newOptions })
            })
            .catch(error => {
                toast.error("Channel fetch failed")
                console.log(error)
            });

        getCategoryDropDowns()
            .then(response => {
                let newOptions = []
                let categories = response.data

                categories.forEach(data => {
                    newOptions.push({ value: data.uniqueSlug, label: data.name })
                })
                this.setState({ categories: newOptions })
            })
            .catch(error => {
                toast.error("Category fetch failed")
                console.log(error)
            });
        getBadgeDropDown()
            .then(response => {
                this.setState({ badges: response.data })
            })
            .catch(error => {
                toast.error("Badge fetch failed")
                console.log(error)
            });

        getArtistDropDown()
            .then(response => {
                this.setState(() => {
                    return { artists: response.data, isLoading: false }
                })
            })
            .catch(error => {
                toast.error("Artist fetch failed")
                console.log(error)
            });
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    toggleEdit = (slug, show) => {
        // console.log(event.target.name)
        if (this.state.editedShow.dirty && window.confirm(`There are unsaved values in current show "${this.state.editedShow.title}", Do you want to proceed without saving? updated values will be lost!`)) {
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
                    weight: show.weight,
                    featured_image: show.featuredImageUrl,
                    banner_image: show.bannerImageUrl,
                    short_url: show.shortUrl,
                    sequence: show.sequence,
                    channel_slug: this.addDefaultContent(show.channels),
                    artist: { name: show.artist.name, artist_slug: show.artist.uniqueSlug },
                    category_slug: this.addDefaultContent(show.categories),
                    deep_link: show.deepLink,
                    show_notes: show.showNotes,
                    episodes: show.episodes.length,
                    source: show.source,
                    language: show.language,
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
                    title: show.title,
                    description: show.description,
                    short_description: show.shortDescription,
                    weight: show.weight,
                    featured_image: show.featuredImageUrl,
                    banner_image: show.bannerImageUrl,
                    short_url: show.shortUrl,
                    sequence: show.sequence,
                    channel_slug: this.addDefaultContent(show.channels),
                    artist: { name: show.artist.name, artist_slug: show.artist.uniqueSlug },
                    category_slug: this.addDefaultContent(show.categories),
                    deep_link: show.deepLink,
                    show_notes: show.showNotes,
                    episodes: show.episodes.length,
                    source: show.source,
                    language: show.language,
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
        if (this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'category_slug':
                    formData.append(`${key}`, this.contentSlugApiHandler(key))
                    break
                case 'channel_slug':
                    formData.append(`${key}`, this.contentSlugApiHandler(key))
                    break
                case 'artist':
                case 'dirty':
                case 'featured_image':
                case 'banner_image':
                case 'show_slug':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }

        axios({
            method: "PATCH",
            url: `${baseURL}/shows/${this.state.editedShow.show_slug}/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                toast.success(`Show "${this.state.editedShow.title}" updated sucessfully!`)
                this.setState({ editedShow: {}, uniqueSlug: "" }, () => this.fetchShowData(this.state.currentPage))
            })
            .catch(err => {
                toast.error('Show update failed!')
                console.log(err)
                this.hideLoader()
            })
    }

    deleteShowHandler = (slug, show) => {
        this.showLoader()
        removeShow(slug)
            .then((response) => {
                if (response.status === 204) {
                    toast.success(`Show ${show} deleted successfully.`);
                    if (this.state.next === null && this.state.shows.length < 2 && this.state.currentPage !== 1) {
                        this.setState({ currentPage: this.state.currentPage - 1 }, () => this.fetchShowData(this.state.currentPage))
                    }
                    else {
                        this.fetchShowData(this.state.currentPage)
                    }
                }
            })
            .catch(err => {
                console.log(err)
                toast.error(`Show "${show}" delete unsuccessful!`)
                this.hideLoader()
            })
    }

    updateData = async () => {
        this.fetchShowData(this.state.currentPage)
    }

    addShowHandler = () => {
        let prevShows = this.state.shows
        prevShows.unshift({
            title: "Enter title",
            description: "Enter description",
            short_description: "Enter short desc",
            weight: 1,
            featured_image: "",
            banner_image: "",
            short_url: "Enter short URL",
            sequence: 1,
            channel_slug: [],
            channels: [],
            artist: { name: "Select Artist", artist_slug: "" },
            category_slug: [],
            categories:[],
            deep_link: "Enter link",
            show_notes: "",
            episodes: [],
            source: "",
            language: "Select Language",
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
        if (this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'dirty':
                case 'featured_image':
                case 'banner_image':
                    break;
                case 'channel_slug':
                    formData.append(`${key}`, this.contentSlugApiHandler(key))
                    break
                 case 'category_slug':
                    formData.append(`${key}`, this.contentSlugApiHandler(key))
                    break
                default:
                    formData.append(`${key}`, value)
            }
        }

        axios({
            method: "POST",
            url: `${baseURL}/shows/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then((res) => {
                toast.success(`New show "${this.state.editedShow.title}" added!`)
                // let shows = this.state.shows
                // let newShows = shows.push(res.data)
                this.setState({ editedShow: {}, uniqueSlug: ""}, () => {
                    this.toggleAddNewShow();
                    // this.hideLoader()
                    this.fetchShowData(this.state.currentPage)
                })
            })
            .catch(err => {
                toast.error('Add new show failed!')
                console.log(err)
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

    selectHandler = (value, event) => {
        // console.log("event: ", event)
        let newEditedSection;
        let prevEditedSection = this.state.editedShow
        prevEditedSection.dirty = true;
        event.name === "channel_slug"? newEditedSection = update(prevEditedSection, { channel_slug: { $set: value } }):
        newEditedSection = update(prevEditedSection, { category_slug: { $set: value } })
        this.setState({ editedShow: newEditedSection })
    }

    contentSlugApiHandler = (contentKey) => {
        let array = []
        switch(contentKey){
            case "category_slug":
                array = this.state.editedShow.category_slug
                break
            default:
                array = this.state.editedShow.channel_slug
        }
        let contentSlug = array.map(data => {
            return data.value
          })
        let content_slug = contentSlug.join()
        return content_slug
    }

    render() {
        const { shows, editedShow, badges, artists } = this.state;
        const numberStyle = {
            width: "40px"
        }
        const imgHash = Date.now();
        const loader = <ContentLoader backgroundColor="#c2c2c2"><rect x="0" y="56" rx="3" ry="3" width="150" height="4" /><rect x="0" y="72" rx="3" ry="3" width="100" height="4" /></ContentLoader>
        const tableData = (
            shows.map((show, index) =>
                this.state.uniqueSlug === show.uniqueSlug ?
                    <tr key={index} style={{ backgroundColor: "#ededed" }}>


                        <td>{index + 1}</td>
                        <td><input type="text" name="title" value={editedShow.title} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                        <td><input type="number" name="weight" value={editedShow.weight} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                        <td align="center">{this.state.featuredImg ? <Figure><Figure.Image src={this.state.readFeaturedImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.featured_image}?${imgHash}`} />}<label htmlFor="image-change1" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change1" onChange={this.onFeaturedImageChange} style={{ display: "none" }} /></td>
                        <td align="center">{this.state.bannerImg ? <Figure><Figure.Image src={this.state.readBannerImg} thumbnail /></Figure> : <Image thumbnail src={`${editedShow.banner_image}?${imgHash}`} />}<label htmlFor="image-change2" title="Change Image"><Icons.Upload /></label><input type="file" id="image-change2" onChange={this.onBannerImageChange} style={{ display: "none" }} /></td>
                        <td><textarea value={editedShow.short_description} name="short_description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                        <td><textarea value={editedShow.description} name="description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                        <td><input type="text" value={editedShow.short_url} name="short_url" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                        <td><input type="text" value={show.publishedOn} disabled></input></td>
                        <td><input type="number" name="sequence" value={editedShow.sequence} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                        <td>{show.uniqueSlug ? <Select isMulti defaultValue={editedShow.channel_slug ? editedShow.channel_slug : null} styles={{ control: styles => ({ ...styles, width: 300 }) }} name="channel_slug" onChange={this.selectHandler} options={this.state.channels} />
                                                            : <Select isMulti defaultValue styles={{ control: styles => ({ ...styles, width: 300 }) }} name="channel_slug" onChange={this.selectHandler} options={this.state.channels} />}</td>
                        <td>
                            <select name="artist_slug" onChange={this.editShowHandler}>
                                <option defaultValue>{editedShow.artist.name}</option>
                                {artists.map((artists, index) =>
                                    <option key={index} value={artists.uniqueSlug}>{artists.name}</option>
                                )}
                            </select>
                        </td>
                        <td><input type="url" value={editedShow.deep_link} name="deep_link" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                        <td><textarea value={editedShow.show_notes} name="show_notes" onChange={this.editShowHandler.bind(this)}></textarea></td>
                        <td> {editedShow.episodes} </td>
                        <td><input type="text" value={editedShow.source} name="source" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                        <td>
                            <select name="language" onChange={this.editShowHandler.bind(this)}>
                                <option>{editedShow.language}</option>
                                <option value="En">En</option>
                                <option value="Hi">Hi</option>
                            </select>
                        </td>
                        <td>{show.uniqueSlug ? <Select isMulti defaultValue={editedShow.category_slug ? editedShow.category_slug : null} styles={{ control: styles => ({ ...styles, width: 300 }) }} name="category_slug" onChange={this.selectHandler} options={this.state.categories} />
                                                            : <Select isMulti defaultValue styles={{ control: styles => ({ ...styles, width: 300 }) }} name="category_slug" onChange={this.selectHandler} options={this.state.categories} />}</td>                        
                        <td>
                            <select name="badge_slug" onChange={this.editShowHandler.bind(this)}>
                                <option>{show.badge ? show.badge.name : "Select Badge"}</option>
                                {
                                    badges.map((badges, index) =>
                                        <option key={index} value={badges.uniqueSlug}>{badges.name}</option>
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            {this.state.addNewShow && !show.uniqueSlug ? <p>Please add show first</p> : <Alert.Link href={"/shows/edit-show-episode?unique=" + show.uniqueSlug}>Edit Episodes</Alert.Link>}
                        </td>
                        <td>
                            {this.state.addNewShow && !show.uniqueSlug ? <div><Button variant="outline-success" onClick={this.addNewShowHandler}>Add</Button> <Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new show?")) this.cancelAddNewShow() }}>Cancel</Button></div> : <Button variant="outline-info" onClick={this.updateShowHandler}>Update</Button>}
                        </td>
                    </tr>
                    :
                    <tr key={index} onDoubleClick={this.toggleEdit.bind(this, show.uniqueSlug, show)}>
                        <td>{index + 1}</td>
                        {this.state.uniqueSlug === show.uniqueSlug ? <td><input type="text" name="title" value={show.title ? show.title : ""} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td> : <td><input type="text" value={show.title} disabled ></input></td>}
                        <td><input type="number" value={show.weight ? show.weight : ""} style={numberStyle} disabled></input></td>
                        <td align="center">{show.featuredImageUrl ? <Image src={`${show.featuredImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>
                        <td align="center">{show.bannerImageUrl ? <Image src={`${show.bannerImageUrl}?${imgHash}`} thumbnail /> : <p>No Image</p>}</td>
                        <td><textarea value={show.shortDescription ? show.shortDescription : ""} disabled></textarea></td>
                        <td><textarea value={show.description ? show.description : ""} disabled ></textarea></td>
                        <td><input type="text" value={show.shortUrl ? show.shortUrl : ""} disabled></input></td>
                        <td><input type="text" value={show.publishedOn ? show.publishedOn : ""} disabled></input></td>
                        <td><input type="number" value={show.sequence ? show.sequence : ""} min="1" disabled style={numberStyle} ></input></td>
                        <td>{show.channels.length}</td>
                        <td>
                            <select disabled>
                                <option>{show.artist ? show.artist.name : ""}</option>
                            </select>
                        </td>
                        <td><input type="text" value={show.deepLink ? show.deepLink : ""} disabled></input></td>
                        <td><textarea value={show.showNotes ? show.showNotes : ""} disabled></textarea></td>
                        <td>
                            <p>{show.episodes.length}</p>
                        </td>
                        <td><input type="text" value={show.source ? show.source : ""} disabled ></input></td>
                        <td>
                            <select disabled>
                                <option>{show.language ? show.language : ""}</option>
                            </select>
                        </td>
                        <td>{show.categories.length}</td>
                        <td>
                            <select disabled>
                                <option>{show.badge ? show.badge.name : ""}</option>
                            </select>
                        </td>
                        <td>
                            {this.state.addNewShow && !show.uniqueSlug ? <p>Please add show first</p> : <Alert.Link href={"/shows/edit-show-episode?unique=" + show.uniqueSlug}>Edit Episodes</Alert.Link>}
                        </td>
                        <td>
                            {this.state.addNewShow && !show.uniqueSlug ? <Button variant="outline-danger" onClick={() => { if (window.confirm("Are you sure you wish to cancel adding new show?")) this.cancelAddNewShow() }}>Cancel</Button> : <Button variant="outline-danger" onClick={() => { if (window.confirm(`Are you sure you wish to delete show "${show.title}"?`)) this.deleteShowHandler(show.uniqueSlug, show.title) }}>Delete</Button>}
                        </td>


                    </tr>
            )
        )
        return (
            <div>
                <ToastContainer position="top-right" />
                <div>
                    <h1>Show list ({this.state.totalShow})</h1>
                    <p>(Double click on a row to edit)</p>

                    <Row>
                        <Col>
                            {!this.state.addNewShow ? <Button variant="outline-success" title="Add New Show" onClick={this.addShowHandler}><Icons.Plus /></Button> : null} &nbsp;
                            <Button variant="outline-info" title="Refresh List" onClick={this.updateData}><Icons.ArrowClockwise /></Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Weight</th>
                                        <th>Featured&nbsp;Image</th>
                                        <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Banner&nbsp;Image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                        <th>Short Description</th>
                                        <th>Description</th>
                                        <th>Short URL</th>
                                        <th>Published On</th>
                                        <th>Sequence</th>
                                        <th>Channels</th>
                                        <th>Artist</th>
                                        <th>Deep Link</th>
                                        <th>Show Notes</th>
                                        <th>Episodes</th>
                                        <th>Source</th>
                                        <th>Language</th>
                                        <th>Categories</th>
                                        <th>Badge</th>
                                        <th>Episodes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.isLoading ?
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
                                        :
                                        tableData
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default SheetUpload;