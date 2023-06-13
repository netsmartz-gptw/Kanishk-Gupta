import {
	ADD_CONTACT,
	UPDATE_CONTACT,
	FAVOURITE_CONTACT,
	DELETE_CONTACT,
	TAB_CHANGE
} from "../constants/action-types";


const initialState = {
	contactList: [],
	tabValue: 'all'
};

const rootReducer = (state = initialState, action = {}) => {
	const { type, payload } = action;
	if (type === ADD_CONTACT) {
		return { ...state, contactList: [ ...state.contactList, payload ] };
	} else if (type === UPDATE_CONTACT && payload !== undefined) {
		// console.log("payload : ", payload);
		const contacts = state.contactList.map(contact => (payload.id === contact.id) ? {
			...contact,
				name: payload.name,
				phone: payload.phone,
				email: payload.email,
			} : contact
		);
		// console.log(contacts);
		return { ...state, contactList: contacts };
	} else if (type === FAVOURITE_CONTACT) {
		const contacts = state.contactList.map(contact => payload === contact.id ? { ...contact, favourite: !contact.favourite } : contact );
		return { ...state, contactList: contacts };
	} else if (type === DELETE_CONTACT) {
		const contacts = state.contactList.filter(contact => {
			return payload === contact.id ? false : true;
		});
		return { ...state, contactList: contacts };
	} else if (type === TAB_CHANGE) {
		return { ...state, tabValue: payload };
	} 
	return state;
	
};
export default rootReducer;