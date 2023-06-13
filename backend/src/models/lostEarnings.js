'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LostEarningsSchema = new Schema({
	choreId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Chore'
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	uid: {
		type: String,
		required: true
	},
	days: [{
		type: String,
		required: false
	}],
	choreType: {
		type: String,
		enum: ['weekly', 'asNeeded'],
		required: true,
		default: "weekly"
	},
	amount: {
		type: Number,
		required: true,
		default: 0
	},
	week: {
		type: Number,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	}
},
	{ timestamps: true }
);

const LostEarnings = mongoose.model("LostEarnings", LostEarningsSchema);

module.exports = LostEarnings;