const axios = require('axios');

// Token JWT de autenticación
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoiMTUzZDBmN2YtYzVlMS00MTU5LTk0NWQtMmYzNjJjN2JjNzY0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2NTIxNDE3LCJleHAiOjE3NDY2MDc4MTd9.YE0zbFdys60ip-cj96OHp5RlJniGFTvN2qQRmwL4Ms4';

// Configuración para las solicitudes HTTP
const config = {
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

// URL base de la API
const baseUrl = 'http://localhost:3000';

// ID de la tabla que existe en la base de datos
const tableId = 'c5c2360c-ace6-4215-a98e-cff86d2ffd68';

// ID del producto que existe en la base de datos
const productId = '90f199a8-1b35-4507-9981-d40e7b2e2c28';

// Función para simular una solicitud de canción
async function testSongRequest() {
  try {
    const songRequestData = {
      songName: 'La Macarena',
      tableId: tableId,
      isKaraoke: false,
      isPlayed: false,
      isActive: true
    };

    console.log('Enviando solicitud de canción...');
    const response = await axios.post(
      `${baseUrl}/song-requests`, 
      songRequestData,
      config
    );
    
    console.log('Respuesta de solicitud de canción:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al simular solicitud de canción:', error.response?.data || error.message);
  }
}

// Función para simular una actualización del estado de una mesa
async function testTableStatusUpdate() {
  try {
    const tableData = {
      isOccupied: true,
      name: 'Mesa Actualizada Test Websocket',
      description: 'Mesa de prueba para WebSockets'
    };

    console.log('Enviando actualización de estado de mesa...');
    const response = await axios.patch(
      `${baseUrl}/tables/${tableId}`, 
      tableData,
      config
    );
    
    console.log('Respuesta de actualización de mesa:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al simular actualización de mesa:', error.response?.data || error.message);
  }
}

// Obtener el precio del producto
async function getProductPrice() {
  try {
    const response = await axios.get(
      `${baseUrl}/products/${productId}`,
      config
    );
    return response.data.price;
  } catch (error) {
    console.error('Error al obtener precio del producto:', error.response?.data || error.message);
    return 10.99; // Valor por defecto
  }
}

// Función para simular una solicitud de orden
async function testOrderRequest() {
  try {
    // Primero obtenemos el precio del producto
    const unitPrice = await getProductPrice();
    
    const orderRequestData = {
      tableId: tableId,
      items: [
        {
          productId: productId,
          quantity: 2,
          unitPrice: parseFloat(unitPrice)
        }
      ]
    };

    console.log('Enviando solicitud de orden...');
    const response = await axios.post(
      `${baseUrl}/order-requests`, 
      orderRequestData,
      config
    );
    
    console.log('Respuesta de solicitud de orden:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al simular solicitud de orden:', error.response?.data || error.message);
  }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
  console.log('=== INICIANDO PRUEBAS DE WEBSOCKETS ===');
  
  // Probamos primero la solicitud de canción
  console.log('\n1. PRUEBA DE SOLICITUD DE CANCIÓN');
  await testSongRequest();
  
  // Esperamos 3 segundos entre pruebas
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Probamos la actualización de estado de mesa
  console.log('\n2. PRUEBA DE ACTUALIZACIÓN DE ESTADO DE MESA');
  await testTableStatusUpdate();
  
  // Esperamos 3 segundos entre pruebas
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Probamos la solicitud de orden
  console.log('\n3. PRUEBA DE SOLICITUD DE ORDEN');
  await testOrderRequest();
  
  console.log('\n=== PRUEBAS COMPLETADAS ===');
}

// Ejecutar las pruebas
runTests(); 