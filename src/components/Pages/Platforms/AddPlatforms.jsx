    import React, { Component } from 'react'
    import axios from 'axios';
    import { Form, Button } from 'react-bootstrap'
    import {baseURL} from "../../../services/servicesPlatform";
    import Loader from 'react-loader-spinner';
    import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
    import auth from '../../../services/authentication';

    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

    class AddPlatforms extends Component {
    constructor(props) {
        super(props)
        this.state = {
        name: ""
        }
    }


    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    
    
    submitHandler = (e) => {
        e.preventDefault()
        // console.log(this.state)
        this.setState({isLoading: true})
        let formData = new FormData();
        for (let [key, value] of Object.entries(this.state)) {
        switch(key){
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
        url: `${baseURL}/platforms/`,
        method: "POST",
        headers:{
            "Content-Type": "multipart/form-data"
        },
        data: formData,
        auth: auth
        })
        .then(response => {
            if(response.status === 201){
            toast.success(`New platforms ${response.data.name} created successfully.`)
            this.setState({isLoading: true})
            window.location.reload(false);
            }
            if(response.status === 400){
            alert('Something went wrong, please try again')
            this.setState({isLoading: false})
            }
        })
        .catch(error => {
            console.log(error.response)
                if (error.response.status === 400) {
                    let err = "";
                    for (let [, value] of Object.entries(error.response.data)) {
                        err = `${err} ${value[0]}. `
                    }
                    toast.error(err)
                    this.setState({ isLoading: false })
                }
        })
    }

    render() {
        const { name } = this.state
        return (
        <div>
             <ToastContainer
                    autoClose={5000}
                    hideProgressBar={false}
                    position="top-center" />

            <h2>Add New Platforms</h2>    
                <Form onSubmit={this.submitHandler}>
                    <Form.Group>
                        <Form.Label>Platforms Name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter platforms Name here" name="name" value={name} onChange={this.changeHandler} required/>
                    </Form.Group>
                    {!this.state.isLoading? <Button type="submit" variant="info">Publish</Button>: <Loader type="ThreeDots" color="#eb1163" height={100} width={50}/>}
                </Form>
        </div>
        )
    }
    }

    export default AddPlatforms
