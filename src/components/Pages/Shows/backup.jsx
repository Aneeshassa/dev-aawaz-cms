import React, { Component } from 'react'
import { Table } from 'react-bootstrap';
import axois from 'axios';

class Banner extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      shows: []
    }
  }
  componentDidMount(){
    axois.get('https://api.samortech.com/api/shows')
    .then(response => {
      console.log(response)
      this.setState({shows: response.data})
    })
    .catch(error => {
      console.log(error)
    })
  }
  
  render() {
    const { shows } = this.state
    return (
      <div>
      <h2>List of Show</h2>
        <Table responsive>
            <thead>
                <tr>
                    <th>Sr.no</th>
                    <th>Banner Image</th>
                    <th>Show Name</th>
                    <th>Active / Inactive</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
            <tr>

            </tr>
            </tbody>
            </Table>
        {
          shows.length ?
          shows.map(show => <div key={show.id}>{show.title}</div>) :
          null  
        }
      </div>
    )
  }
}

export default Banner



<div>
<label>Featur: </label>
  <input 
    type="text" 
    name="featured_image_url" 
    value={featured_image_url}
    onChange={this.changeHandler}
  />
</div>
<div>
<label>Banner: </label>
  <input 
    type="text" 
    name="banner_image_url" 
    value={banner_image_url}
    onChange={this.changeHandler}
  />
</div>
<div>
<label>Short Description: </label>
  <input 
    type="text" 
    name="short_description" 
    value={short_description}
    onChange={this.changeHandler}
  />
</div>

<div>
<label>Description: </label>
  <input 
    type="text" 
    name="description" 
    value={description}
    onChange={this.changeHandler}  
  />
</div>
<div>
<label>Short URl: </label>
  <input 
    type="text" 
    name="short_url" 
    value={short_url}
    onChange={this.changeHandler}  
  />
</div>
<div>
<label>Season: </label>
  <input 
    type="text" 
    name="season" 
    value={season}
    onChange={this.changeHandler}  
  />
</div>



<button type="submit">Submit</button>
</form>