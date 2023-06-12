const db = require("../mysql/models");

/**
 * Fetch all children uid from parent uid
 * 
 * @param {String} parentUid 
 */
const getChildsUidsByParentUids = async (parentUid) => {

	try {

		// get the parent id first 
		const user = await db.Users.findOne({
			where: { uid: parentUid },
			attributes: ['id']
		})

		if (!user || !user.id) return []

		// get the uid of childs
		const parentChilds = await db.ParentChild.findAll({
			parent_id: user.id
		})
		const childIds = parentChilds.map(parentChlid => parentChlid.child_id)

		const childs = await db.Users.findAll({
			where: { id: childIds },
			attributes: ["uid"]
		})

		if (!childs || !childs.length) return []

		return childs.map(child => child.uid)
	}
	catch (err) {
		throw err
	}
}

/**
 * Fetch all children from parent uid
 * 
 * @param {String} parentUid 
 */
const getChildrenByParentUid = async (parentUid, selectChildParams) => {

	try {

		selectChildParams = selectChildParams || ['uid', 'firstName', 'lastName', 'profileImageUrl'];
		return await db.Users.findOne({
			where: { uid: parentUid },
			attributes: ['id'],
			include: {
				model: db.Users,
				as: 'children',
				attributes: selectChildParams
			},
			logging: false
		})
	}
	catch (err) {
		throw err
	}
}

/**
 * Fetch parent from child uid
 * 
 * @param {String} childUid 
 * @param {Array} selectParentParams 
 * @returns {Object}
 */
const getParentByChildUid = async (childUid, selectParentParams) => {

	try {

		selectParentParams = selectParentParams || ['uid', 'firstName', 'lastName', 'profileImageUrl'];

		return await db.Users.findOne({
			where: { uid: childUid },
			attributes: ['id'],
			include: {
				model: db.Users,
				as: 'parent',
				attributes: selectParentParams
			},
			logging: false
		})
	}
	catch (err) {
		throw err
	}
}

module.exports = {
	getChildsUidsByParentUids,
	getChildrenByParentUid,
	getParentByChildUid,
}