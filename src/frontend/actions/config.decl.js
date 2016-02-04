import { ActionGroup } from './common.js'
import _ from 'underscore'

let group = new ActionGroup();
let DECL = group.declare();

DECL('SET_CONFIG', (state, action)=>{
	return Object.assign({}, state, {[action.key]: action.value});
});

export const reducer = group.getReducer({});
export const type = group.getTypes();