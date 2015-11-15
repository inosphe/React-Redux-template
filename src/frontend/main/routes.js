import React from 'react';
import { Route } from 'react-router';

import Main from '../views/Main';

const routes = (
  <Route path="/" component={Main}>
  	<Route path="/main" component={Main}>
  	</Route>
  </Route>
);

export default routes;