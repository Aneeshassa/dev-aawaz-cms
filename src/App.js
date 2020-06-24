import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import Header from './components/HeaderNav/Header'
import 'bootstrap/dist/css/bootstrap.css';
import SidebarNav from './components/SideBar/sidebar';

import Dashboard from './components/Pages/Dashboard';

import Badges from './components/Pages/Badges';
  import AllBadges from './components/Pages/Badges/AllBadges';
  import AddBadges from './components/Pages/Badges/AddBadges';

import Platforms from './components/Pages/Platforms';
  import AllPlatforms from './components/Pages/Platforms/AllPlatforms';
  import AddPlatforms from './components/Pages/Platforms/AddPlatforms';

import Channel from './components/Pages/Channel';
  import AllChannel from './components/Pages/Channel/AllChannel';
  import AddChannel from './components/Pages/Channel/AddChannel';

import Shows from './components/Pages/Shows';
  import SheetUpload from './components/Pages/Shows/SheetUpload';
  import AllShows from './components/Pages/Shows/AllShows';
  import AddShow from './components/Pages/Shows/AddShow';
  import EditShow from './components/Pages/Shows/EditShow'
  import EditShowEpisode from './components/Pages/Shows/EditShowEpisode'

import Category from './components/Pages/Category';
  import AllCategory from './components/Pages/Category/AllCategory';
  import AddCategory from './components/Pages/Category/AddCategory';
 
import Banners from './components/Pages/Banners';
  import AddBanner from './components/Pages/Banner/AddBanner';
  import AllBanner from './components/Pages/Banner/AllBanner';

import Section from './components/Pages/Section';
  import AddSection from './components/Pages/Section/AddSection';
  import AllSection from './components/Pages/Section/AllSection';


  


function App() {
  return (
    <React.Fragment>
    <Header />
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <SidebarNav />
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">

              <Route path="/" exact component={Dashboard} />

              <Route path="/badges" exact component={Badges} />
                  <Route path="/badges/all-badges" component={AllBadges} />
                  <Route path="/badges/new-badges" component={AddBadges} />
                  
              <Route path="/platforms" exact component={Platforms} />
                  <Route path="/platforms/all-platforms" component={AllPlatforms} />
                  <Route path="/platforms/new-platforms" component={AddPlatforms} />

              <Route path="/channel" exact component={Channel} />
                  <Route path="/channel/new-channel" component={AddChannel} />
                  <Route path="/channel/all-channel" component={AllChannel} />

              <Route path="/shows" exact component={Shows} />
                  <Route path="/shows/sheet-upload" component={SheetUpload} />
                  <Route path="/shows/new-show" component={AddShow} />
                  <Route path="/shows/all-show" component={AllShows} />
                  <Route path="/shows/edit-show" component={EditShow} />
                  <Route path="/shows/edit-show-episode" component={EditShowEpisode} />

              <Route path="/category" exact component={Category} />
                  <Route path="/category/new-category" component={AddCategory} />
                  <Route path="/category/all-category" component={AllCategory} />


              <Route path="/banners" exact component={Banners} />
                  <Route path="/banners/all-banner" component={AllBanner} />
                  <Route path="/banners/new-banner" component={AddBanner} />

              <Route path="/section" exact component={Section} />
                  <Route path="/section/all-section" component={AllSection} />
                  <Route path="/section/new-section" component={AddSection} />  
              

          </main>
        </div>
      </div>

      
      
    </React.Fragment>
  );
}

export default App;
