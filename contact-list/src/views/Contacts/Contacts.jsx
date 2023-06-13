import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AddContactCard from '../../component/AddContactCard'
import './ContactStyle.css';
import { addContact, toggleFavourite, deleteContact, onTabChange } from '../../redux/actions';

const Contacts = ({ addNewContact, contactList, toggleFavourite, deleteContact, tabValue, onTabChange }) => {
	const [openAddContact, setOpenAddContact] = useState(false);

	useEffect(() => {
		console.log("contactList : ", contactList);
	}, [contactList]);

	/* useEffect(() => {
		console.log("tabValue : ", tabValue);
	}, [tabValue]); */


	/**
	 * Handle adding contact to the list
	 * 
	 * @param {*} data 
	 */
	const handleDialogClose = async (data) => {
		setOpenAddContact(false);
		if (data) {
			data = {
				id: uuidv4(),
				...data,
				favourite: false,
			};
			addNewContact(data);
		}
	};

	/**
	 * Handle favorite toggle
	 * 
	 * @param {*} contact 
	 */
	const handleFavoriteToggle = (contact) => {
		toggleFavourite(contact.id);
	};

	/**
	 * Handle delete contact
	 * 
	 * @param {*} contact 
	 */
	const handleDeleteContact = (contact) => {
		deleteContact(contact.id);
	};

	const handleTabChange = (event, newValue) => {
		onTabChange(newValue);
	};

	const renderContactList = () => {
		const filteredList = contactList.filter(contact => (tabValue && contact && ((tabValue === 'favourites' && contact.favourite) || tabValue === 'all' )) );
		if (!filteredList || !filteredList.length) {
			return (
				<Grid item xs={12}>
					<Typography variant="subtitle2">{tabValue !== 'favourites' ? 'No contacts added yet!' : 'No favourite contacts yet!'}</Typography>
				</Grid>
			);
		}
		return (
			<>
				{filteredList.map(contact => (
					<Grid key={contact.id} item xs={12} md={4} lg={3}>
						<ContactCard
							contact={contact}
							onFavoriteToggle={handleFavoriteToggle}
							onDeleteContact={handleDeleteContact}
						/>
					</Grid>
				))}
			</>
		);
	};

	return (
		<div className="content">
			<div className="header">
				<Typography variant="h4">Contacts</Typography>
				<Button variant="contained" onClick={() => setOpenAddContact(true)}>Add Contacts</Button>				
			</div>
			<Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
				<Tab label="All" value="all"  />
				<Tab label="Favourite" value="favourites"  />
			</Tabs>
			<Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="grid-container">
				{contactList && contactList.length ? (
					renderContactList()
				) : (
					<Grid item xs={12}>
						<Typography variant="subtitle2">No contacts added yet!</Typography>
					</Grid>
				)}
			</Grid>

			<AddContactCard
				openAddContact={openAddContact}
				onDialogClose={handleDialogClose}
			/>
   		</div>
	);
};

const ContactCard = ({ contact, onFavoriteToggle, onDeleteContact }) => {

	const navigate = useNavigate();

	return (
		<Card >
			<CardContent>
				<Typography variant="h6" gutterBottom>
					{contact.name}
				</Typography>
				{/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
					9876543210
				</Typography> */}
				<Typography variant="subtitle1" color="text.secondary">
					{contact.phone}
				</Typography>
				<Typography variant="subtitle1" color="text.secondary">
					{contact.email}
				</Typography>
			</CardContent>
			<CardActions>
				<IconButton aria-label="favorite" onClick={() => onFavoriteToggle(contact)} color="error">
					{contact.favourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</IconButton>
				<IconButton aria-label="edit" color="primary" onClick={() => navigate(`/contact/${contact.id}`)}>
					<EditIcon />
				</IconButton>
				<IconButton aria-label="delete" onClick={() => onDeleteContact(contact)}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);	  
};


const mapStateToProps = state => ({ contactList: state.contactList, tabValue: state.tabValue });


const mapDispatchToProps = (dispatch) => ({
	addNewContact: contact => dispatch(addContact(contact)),
	toggleFavourite: contactId => dispatch(toggleFavourite(contactId)),
	deleteContact: contactId => dispatch(deleteContact(contactId)),
	onTabChange: tabValue => dispatch(onTabChange(tabValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
