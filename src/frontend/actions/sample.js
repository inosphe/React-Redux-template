'use strict'

import { type } from './config_decl';
import _ from 'underscore'

export function setConfig(key, value){
	return function(dispatch, getState){
		let state = getState();
		if(state.config[key] != value){
			dispatch({
				type: type.SET_CONFIG
				, key
				, value
			});
		}
	}
}