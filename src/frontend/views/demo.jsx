import React from 'react';
import { connect } from 'react-redux';

import { setConfig } from 'actions/config'

@connect((state) => {
	return {global: state.global}
}, {setConfig})
class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Demo';
    	this.props.setConfig('demo_text', 'Hello, world!')
    }

    onClick(){
    	this.props.setConfig('demo_text', 'Demo Text')
    }

    render() {
        return (
        	<div>
          		<button onClick={this.onClick.bind(this)}>Click</button>
          		{this.props.global.config.demo_text}
          </div>)
    }
}

export default Demo;
