import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import './AddContactCardStyle.css';
// import useStyles from './ContactStyle';

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

const AddContactCardComponent = ({ openAddContact, onDialogClose }) => {

	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
	});

	useEffect(() => {
		setFormState({
			isValid: false,
			values: {},
			touched: {},
			errors: {},
		});
	}, [openAddContact]);

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

	const handleSubmit = event => {
		event.preventDefault();

		if (formState.isValid) {
			onDialogClose(formState.values);
		}
	};

	const hasError = field =>
		formState.touched[field] && formState.errors[field] ? true : false;

	/* useEffect(() => {
		console.log("openAddContact : ", openAddContact);
		console.log("onDialogClose : ", onDialogClose);
	}, []); */


	return (
		<Dialog open={openAddContact} onClose={() => onDialogClose()} className="dialogContainer" maxWidth="sm" fullWidth={true}>
			<DialogTitle>Contact</DialogTitle>
			<DialogContent>
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
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onDialogClose()}>Cancel</Button>
				<Button onClick={handleSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

AddContactCardComponent.propTypes =  {
	openAddContact: PropTypes.bool.isRequired,
	onDialogClose: PropTypes.func.isRequired
};

export default AddContactCardComponent;
