const { io } = require('../server');
const { Users } = require('../classes/users');
const users = new Users();
const { createMessage } = require('../utils/utils');

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name and room are required'
            });
        }

        client.join(data.room);

        users.addUser(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('listUsers', users.getUsersByRoom(data.room));

        callback(users.getUsersByRoom(data.room));
    });

    client.on('createMessage', (data) => {
        let user = users.getUser(client.id);

        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {

        let userDeleted = users.deleteUser(client.id);

        client.broadcast.to(userDeleted.room).emit('sendMessage', createMessage('Admin',  `${ userDeleted.name } is gone`));
        client.broadcast.to(userDeleted.room).emit('listUsers', users.getUsersByRoom(userDeleted.room));
    });

    client.on('privateMessage', data => {

        let user = users.getUsers(client.id);

        client.broadcast.to(data.to).emit('privateMessage', createMessage(user.name, data.message));

    });
});
