const { io } = require('socket.io-client');

// Conectar al servidor WebSocket
const socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoiMTUzZDBmN2YtYzVlMS00MTU5LTk0NWQtMmYzNjJjN2JjNzY0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2NTIxNDE3LCJleHAiOjE3NDY2MDc4MTd9.YE0zbFdys60ip-cj96OHp5RlJniGFTvN2qQRmwL4Ms4'
  }
});

// Eventos de conexión
socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket');
  console.log('ID del socket:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión WebSocket:', error);
});

// Escuchar eventos específicos
socket.on('songRequestUpdate', (data) => {
  console.log('Evento songRequestUpdate recibido:', data);
});

socket.on('tableStatusUpdate', (data) => {
  console.log('Evento tableStatusUpdate recibido:', data);
});

socket.on('orderRequestUpdate', (data) => {
  console.log('Evento orderRequestUpdate recibido:', data);
});

socket.on('newOrderNotification', (data) => {
  console.log('Evento newOrderNotification recibido:', data);
});

// Mantener el script corriendo
console.log('Escuchando eventos WebSocket...'); 