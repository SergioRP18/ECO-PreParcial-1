const { assignRoles } = require('./Logicgame');

module.exports = {
    assignRoles: function(users) {
        const roles = ['Marco', 'Polo', 'Polo Especial'];
        users = users.map(user => ({ ...user, role: roles.pop() }));
        return users;
    }
};