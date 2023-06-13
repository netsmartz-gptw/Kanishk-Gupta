import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import validate from 'validate.js';
import { useNavigate } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './ContactDetailStyle.css';
import { updateContact } from '../../redux/actions';

const schema = {
	name: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 100,
		},
	},
	phone: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 50,
		},
	},
	email: {
		presence: { allowEmpty: false, message: 'is required' },
		email: true,
		length: {
			maximum: 300,
		},
	},
};


const ContactDetails = ({ contactList, updateContact }) => {
	const params = useParams();
	const navigate = useNavigate();

	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
	});

	useEffect(() => {
		if (!contactList || !contactList.length) { return navigate('/'); }
		if (params.id) {
			const contact = contactList.find(contact => contact && params.id === contact.id);
			// console.log("contact : ", contact);
			if (!contact) { return navigate('/'); }
			setFormState(formState => ({
				...formState,
				values: {
					...formState.values,
					name: contact.name,
					phone: contact.phone,
					email: contact.email,
				}
			}));
		}
	}, [params, navigate, contactList]);

	useEffect(() => {
		const errors = validate(formState.values, schema);

		setFormState(formState => ({
			...formState,
			isValid: errors ? false : true,
			errors: errors || {},
		}));
	}, [formState.values]);

	const handleChange = event => {
		event.persist();

		setFormState(formState => ({
			...formState,
			values: {
				...formState.values,
				[event.target.name]:
					event.target.type === 'checkbox'
						? event.target.checked
						: event.target.value,
			},
			touched: {
				...formState.touched,
				[event.target.name]: true,
			},
		}));
	};

	const handleUpdate = event => {
		event.preventDefault();
		updateContact({ id: params.id, ...formState.values });
		navigate('/');
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	return (
		<div className="content">
			<div className="header">
				<div className="header-title">
					<IconButton size="small" aria-label="go-back" onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Typography className="title" variant="h4">Contact Details</Typography>
				</div>
				<Button variant="contained" onClick={handleUpdate}>Update Contact</Button>				
			</div>
			<Paper className="paper-container">
				<form name="contact-form">
					<Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="grid-container">
						<Grid item md={6} xs={12}>
							<TextField
								autoFocus
								name="name"
								label="Name"
								type="text"
								fullWidth
								variant="outlined"
								className="text-field"
								helperText={hasError('name') ? formState.errors.name[0] : null}
								error={hasError('name')}
								onChange={handleChange}
								value={formState.values.name || ''}
								required
							/>
						</Grid>
						<Grid item md={6} xs={12}>							
							<TextField
								name="phone"
								label="Phone"
								type="text"
								fullWidth
								variant="outlined"
								className="text-field"
								helperText={hasError('phone') ? formState.errors.phone[0] : null}
								error={hasError('phone')}
								onChange={handleChange}
								value={formState.values.phone || ''}
								required
							/>
						</Grid>
						<Grid item md={6} xs={12}>							
							<TextField
								name="email"
								label="Email"
								fullWidth
								variant="outlined"
								className="text-field"
								helperText={hasError('email') ? formState.errors.email[0] : null}
								error={hasError('email')}
								onChange={handleChange}
								type="email"
								value={formState.values.email || ''}
								required
							/>
						</Grid>						
					</Grid>
				</form>
				{/* <form>
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="grid-container">
						{contactList && contactList.length ? (
							<>
								{contactList.map(contact => (
									<Grid key={contact.id} item xs={12} md={4} lg={3}>
										<ContactCard
											contact={contact}
											onFavoriteToggle={handleFavoriteToggle}
											onDeleteContact={handleDeleteContact}
										/>
									</Grid>
								))}
							</>
						) : (
							<Grid item xs={12}>
								<Typography variant="subtitle2">No contacts added yet!</Typography>
							</Grid>
						)}
					</Grid>
				</form> */}
			</Paper>
			
   		</div>
	);
};

const mapStateToProps = state => ({ contactList: state.contactList });


const mapDispatchToProps = (dispatch) => ({
	updateContact: contact => dispatch(updateContact(contact)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
