
import { 
	ADD_CONTACT,
	UPDATE_CONTACT,
	FAVOURITE_CONTACT,
	DELETE_CONTACT,
	TAB_CHANGE
} from "../constants/action-types";

const addContact = (payload) => {
	return { type: ADD_CONTACT, payload };
};

const updateContact = (payload) => {
	return { type: UPDATE_CONTACT, payload };
};
const toggleFavourite = (payload) => {
	return { type: FAVOURITE_CONTACT, payload };
};
const deleteContact = (payload) => {
	return { type: DELETE_CONTACT, payload };
};
const onTabChange = (payload) => {
	return { type: TAB_CHANGE, payload };
};


export {
	addContact,
	updateContact,
	toggleFavourite,
	deleteContact,
	onTabChange,
};