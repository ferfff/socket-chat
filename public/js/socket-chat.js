var socket = io();
var params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and Room are required');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function (resp) {
        console.log('Users connected', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Send information
// socket.emit('sendMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Listen información
socket.on('createMessage', function(mensaje) {
    console.log('Server:', mensaje);
});

// Listen users list
socket.on('listUsers', function(users) {
    console.log(users);
});

//Private messages
socket.on('privateMessage', (message) => {
    console.log('DM: ', message);
});
