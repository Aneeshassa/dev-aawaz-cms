import React from 'react';

import { Doughnut } from 'react-chartjs-2';

const data = {
	labels: [
		'April',
		'March',
		'May'
	],
	datasets: [{
		data: [100, 80, 10],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};

export default class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.chartReference = React.createRef();
    }
  
    componentDidMount() {
      console.log(this.chartReference); // returns a Chart.js instance reference
    }
  
    render() {
      return (<Doughnut ref={this.chartReference} data={data}/>)
    }
  }