const db = require("../models");

// db.Users.belongsTo(db.Users, { as: 'parent', foreignKey: 'parentId' });
// db.Users.hasMany(db.Users, { as: 'children', foreignKey: 'parentId' });

db.Users.belongsTo(db.role, { foreignKey: 'roleId' });
db.role.hasMany(db.Users, { foreignKey: 'roleId' });