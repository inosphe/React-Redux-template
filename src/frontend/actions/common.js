import _ from 'underscore'

export class ActionGroup{
	constructor(){
		this.handlers = {};
	}

	_declare(action, callback){
		this.handlers[action] = callback;
	}

	declare(){
		return this._declare.bind(this);
	}

	getReducer(defaultState){
		var self = this;
		return (state=defaultState, action)=>{
			console.log(state, action);
			let reducer = this.handlers[action.type];
			if(reducer){
				return reducer(state, action);
			}
			else{
				return state;
			}
		}
	}

	getTypes(){
		return _.mapObject(this.handlers, (v,k)=>k);
	}
};
