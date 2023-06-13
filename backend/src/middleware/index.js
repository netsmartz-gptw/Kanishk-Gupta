const auth = require('./auth');
const parentRole = require('./parentRole');
const childRole = require('./childRole');
const markAllCompleted = require('./markAllCompletedMiddleware')
const markAsComplete = require('./markChoreCompletedMiddleware');
const ownerOrParentToChildSwitch = require('./ownerOrParentToChildSwitch')
const parentToOwnerSwitch = require('./parentToOwnerSwitch')
const allowedRoles = require('./allowedRoles')

module.exports = {
    auth,
    parentRole,
    childRole,
    markAllCompleted,
    markAsComplete,
    ownerOrParentToChildSwitch,
    parentToOwnerSwitch,
    allowedRoles
};
