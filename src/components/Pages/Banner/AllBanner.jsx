import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap'
import BannerPlatform from './BannerPlatform'

import { getAllPlatform } from '../../../services/servicesPlatform'
import { getAllBanner} from '../../../services/serviceBanner';

class AddBanner extends Component {
  
    state = {
      platform: [],
      banners: [],
      platformName: "android",
      isLoading:false
    }
  
  
  componentDidMount() {
    getAllPlatform()
      .then(response => {
        this.setState({ platform: response.data.results })
        console.log(response.data.results)
      })
      .catch(error => {
        console.log(error)
      });
    
    getAllBanner()
    .then((response)=>{
        this.setState({banners: response.data.results})
    })
    .catch(error => {
      console.log(error)
    });
  }
  platformHandler = (name)=>{
    console.log("name id platform handler: ", name)
    this.setState({platformName: name}, ()=> console.log(this.state.platformName))
  }
  render() {
    const platform = this.state.platform
    return ( 
      <React.Fragment>
        <h1>All Banner</h1>
        <Tabs defaultActiveKey="android" id="uncontrolled-tab-example">
          {
            platform.map(data => 
            <Tab eventKey={data.name} key={data.uniqueSlug} title={data.name}>
              <BannerPlatform platformName={data.name} banners={this.state.banners}/>
            </Tab>
            )
          }
          
        </Tabs>
      </React.Fragment>
     );
  }
}
 
export default AddBanner;