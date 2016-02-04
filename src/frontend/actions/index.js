import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { reducer as config } from './config.decl'

const rootReducer = combineReducers({
	router: routerStateReducer
	, global: combineReducers({
		config: config
	})
});

export default rootReducer;
