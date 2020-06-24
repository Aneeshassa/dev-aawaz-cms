import React, { Component } from 'react'
import axios from 'axios';
import { Form, Button, Figure } from 'react-bootstrap'
import { baseURL } from "../../../services/serviceBadges";
// import moment from 'moment';
import Loader from 'react-loader-spinner';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import auth from '../../../services/authentication';

class AddBadges extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            color: "",
            iconImageView: undefined,
            iconImageUrl: undefined,
        }
    }


    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onIconImageChange = (event) => {
        this.setState({ iconImageView: undefined, icon: undefined })
        if (event.target.files[0]) {
            let reader = new FileReader();
            this.setState({ icon: event.target.files[0] })
            reader.onload = (e) => {
                this.setState({ iconImageView: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    submitHandler = (e) => {
        e.preventDefault()
        // console.log(this.state)
        this.setState({ isLoading: true })
        let formData = new FormData();
        for (let [key, value] of Object.entries(this.state)) {
            switch (key) {
                case 'weight':
                case 'sequence':
                    formData.append(`${key}`, parseInt(value))
                    break;
                case 'iconImageView':
                    break;
                case 'featuredImageView':
                    break;
                default:
                    formData.append(`${key}`, value)
            }
        }
        for (var [key, value] of formData.entries()) {
            if (value === '' || value === undefined || value === {}) {
                this.setState({ isLoading: false })
                return toast.error(`${key} is required!`)
            }
            console.log(key + ': ' + value);
        }
        axios({
            url: `${baseURL}/badges/`,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData,
            auth: auth,
        })
            .then(response => {
                this.setState({ isLoading: true })
                if (response.status === 201) {
                    alert(`New badge ${response.data.name} is created successfully.`)                    
                    window.location.reload(false);
                }
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.status === 400) {                    
                    toast.error(JSON.stringify(error.response.data))
                    this.setState({ isLoading: false })
                }
                console.log(error)
            })

    }

    render() {
        const { name, color } = this.state
        return (
            <div>
                <ToastContainer
                    autoClose={5000}
                    hideProgressBar={false}
                    position="top-center" />

                <h2>Add New Badge</h2>
                <Form onSubmit={this.submitHandler}>
                    <Form.Group>
                        <Form.Label>Badge Name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter Badge Name here" name="name" value={name} onChange={this.changeHandler} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Color: </Form.Label>
                        <Form.Control type="text" placeholder="Color" name="color" value={color} onChange={this.changeHandler} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Icon Image: </Form.Label><br></br>
                        {this.state.iconImageView ?
                            <Figure>
                                <Figure.Image src={this.state.iconImageView} thumbnail width={171} height={180} />
                            </Figure> : <p>No image selected</p>}
                        <Form.Control type="file" name="icon" onChange={this.onIconImageChange} />
                    </Form.Group>
                    {!this.state.isLoading ? <Button type="submit" variant="info">Publish</Button> : <Loader type="ThreeDots" color="#eb1163" height={100} width={50} />}
                </Form>
            </div>
        )
    }
}

export default AddBadges
