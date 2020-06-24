import React, { Component } from 'react';
import { Table, Image, Button, Alert, Figure, Row, Col, Container } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import update from 'immutability-helper';
import * as Icons from 'react-bootstrap-icons'

import { getAllShow, baseURL, removeShow } from '../../../services/serviceShows';
import { getAllChannel } from '../../../services/serviceChannels';
import { getAllCategory } from '../../../services/serviceCategories';
import { getAllBadge } from '../../../services/serviceBadges';
import { getAllArtist } from '../../../services/serviceArtists';
import axios from 'axios';
import auth from '../../../services/authentication';


class SheetUpload extends Component {

    state = {
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

    hideLoader = () => {
        this.setState({ isLoading: false });
    }

    showLoader = () => {
        this.setState({ isLoading: true });
    }

    fetchData = async () => {
        this.showLoader();
        await getAllShow().then(response => {
            // console.log(response.data.results)
            localStorage.setItem("shows", JSON.stringify(response.data.results))
            this.setState({ shows: JSON.parse(localStorage.getItem('shows')) })
            this.hideLoader();
        })
            .catch(error => {
                alert(error)
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
        getAllChannel()
            .then(response => {
                this.setState({ channels: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });

        getAllCategory()
            .then(response => {
                this.setState({ categories: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });
        getAllBadge()
            .then(response => {
                this.setState({ badges: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });

        getAllArtist()
            .then(response => {
                this.setState(() => {
                    return { artists: response.data.results, isLoading: false }
                })
            })
            .catch(error => {
                console.log(error)
            });
        let shows = localStorage.getItem("shows")
        if (shows) {
            this.setState({ shows: JSON.parse(shows) })
            return
        }
        else {
            this.fetchData()
        }
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
                    channel: { title: show.channel.title, channel_slug: show.channel.uniqueSlug },
                    artist: { name: show.artist.name, artist_slug: show.artist.uniqueSlug },
                    category: { name: show.category.name, category_slug: show.category.uniqueSlug },
                    deep_link: show.deepLink,
                    show_notes: show.showNotes,
                    season: show.season,
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
                    channel: { title: show.channel.title, channel_slug: show.channel.uniqueSlug },
                    artist: { name: show.artist.name, artist_slug: show.artist.uniqueSlug },
                    category: { name: show.category.name, category_slug: show.category.uniqueSlug },
                    deep_link: show.deepLink,
                    show_notes: show.showNotes,
                    season: show.season,
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
        if(this.state.featuredImg) formData.append('featured_image', this.state.featuredImg)
        if(this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
        for (let [key, value] of Object.entries(data)) {
            switch (key) {
                case 'category':
                case 'channel':
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
                alert(`Show "${this.state.editedShow.title}" updated, please update the list to see latest changes!`)
                this.setState({ editedShow: {} }, () => window.location.reload(false))
            })
            .catch(err => {
                alert('Something went wrong, try again in some time!')
                this.hideLoader()
            })
    }

    deleteShowHandler = (slug, show) => {
        this.showLoader()
        removeShow(slug)
            .then(() => {
                alert(`Show "${show}" deleted successfully!`)
                this.hideLoader()
            })
            .catch(err => {
                console.log("Show delete error: ", err)
                alert(`Show "${show}" delete unsuccessful, please try again later!`)
                this.hideLoader()
            })
    }

    updateData = async () => {
        this.showLoader();
        await getAllShow().then(response => {
            // console.log(response.data.results)
            localStorage.setItem("shows", JSON.stringify(response.data.results))
            this.setState({ shows: JSON.parse(localStorage.getItem('shows')) })
            this.hideLoader();
        })
            .catch(error => {
                alert(error)
                this.hideLoader();
            });
    }

    addShowHandler = () => {
        let prevShows = this.state.shows
        prevShows.unshift({
            title: "Enter title",
            description: "Enter description",
            short_description: "Enter short desc",
            weight: 0,
            featured_image: "",
            banner_image: "",
            short_url: "Enter short URL",
            sequence: 0,
            channel: { title: "Select Channel", channel_slug: "" },
            artist: { name: "Select Artist", artist_slug: "" },
            category: { name: "Select Category", category_slug: "" },
            deep_link: "Enter link",
            show_notes: "",
            season: "Select Season",
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
        if(this.state.featuredImg) formData.append('featured_image', this.state.featuredImg)
        if(this.state.bannerImg) formData.append('banner_image', this.state.bannerImg)
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
            url: `${baseURL}/shows/`,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            auth: auth,
            data: formData
        })
            .then(() => {
                alert(`New show "${this.state.editedShow.title}" added, please update the list to see latest changes!`)
                this.setState({ editedShow: {} }, () => window.location.reload(false))
            })
            .catch(err => {
                alert('Something went wrong, try again in some time!')
                this.hideLoader()
            })
    }

    onFeaturedImageChange = (event) => {
        // console.log("Featured image func triggered")
        this.setState({ readFeaturedImg: undefined, featuredImg: undefined})
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
        this.setState({readBannerImg: undefined, bannerImg: undefined })
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

    render() {
        const { shows, editedShow, channels, categories, badges, artists } = this.state;
        const numberStyle = {
            width: "40px"
        }
        const imgHash = Date.now();

        return (
            <div>
                {
                    this.state.isLoading ? <Loader type="ThreeDots" color="#eb1163" height={100} width={50} /> :
                        <Container>
                            <h1>Shows:</h1>
                            <p>(Double click on a row to edit)</p>

                            <Row>
                            <Col>
                            {!this.state.addNewShow ?<Button variant="outline-success" title="Add New Show" onClick={this.addShowHandler}><Icons.Plus/></Button> : null} &nbsp;
                            <Button variant="outline-info" title="Refresh List" onClick={this.updateData}><Icons.ArrowClockwise/></Button>
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
                                        <th>Channel</th>
                                        <th>Artist</th>
                                        <th>Deep Link</th>
                                        <th>Show Notes</th>
                                        <th>Season</th>
                                        <th>Source</th>
                                        <th>Language</th>
                                        <th>Category</th>
                                        <th>Badge</th>
                                        <th>Episodes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        shows.map((show, index) =>

                                            this.state.uniqueSlug === show.uniqueSlug ?
                                                <tr key={index} style={{ backgroundColor: "#ededed" }}>


                                                    <td>{index + 1}</td>
                                                    <td><input type="text" name="title" value={editedShow.title} autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                    <td><input type="number" name="weight" value={editedShow.weight} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                                                    <td align="center">{this.state.featuredImg? <Figure><Figure.Image src={this.state.readFeaturedImg} thumbnail /></Figure>: <Image thumbnail src={`${editedShow.featured_image}?${imgHash}`}/>}<label for="image-change1" title="Change Image"><Icons.Upload/></label><input type="file" id="image-change1" onChange={this.onFeaturedImageChange} style={{display:"none"}}/></td>
                                                    <td align="center">{this.state.bannerImg?  <Figure><Figure.Image src={this.state.readBannerImg} thumbnail /></Figure>: <Image thumbnail src={`${editedShow.banner_image}?${imgHash}`}/>}<label for="image-change2" title="Change Image"><Icons.Upload/></label><input type="file" id="image-change2" onChange={this.onBannerImageChange} style={{display:"none"}}/></td>
                                                    <td><textarea value={editedShow.short_description} name="short_description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                                                    <td><textarea value={editedShow.description} name="description" onChange={this.editShowHandler.bind(this)}></textarea></td>
                                                    <td><input type="text" value={editedShow.short_url} name="short_url" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                    <td><input type="text" value={show.publishedOn} disabled></input></td>
                                                    <td><input type="number" name="sequence" value={editedShow.sequence} min="1" autoComplete="off" style={numberStyle} onChange={this.editShowHandler.bind(this)}></input></td>
                                                    <td>
                                                        <select name="channel_slug" onChange={this.editShowHandler}>
                                                            <option>{editedShow.channel.title}</option>
                                                            {
                                                                channels.map((channel, index) =>
                                                                    <option key={index} value={channel.uniqueSlug}>{channel.title}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </td>
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
                                                    <td>
                                                        <select name="season" onChange={this.editShowHandler}>
                                                            <option>{editedShow.season}</option>
                                                            <option value="Season 1">Season 1</option>
                                                            <option value="Season 2">Season 2</option>
                                                            <option value="Season 3">Season 3</option>
                                                            <option value="Season 4">Season 4</option>
                                                            <option value="Season 5">Season 5</option>
                                                            <option value="Season 6">Season 6</option>
                                                            <option value="Season 7">Season 7</option>
                                                            <option value="Season 8">Season 8</option>
                                                            <option value="Season 9">Season 9</option>
                                                        </select>
                                                    </td>
                                                    <td><input type="text" value={editedShow.source} name="source" autoComplete="off" onChange={this.editShowHandler.bind(this)}></input></td>
                                                    <td>
                                                        <select name="language" onChange={this.editShowHandler.bind(this)}>
                                                            <option>{editedShow.language}</option>
                                                            <option value="En">En</option>
                                                            <option value="Hi">Hi</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select name="category_slug" onChange={this.editShowHandler.bind(this)}>
                                                            <option>{editedShow.category.name}</option>
                                                            {
                                                                categories.map((categories, index) =>
                                                                    <option key={index} value={categories.uniqueSlug}>{categories.name}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </td>
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
                                                    <td>
                                                        <select disabled>
                                                            <option>{show.channel ? show.channel.title : ""}</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select disabled>
                                                            <option>{show.artist ? show.artist.name : ""}</option>
                                                        </select>
                                                    </td>
                                                    <td><input type="text" value={show.deepLink ? show.deepLink : ""} disabled></input></td>
                                                    <td><textarea value={show.showNotes ? show.showNotes : ""} disabled></textarea></td>
                                                    <td>
                                                        <select disabled>
                                                            <option>{show.season ? show.season : ""}</option>
                                                        </select>
                                                    </td>
                                                    <td><input type="text" value={show.source ? show.source : ""} disabled ></input></td>
                                                    <td>
                                                        <select disabled>
                                                            <option>{show.language ? show.language : ""}</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select disabled>
                                                            <option>{show.category ? show.category.name : ""}</option>
                                                        </select>
                                                    </td>
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
                                    }
                                </tbody>
                            </Table>
                            </Col>
                            </Row>
                        </Container>
                }
            </div>
        );
    }
}

export default SheetUpload;