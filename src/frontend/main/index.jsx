import React from 'react';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { configureStore } from './store/configureStore'
import { ReduxRouter } from 'redux-router';
import ReactDOM from 'react-dom';
import routes from './routes'

let store = configureStore(undefined, routes);

global.store = store;

ReactDOM.render(
	<div>
		<Provider store={store}>
			<ReduxRouter>
	            {routes}
	          </ReduxRouter>
		</Provider>
		<DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
    </div>
	, document.getElementById('content')
);
