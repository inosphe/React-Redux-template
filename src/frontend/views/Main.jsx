import React from 'react';

import Demo from './demo'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Main';
    }

    render() {
        return <Demo />
    }
}

// Elsewhere, in a component module...
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

export default connect(
  // Use a selector to subscribe to state
  state => ({ q: state.router.location.query.q, global: state.global }),

  // Use an action creator for navigation
  { pushState }
)(Main);