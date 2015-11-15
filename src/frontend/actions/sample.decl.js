import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_CONFIG', (state, action)=>{
	return Object.assign({}, state, {[action.key]: action.value});
});

export const reducer = group.getReducer({
	bannerIndex: 0
	, priorityStrategy: undefined //default value
	, displayActiveListOnly: false
	, showCalendarList: false
});
export const type = group.getTypes();