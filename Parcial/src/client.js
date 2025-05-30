const socket = io('http://localhost:5050');

const registroForm = document.getElementById('registroForm');
const registroDiv = document.getElementById('registro');
const gameDiv = document.getElementById('game');
const roleElement = document.getElementById('role');
const gritarMarcoButton = document.getElementById('gritarMarco');
const gritarPoloButton = document.getElementById('gritarPolo');
const listaPolos = document.getElementById('listaPolos');
const resultadoDiv = document.getElementById('resultado');
const mensajeResultado = document.getElementById('mensajeResultado');
const reiniciarJuegoButton = document.getElementById('reiniciarJuego');

let username = '';

registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = document.getElementById('username').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Usuario registrado') {
            registroDiv.style.display = 'none';
            gameDiv.style.display = 'block';
            socket.emit('usuarioRegistrado', username);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

socket.on('roleAssigned', (users) => {
    const user = users.find(user => user.username === username);
    roleElement.textContent = `Tu rol es: ${user.role}`;
    if (user.role === 'Marco') {
        gritarMarcoButton.style.display = 'block';
    } else {
        gritarPoloButton.style.display = 'block';
    }
});

gritarMarcoButton.addEventListener('click', () => {  
    socket.emit('gritarMarco', username);
});

gritarPoloButton.addEventListener('click', () => {
    socket.emit('gritarPolo', username);
});

function mostrarPolos(polos) {
    listaPolos.innerHTML = '';
    polos.forEach(polo => {
        const li = document.createElement('li');
        li.textContent = polo;
        li.addEventListener('click', () => {
            socket.emit('seleccionarPolo', polo);
        });
        listaPolos.appendChild(li); 
    });
}

socket.on('mostrarPolos', (polos) => {
    mostrarPolos(polos);
});

socket.on('finJuego', (result) => {
    console.log(result);
    
    if (result.ganador) {
        mensajeResultado.textContent = `¡${result.ganador} ha ganado!`;
    } else {
        mensajeResultado.textContent = `¡${result.perdedor} ha perdido!`;
    }
    resultadoDiv.style.display = 'block';
});


reiniciarJuegoButton.addEventListener('click', () => {
    location.reload();
    socket.emit('reiniciarJuego')
});

socket.on('reiniciarJuegoServidor', () => {
    location.reload();
});

socket.on('marcoGritado', (username) => {
    console.log(`${username} ha gritado Marco`);
});

socket.on('poloGritado', (username) => {
    console.log(`${username} ha gritado Polo`);
});