import React, { Component } from 'react';
import { Button, Form, Col, Figure } from 'react-bootstrap';
import { getShow } from '../../../services/serviceShows';
import { getAllChannel } from '../../../services/serviceChannels';
import { getAllCategory } from '../../../services/serviceCategories';
import { getAllBadge } from '../../../services/serviceBadges';
import { getAllArtist, baseURL } from '../../../services/serviceArtists';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import auth from '../../../services/authentication';

class EditShow extends Component {
    state = {
        bannerImageView: undefined,
        featuredImageView: undefined,
        channels: [],
        categories: [],
        badges: [],
        artists: [],
        show_slug: "",
        isLoading: true
    }

    UNSAFE_componentWillMount = () => { //Triggeres first
        // console.log("will mount triggered")
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let unique = params.get('unique');
        this.setState({ show_slug: unique })
    }

    componentDidMount = async () => {
        // this.setState(() => {
        //     return { isLoading: true }
        // })
        await getShow(this.state.show_slug)
            .then(res => {
                if (res.status === 200) {
                    console.log("Response form API: ", res.data)
                    for (let [key, value] of Object.entries(res.data)) {
                        switch (key) {
                            case 'artist':
                            case 'category':
                            case 'badge':
                                if(value) this.setState({ [`${key}_slug`]: value.uniqueSlug, [`${key}_name`]: value.name })
                                break;
                            case 'channel':
                                this.setState({ [`${key}_slug`]: value.uniqueSlug, [`${key}_name`]: value.title })
                                break;
                            case 'bannerImageUrl':
                                this.setState({ 'banner_image': value })
                                break;
                            case 'featuredImageUrl':
                                this.setState({ 'featured_image': value })
                                break;
                            case 'deepLink':
                                this.setState({ 'deep_link': value })
                                break;
                            case 'shortDescription':
                                this.setState({ 'short_description': value })
                                break;
                            case 'shortUrl':
                                this.setState({ 'short_url': value })
                                break;
                            case 'bannerImageName':
                            case 'featuredImageName':
                            case 'isActive':
                            case 'showNotes':
                            case 'showSlug':
                            case 'source':
                            case 'state':
                            case 'show_slug':
                            case 'uniqueSlug':
                            case 'publishedOn':
                            case 'episodes':
                                break;
                            default:
                                this.setState({ [key]: value })
                        }
                    }
                    // console.log("Show: ", this.state.editedShow)
                }
            })
            .catch(res => {
                console.log(res);
                this.setState({ isLoading: false })
            })

        // console.log("State after for: ", this.state)
        await getAllChannel()
            .then(response => {
                this.setState({ channels: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });

        await getAllCategory()
            .then(response => {
                this.setState({ categories: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });
        await getAllBadge()
            .then(response => {
                this.setState({ badges: response.data.results })
            })
            .catch(error => {
                console.log(error)
            });

        await getAllArtist()
            .then(response => {
                this.setState(() => {
                    return { artists: response.data.results, isLoading: false}
                })
            })
            .catch(error => {
                console.log(error)
            });
        // console.log("STate after all API: ", this.state)
    }


    changeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        // console.log("edited show: ", this.state)
    }

    updateHandler = (e) => {
        e.preventDefault()
        // this.handleClose()
        console.log("data: ", this.state)
        this.setState({isLoading: true})
    let formData = new FormData();
    if(this.state.featured_image_new) formData.append("featured_image", this.state.featured_image_new)
    if(this.state.banner_image_new) formData.append("banner_image", this.state.banner_image_new)
        
    for (let [key, value] of Object.entries(this.state)) {
      switch(key){
        case 'weight':
        case 'sequence':
          formData.append(`${key}`, parseInt(value))
          break;
        case 'banner_image':
        case 'featured_image':
        case 'banner_image_new':
        case 'featured_image_new':
        case 'bannerImageView':
        case 'featuredImageView':
        case 'isLoading':
        case 'artists':
        case 'badges':
        case 'categories':
        case 'channels':
        case 'show_slug':    
          break;
        default:
          formData.append(`${key}`, value)
      }
    }

    axios({
      url: `${baseURL}/shows/${this.state.show_slug}/`,
      method: "PATCH",
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData,
      auth: auth
    })
      .then(response => {
        if(response.status === 200){
          alert(`Show ${response.data.title} updated successfully!`)
          this.setState({isLoading: true})
          window.location.reload(false);
        }
        if(response.status === 400){
          alert('Something went wrong, please try again')
          this.setState({isLoading: false})
        }
      })
      .catch(error => {
        console.log(error)
        alert('Something went wrong, please try again')
          this.setState({isLoading: false})
      })
    }

    onFeaturedImageChange = (event) => {
        this.setState({ featuredImageView: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            this.setState({ featured_image_new: event.target.files[0] })
            reader.onload = (e) => {
                this.setState({ featuredImageView: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onBannerImageChange = (event) => {
        this.setState({ bannerImageView: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            this.setState({ banner_image_new: event.target.files[0] })
            reader.onload = (e) => {
                this.setState({ bannerImageView: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    // displayValue(identifier){
    //     let object = {};
    //     let value = "";
    //     switch(identifier){
    //         case 'artist':
    //             console.log(this.state.artists)
    //             object = this.state.artists.find(element => element.artist_slug === this.state.artist_slug)
    //             console.log(object)
    //             value = object.name
    //             break;
    //         case 'channel':
    //             object = this.state.channels.find(element => element.channel_slug === this.state.channel_slug)
    //             value = object.title
    //             break;
    //         case 'category':
    //             object = this.state.categories.find(element => element.category_slug === this.state.category_slug)
    //             value = object.name
    //             break;
    //         default:
    //             object = null
    //     }

    //     return value 
    // }
    render() {
        const { channels, categories, badges, artists } = this.state
        return (
            <div>
                {!this.state.isLoading ?
                    <Form onSubmit={this.updateHandler}>
                        <Form.Group>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Title: </Form.Label>
                                    <Form.Control type="text" placeholder="Enter Title here" name="title" value={this.state.title} onChange={this.changeHandler} />
                                </Col>
                                <Col>
                                    <Form.Label>Artist: </Form.Label>
                                    <Form.Control as="select" name="artist_slug" onChange={this.changeHandler}>
                                        <option defaultValue value={this.state.artist_slug ? this.state.artist_slug : null}>{this.state.artist_slug ? this.state.artist_name : "No artist selected"}</option>
                                        {
                                            artists.map((artists, index) =>
                                                <option key={index} value={artists.uniqueSlug}>{artists.name}</option>
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Row>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description: </Form.Label>
                                <Form.Control as="textarea" rows="4" placeholder="Enter show description here" name="description" value={this.state.description} onChange={this.changeHandler} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Short Description: </Form.Label>
                                <Form.Control as="textarea" rows="2" placeholder="Short Description here" name="short_description" value={this.state.short_description} onChange={this.changeHandler} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Deep Link URL: </Form.Label>
                                <Form.Control type="url" placeholder="Deep link URL" name="deep_link" value={this.state.deep_link} onChange={this.changeHandler} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Row>
                                    <Col>
                                        <Form.Label>Weight: </Form.Label>
                                        <Form.Control type="number" placeholder="Weight" name="weight" value={this.state.weight} onChange={this.changeHandler} />
                                    </Col>
                                    <Col>
                                        <Form.Label>Short URL: </Form.Label>
                                        <Form.Control type="text" placeholder="Short Url" name="short_url" value={this.state.short_url} onChange={this.changeHandler} />
                                    </Col>
                                    <Col>
                                        <Form.Label>Season: </Form.Label> <br></br>
                                        <Form.Control as="select" name="season" onChange={this.changeHandler}>
                                            <option defaultValue value={this.state.season ? this.state.season : null}>{this.state.season ? this.state.season : "No season selected"}</option>
                                            <option value="Season 1">Season 1</option>
                                            <option value="Season 2">Season 2</option>
                                            <option value="Season 3">Season 3</option>
                                            <option value="Season 4">Season 4</option>
                                            <option value="Season 5">Season 5</option>
                                            <option value="Season 6">Season 6</option>
                                            <option value="Season 7">Season 7</option>
                                            <option value="Season 8">Season 8</option>
                                            <option value="Season 9">Season 9</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Row>
                                <Col>
                                    <Form.Label>Current Banner Image: </Form.Label><br></br>
                                    <Figure>
                                        {this.state.banner_image ? <Figure.Image thumbnail src={this.state.banner_image} width={171} height={180} /> : <p>No banner image found</p>}
                                    </Figure>
                                </Col>
                                <Col>
                                    <Form.Label>New Banner Image: </Form.Label><br></br>
                                    {this.state.bannerImageView ?
                                        <Figure>
                                            <Figure.Image src={this.state.bannerImageView} thumbnail width={171} height={180} />
                                        </Figure> : <p>No image selected</p>}
                                    <Form.Control type="file" name="banner_image" onChange={this.onBannerImageChange} />
                                </Col>
                            </Form.Row>

                            <Form.Row>
                                <Col>
                                    <Form.Label>Current Featured Image: </Form.Label><br></br>
                                    <Figure>
                                        {this.state.featured_image ? <Figure.Image thumbnail src={this.state.featured_image} width={171} height={180} /> : <p>No feature image found</p>}
                                    </Figure>
                                </Col>
                                <Col>
                                    <Form.Label>New Featured Image:</Form.Label><br></br>
                                    {this.state.featuredImageView ?
                                        <Figure>
                                            <Figure.Image src={this.state.featuredImageView} thumbnail width={171} height={180} />
                                        </Figure> : <p>No image selected</p>}
                                    <Form.Control type="file" name="featured_image" onChange={this.onFeaturedImageChange} />
                                </Col>
                            </Form.Row>

                            <Form.Row>
                                <Col>
                                    <Form.Label>Channel: </Form.Label> <br></br>
                                    <Form.Control as="select" name="channel_slug" onChange={this.changeHandler}>
                                        <option defaultValue value={this.state.channel_slug ? this.state.channel_slug : null}>{this.state.channel_slug ? this.state.channel_name : "No channel selected"}</option>
                                        {
                                            channels.map((channel, index) =>
                                                <option key={index} value={channel.uniqueSlug}>{channel.title}</option>
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label>Category: </Form.Label>
                                    <br></br>
                                    <Form.Control as="select" name="category_slug" onChange={this.changeHandler}>
                                        <option defaultValue value={this.state.category_slug ? this.state.category_slug : null}>{this.state.category_slug ? this.state.category_name : 'No category selected'}</option>
                                        {
                                            categories.map((categories, index) =>
                                                <option key={index} value={categories.uniqueSlug}>{categories.name}</option>
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    <Form.Label>Sequence: </Form.Label>
                                    <Form.Control type="number" placeholder="sequence" name="sequence" value={this.state.sequence} onChange={this.changeHandler} />
                                </Col>
                                <Col>
                                    <Form.Label>Badge: </Form.Label>
                                    <Form.Control as="select" name="badge_slug" onChange={this.changeHandler}>
                                        <option defaultValue value={this.state.badge_slug ? this.state.badge_slug : null}>{this.state.badge_slug ? this.state.badge_name : 'No badge selected'}</option>
                                        {
                                            badges.map((badges, index) =>
                                                <option key={index} value={badges.uniqueSlug}>{badges.name}</option>
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Row>

                            <Form.Label>Launguage: </Form.Label>
                            <Form.Control as="select" name="language" value={this.state.language} onChange={this.changeHandler}>
                                    <option defaultValue value={this.state.language? this.state.language: null}>{this.state.language? this.state.language: "No language selected"}</option>
                                    <option value="En">English</option>
                                    <option value="Hi">Hindi</option>
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="info">Update</Button>
                    </Form>
                    : <Loader type="ThreeDots" color="#eb1163" height={100} width={50}/>}
            </div>
        );
    }
}

export default EditShow;