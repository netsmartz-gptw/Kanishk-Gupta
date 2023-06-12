module.exports = {
    apiurls: {
        createNotifications: {
            url: 'admin/notifications',
            method: 'post'
        },
        profile: {
            url: 'profile',
            method: 'get'
        },
        getCategories: {
            url: 'getCategories',
            method: 'get'
        },
        userConfig: {
            url: 'config',
            method: 'get'
        }
    },
    notifications: {
        chore_created: {
            type: 'chore_created',
            description: 'New chore is assigned to you',
            title: 'Chore Created'
        },
        chore_completed: {
            type: 'chore_completed',
            description: 'A chore is marked completed. Please review',
            title: 'Chore Completed'
        },
        weekly_chore_due: {
            type: 'weekly_chore_due',
            description: ' You have a chore due. Please review.',
            title: 'Weekly Chore Due'
        }
    },
	roles: {
		admin: "admin",
		parent: "parent",
		child: "child"
	},
    userMiddlewareFields: ['id', 'roleId', 'familyId', 'email', 'username', 'uid']
}