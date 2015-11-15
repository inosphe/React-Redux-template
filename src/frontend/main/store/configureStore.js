import rootReducer from '../../actions';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import { devTools } from 'redux-devtools';

export function configureStore(initialState, routes){
	// Compose reduxReactRouter with other store enhancers
	const store = compose(
	  applyMiddleware(thunkMiddleware),
	  reduxReactRouter({
	    routes,
	    createHistory
	  }),
	  devTools()
	)(createStore)(rootReducer, initialState);

	return store;
}


