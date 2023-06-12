const express = require('express');
const router = express.Router()
const chore = require('../controller/index');
const { auth, markAsComplete, markAllCompleted, parentToOwnerSwitch, ownerOrParentToChildSwitch, allowedRoles } = require('../middleware');
const checkSyncCompeltedChores = require('../middleware/checkSyncCompeletedChores');
const createChoreValidation = require('../middleware/validation/createChoreValidation');
const editChoreValidation = require('../middleware/validation/editChoreValidation')
const markChoreAsCompletedValidation = require('../middleware/validation/markChoreAsCompleted')
const markChoresAsPaidValidation = require('../middleware/validation/markChoresAsPaidValidation');
const { roles: { admin: adminRole, parent: parentRole, child: childRole } } = require('../config/config');

const basicAuthMiddlewares = [auth, parentToOwnerSwitch, ownerOrParentToChildSwitch]

router.get('/list', basicAuthMiddlewares, allowedRoles([childRole]), chore.getChoreList)
router.get('/predefined', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.fetchPredefineChore)
router.get('/pendingApproval', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.pendingApprovalChores)
router.delete('/chorehistory/:id/disapprove', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.disapproveChore);
router.put('/chorehistory/approveall', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.approveAllChore);
router.put('/chorehistory/:id/approve', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.approveChore);
router.get('/allChildChores', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.getAllChildsChores)
router.get('/weeklyChoreTotal', basicAuthMiddlewares, chore.weeklyChoreTotalController)

// new endpoints after deprication
router.delete('/:id/', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.deleteChore)
router.post('/', createChoreValidation, basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.createChore)
router.get('/chorehistory', basicAuthMiddlewares, allowedRoles([childRole]), chore.childChoreListing)

// depricated
router.delete('/:id/delete', basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.deleteChore)
router.put('/:choreId/edit', editChoreValidation, basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.editChoreController)
router.post('/create', createChoreValidation, basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.createChore)

router.post('/markAsCompleted', markChoreAsCompletedValidation, basicAuthMiddlewares, allowedRoles([childRole]), markAsComplete, checkSyncCompeltedChores)
router.post('/markAllCompleted', basicAuthMiddlewares, allowedRoles([childRole]), markAllCompleted, checkSyncCompeltedChores)


router.get('/unpaid/:uid', chore.fetchUnpaidChores)
router.put('/mark/paid', markChoresAsPaidValidation, chore.markChoresAsPaid)

router.put('/:choreId', editChoreValidation, basicAuthMiddlewares, allowedRoles([adminRole, parentRole]), chore.editChoreController)

router.get('/dashboard/freemium/child', basicAuthMiddlewares, allowedRoles([childRole]), chore.childDashboardController)
router.get('/dashboard/freemium/parent', auth, allowedRoles([adminRole, parentRole]), chore.freemiumParentDashboardController)

router.get('/chorehistory/:id/markAsPaid', basicAuthMiddlewares, chore.markAsPaidController)
router.post('/chorehistory/markAllPaid', basicAuthMiddlewares, chore.markAllPaidController)
router.get('/lostEarnings', basicAuthMiddlewares, allowedRoles([childRole]), chore.lostEarningsController)

// depriciated 
router.get('/chorehistory/summary', basicAuthMiddlewares, chore.choreHistorySummaryController)
module.exports = router;