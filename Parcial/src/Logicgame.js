function assignRoles(users){
        const roles = ['Marco', 'Polo', 'Polo Especial'];
        users.forEach((user, index) => {
            user.role = roles[index];
        });;
        return users;
    }

module.exports = { assignRoles };