const mongoose = require("mongoose");
const ChoreSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	days: [{
		type: String,
		required: false
	}],
	uid: {
		type: String,
		required: true
	},
	recurring: {
		type: Boolean,
		required: true,
		default: true
	},
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
	autoApprove: {
		type: Boolean,
		required: true,
		default: false
	},
	started_on: {
		type: Date,
		default: Date.now
	},
	ended_on: {
		type: Date,
		default: '2099-12-31'
	}
},
{
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
}

)

const Chore = mongoose.model("Chore", ChoreSchema)

module.exports = Chore