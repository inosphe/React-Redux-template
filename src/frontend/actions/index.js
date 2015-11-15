import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { reducer as sample } from './sample.decl'

const rootReducer = combineReducers({
	sample
	, router: routerStateReducer
});

export default rootReducer;
