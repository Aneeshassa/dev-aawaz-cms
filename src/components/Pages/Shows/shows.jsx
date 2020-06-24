import React, { Component } from 'react';
import ShowsDataServices from '../../../services/serviceShows';

const AddShows = () => {
    const intialshowState = {
        title: "",
        weight: null,
        featured_image_url: "",
        banner_image_url: null,
        unique_slug: null,
        short_description: "",
        description: null,
        short_url: "",
        published_on: null,
        sequence: null,
        channel: null,
        artist: null,
        deep_link: "",
        show_notes: "",
        season: "",
        source: "",
        language: "",
        is_active: false
    };

    const [shows, setShows] = useState(initialShowState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setShows({ ...shows, [name]: value });
    };
    const saveTutorial = () => {
        var data = {
            title: shows.title,
            weight: shows.weight,
            featured_image_url: shows.featured_image_url,
            banner_image_url: shows.banner_image_url,
            unique_slug: shows.unique_slug,
            short_description: shows.short_description,
            description: shows.description,
            short_url: shows.short_url,
            published_on: shows.published_on,
            sequence: shows.sequence,
            channel: shows.channel,
            artist: shows.artist,
            deep_link: shows.deep_link,
            show_notes: shows.show_notes,
            season: shows.season,
            source: shows.source,
            language: shows.language,
            is_active: shows.is_active
    };

    ShowsDataServices.create(data)
        .then(response => {
            setShows({
                title: response.data.title,
                weight: response.data.weight,
                featured_image_url: response.data.featured_image_url,
                banner_image_url: response.data.banner_image_url,    
                unique_slug: response.data.unique_slug,
                short_description: response.data.short_description,
                description: response.data.description,
                short_url: response.data.short_url,
                published_on: response.data.published_on,
                sequence: response.data.sequence,
                channel: response.data.channel,
                artist: response.data.artist,
                deep_link: response.data.deep_link,
                show_notes: response.data.show_notes,
                season: response.data.season,
                source: response.data.source,
                language: response.data.language,
                is_active: response.data.is_active
            });
            setSubmitted(true);
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
};
const newShow = () => {
    setShows(initialShowState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
    {submitted ? (
      <div>
        <h4>You submitted successfully!</h4>
        <button className="btn btn-success" onClick={newTutorial}>
          Add
        </button>
      </div>
    ) : (
      <div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            required
            value={tutorial.title}
            onChange={handleInputChange}
            name="title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            required
            value={tutorial.description}
            onChange={handleInputChange}
            name="description"
          />
        </div>

        <button onClick={saveTutorial} className="btn btn-success">
          Submit
        </button>
      </div>
    )}
  </div>
  )

export default AddShows;