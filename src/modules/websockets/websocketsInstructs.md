# Guía de Implementación de WebSockets

Este documento proporciona instrucciones detalladas sobre cómo utilizar el sistema de WebSockets en aplicaciones frontend que se conectan con el backend de Sasseri Bares.

## Introducción

El sistema de WebSockets permite la comunicación en tiempo real entre el servidor y los clientes, facilitando actualizaciones instantáneas para varias funcionalidades, como:

- Solicitudes de canciones
- Cambios en el estado de las mesas
- Solicitudes de órdenes de productos
- Notificaciones de nuevos pedidos

## Configuración Básica en el Frontend

### Instalación de Socket.IO Client

Primero, instala la biblioteca Socket.IO Client en tu proyecto frontend:

```bash
# Para aplicaciones NPM
npm install socket.io-client

# Para aplicaciones Yarn
yarn add socket.io-client
```

### Conexión Básica al Servidor WebSocket

```javascript
import { io } from 'socket.io-client';

// Reemplaza la URL según tu entorno (desarrollo o producción)
const socketURL = 'http://localhost:3000'; 

// Configuración básica de conexión
const socket = io(socketURL, {
  transports: ['websocket', 'polling'], // Preferir WebSocket, fallback a polling
  withCredentials: true, // Necesario si usas autenticación basada en cookies
  autoConnect: true // Conectar automáticamente al crear la instancia
});

// Eventos de conexión
socket.on('connect', () => {
  console.log('Conexión establecida con el servidor WebSocket');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor WebSocket');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión WebSocket:', error);
});
```

## Autenticación en WebSockets

Para las funciones que requieren autenticación, debes proporcionar el token JWT:

```javascript
// Obtén el token de donde lo tengas almacenado (localStorage, estado, etc.)
const token = localStorage.getItem('authToken');

// Opción 1: Envía el token en la conexión
const socketWithAuth = io(socketURL, {
  auth: {
    token: `Bearer ${token}`
  }
});

// Opción 2: Envía el token como una consulta en la URL
const socketWithAuthQuery = io(`${socketURL}?token=${token}`);

// Opción 3: Envía el token después de la conexión
socket.on('connect', () => {
  socket.emit('authenticate', { token });
});
```

## Canales de WebSocket y Eventos

### 1. Actualización de Solicitudes de Canciones

Este canal permite recibir actualizaciones en tiempo real sobre solicitudes de canciones.

**Evento**: `songRequestUpdate`

**Estructura de Datos Recibida**:

```typescript
{
  tableId: string;          // ID de la mesa que hizo la solicitud
  songRequests: [           // Lista de canciones solicitadas
    {
      id: string;           // ID de la solicitud
      songName: string;     // Nombre de la canción
      artistName: string;   // Nombre del artista
      requestedBy: string;  // Nombre del cliente que solicitó
      status: string;       // 'pending', 'played', 'rejected'
      createdAt: string;    // Fecha y hora de la solicitud
    },
    // ... más solicitudes
  ]
}
```

**Ejemplo de Implementación**:

```javascript
// Escuchar actualizaciones de solicitudes de canciones
socket.on('songRequestUpdate', (data) => {
  console.log(`Actualización de solicitudes de canciones para mesa ${data.tableId}`);
  console.log('Canciones solicitadas:', data.songRequests);
  
  // Actualizar la interfaz con las nuevas solicitudes
  updateSongRequestsUI(data.songRequests);
});

// Ejemplo: Solicitar una canción
function requestSong(tableId, songData) {
  socket.emit('requestSong', {
    tableId,
    songName: songData.songName,
    artistName: songData.artistName,
    requestedBy: songData.clientName
  });
}

// Ejemplo de datos para solicitar una canción
const songRequest = {
  tableId: '123',
  songName: 'Despacito',
  artistName: 'Luis Fonsi',
  clientName: 'Juan Pérez'
};

requestSong(songRequest.tableId, songRequest);
```

### 2. Actualización del Estado de Mesas

Este canal permite recibir actualizaciones en tiempo real sobre cambios en el estado de las mesas.

**Evento**: `tableStatusUpdate`

**Estructura de Datos Recibida**:

```typescript
{
  tableId: string;           // ID de la mesa actualizada
  status: string;            // 'available', 'occupied'
  occupiedBy?: string;       // Nombre del cliente (solo si está ocupada)
  occupiedSince?: string;    // Hora de ocupación (solo si está ocupada)
  currentOrderId?: string;   // ID de la orden actual (solo si está ocupada)
  orderTotal?: number;       // Total de la orden actual (solo si está ocupada)
}
```

**Ejemplo de Implementación**:

```javascript
// Escuchar actualizaciones de estado de mesas
socket.on('tableStatusUpdate', (data) => {
  console.log(`Mesa ${data.tableId} actualizada a estado: ${data.status}`);
  
  // Actualizar la interfaz con el nuevo estado de la mesa
  updateTableStatusUI(data.tableId, data);
});

// Ejemplo: Ocupar una mesa
function occupyTable(tableId, clientName) {
  socket.emit('occupyTable', {
    tableId,
    clientName
  });
}

// Ejemplo: Liberar una mesa
function releaseTable(tableId) {
  socket.emit('releaseTable', {
    tableId
  });
}

// Ejemplo de uso
occupyTable('A1', 'María Rodríguez');
// Más tarde...
releaseTable('A1');
```

### 3. Actualización de Solicitudes de Órdenes

Este canal permite recibir actualizaciones en tiempo real sobre solicitudes de órdenes de productos.

**Evento**: `orderRequestUpdate`

**Estructura de Datos Recibida**:

```typescript
{
  tableId: string;          // ID de la mesa
  orderRequests: [          // Lista de solicitudes de órdenes
    {
      id: string;           // ID de la solicitud
      items: [              // Productos solicitados
        {
          productId: string;     // ID del producto
          productName: string;   // Nombre del producto
          quantity: number;      // Cantidad
          unitPrice: number;     // Precio unitario
          subtotal: number;      // Subtotal (quantity * unitPrice)
          notes?: string;        // Notas adicionales (opcional)
        },
        // ... más items
      ],
      status: string;       // 'pending', 'confirmed', 'rejected'
      total: number;        // Total de la orden
      createdAt: string;    // Fecha y hora de la solicitud
      clientName: string;   // Nombre del cliente
    },
    // ... más solicitudes
  ]
}
```

**Ejemplo de Implementación**:

```javascript
// Escuchar actualizaciones de solicitudes de órdenes
socket.on('orderRequestUpdate', (data) => {
  console.log(`Actualización de solicitudes de órdenes para mesa ${data.tableId}`);
  console.log('Solicitudes de órdenes:', data.orderRequests);
  
  // Actualizar la interfaz con las nuevas solicitudes
  updateOrderRequestsUI(data.orderRequests);
});

// Ejemplo: Solicitar una orden
function requestOrder(tableId, orderData) {
  socket.emit('requestOrder', {
    tableId,
    clientName: orderData.clientName,
    items: orderData.items
  });
}

// Ejemplo de datos para solicitar una orden
const orderRequest = {
  tableId: '123',
  clientName: 'Carlos López',
  items: [
    {
      productId: 'p001',
      productName: 'Hamburguesa',
      quantity: 2,
      unitPrice: 8.5,
      notes: 'Sin cebolla'
    },
    {
      productId: 'p002',
      productName: 'Refresco Cola',
      quantity: 2,
      unitPrice: 2.5
    }
  ]
};

requestOrder(orderRequest.tableId, orderRequest);
```

### 4. Notificación de Nuevos Pedidos

Este canal permite recibir notificaciones en tiempo real cuando se crea un nuevo pedido.

**Evento**: `newOrderNotification`

**Estructura de Datos Recibida**:

```typescript
{
  orderId: string;          // ID del pedido
  tableId: string;          // ID de la mesa
  clientId: string;         // ID del cliente
  orderInfo: {
    total: number;          // Total del pedido
    itemsCount: number;     // Cantidad de productos
    createdAt: string;      // Fecha y hora de creación
  }
}
```

**Ejemplo de Implementación**:

```javascript
// Escuchar notificaciones de nuevos pedidos
socket.on('newOrderNotification', (data) => {
  console.log(`¡Nuevo pedido recibido para la mesa ${data.tableId}!`);
  console.log(`Total: ${data.orderInfo.total}, Productos: ${data.orderInfo.itemsCount}`);
  
  // Mostrar una notificación al usuario
  showNotification({
    title: 'Nuevo Pedido',
    message: `Mesa ${data.tableId}: ${data.orderInfo.itemsCount} productos - $${data.orderInfo.total}`,
    type: 'success'
  });
  
  // Actualizar la lista de pedidos pendientes
  updatePendingOrdersList();
});
```

## Integración en Diferentes Frameworks Frontend

### Vue.js

```javascript
// En un componente Vue
export default {
  data() {
    return {
      socket: null,
      songRequests: [],
      orderRequests: []
    };
  },
  created() {
    this.connectWebSocket();
  },
  methods: {
    connectWebSocket() {
      this.socket = io('http://localhost:3000');
      
      this.socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket');
      });
      
      this.socket.on('songRequestUpdate', (data) => {
        this.songRequests = data.songRequests;
      });
      
      this.socket.on('orderRequestUpdate', (data) => {
        this.orderRequests = data.orderRequests;
      });
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
```

### React

```jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function WebSocketComponent() {
  const [socket, setSocket] = useState(null);
  const [songRequests, setSongRequests] = useState([]);
  const [orderRequests, setOrderRequests] = useState([]);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });
    
    newSocket.on('songRequestUpdate', (data) => {
      setSongRequests(data.songRequests);
    });
    
    newSocket.on('orderRequestUpdate', (data) => {
      setOrderRequests(data.orderRequests);
    });
    
    setSocket(newSocket);
    
    // Limpieza al desmontar
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  return (
    <div>
      <h2>Solicitudes de Canciones</h2>
      <ul>
        {songRequests.map(song => (
          <li key={song.id}>{song.songName} - {song.artistName}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Angular

```typescript
// Servicio WebSocket
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private songRequestsSubject = new Subject<any>();
  private orderRequestsSubject = new Subject<any>();
  
  constructor() {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('songRequestUpdate', (data) => {
      this.songRequestsSubject.next(data);
    });
    
    this.socket.on('orderRequestUpdate', (data) => {
      this.orderRequestsSubject.next(data);
    });
  }
  
  get songRequests$(): Observable<any> {
    return this.songRequestsSubject.asObservable();
  }
  
  get orderRequests$(): Observable<any> {
    return this.orderRequestsSubject.asObservable();
  }
  
  requestSong(data: any): void {
    this.socket.emit('requestSong', data);
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Componente que usa el servicio
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-song-requests',
  template: `
    <h2>Solicitudes de Canciones</h2>
    <ul>
      <li *ngFor="let song of songRequests">
        {{ song.songName }} - {{ song.artistName }}
      </li>
    </ul>
  `
})
export class SongRequestsComponent implements OnInit, OnDestroy {
  songRequests: any[] = [];
  private subscription: Subscription;
  
  constructor(private wsService: WebsocketService) {}
  
  ngOnInit(): void {
    this.subscription = this.wsService.songRequests$.subscribe(data => {
      this.songRequests = data.songRequests;
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

## Manejo de Reconexión

Para manejar reconexiones automáticas en caso de pérdida de conexión:

```javascript
const socket = io(socketURL, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Intento de reconexión #${attemptNumber}`);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconectado después de ${attemptNumber} intentos`);
  
  // Reinicializar el estado si es necesario
  // Por ejemplo, volver a cargar datos que podrían haberse perdido durante la desconexión
  refreshData();
});

socket.on('reconnect_failed', () => {
  console.error('Falló la reconexión después de todos los intentos');
  // Mostrar un mensaje al usuario
  showErrorMessage('La conexión con el servidor se ha perdido. Por favor, recarga la página.');
});
```

## Consideraciones de Seguridad

1. **Validación de Datos**: Siempre valida los datos recibidos del servidor antes de procesarlos
2. **Limitación de Reconexiones**: Establece un límite razonable de reconexiones para evitar sobrecarga
3. **Manejo de Errores**: Implementa un manejo adecuado de errores para todos los eventos
4. **Autenticación**: Asegúrate de que las operaciones sensibles requieran autenticación
5. **Desconexión**: Siempre desconecta el socket cuando el componente se desmonta

```javascript
// Ejemplo de comprobación de datos recibidos
socket.on('songRequestUpdate', (data) => {
  // Verificar que los datos tienen la estructura esperada
  if (!data || !data.tableId || !Array.isArray(data.songRequests)) {
    console.error('Datos de solicitud de canciones inválidos:', data);
    return;
  }
  
  // Procesar los datos validados
  updateSongRequestsUI(data.songRequests);
});
```

## Pruebas de Conexión

Para probar la conexión WebSocket de forma manual:

```javascript
// Función para probar la conexión
function testWebSocketConnection() {
  console.log('Estado actual del socket:', socket.connected ? 'Conectado' : 'Desconectado');
  
  // Enviar un ping y esperar un pong
  const startTime = Date.now();
  socket.emit('ping', {}, () => {
    const latency = Date.now() - startTime;
    console.log(`Latencia: ${latency}ms`);
  });
  
  // Verificar el ID del socket
  console.log('ID del socket:', socket.id);
}

// Puedes agregar un botón en tu UI para llamar a esta función
```

## Depuración

Para habilitar los logs de depuración de Socket.IO:

```javascript
// Activar logs de depuración
localStorage.debug = '*';  // Todos los logs
// O específicamente para Socket.IO
localStorage.debug = 'socket.io-client:*';

// Para desactivar
localStorage.debug = '';
```

## Soporte para Dispositivos Móviles

Para asegurar un buen funcionamiento en dispositivos móviles:

1. **Manejo de cambios de conexión**: Implementa manejo para cuando el dispositivo pasa de red celular a WiFi y viceversa
2. **Modo de ahorro de batería**: Considera reducir la frecuencia de ping/pong en modo de ahorro de batería
3. **Reconexión inteligente**: Implementa lógica para reconectar solo cuando la aplicación esté en primer plano

```javascript
// Detectar cuando la app pasa a segundo plano en dispositivos móviles
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // La app está en segundo plano
    console.log('App en segundo plano, pausando conexión WebSocket');
    socket.disconnect();
  } else {
    // La app vuelve a primer plano
    console.log('App en primer plano, restableciendo conexión WebSocket');
    socket.connect();
  }
});
```

## Referencias Adicionales

- [Documentación oficial de Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Ejemplos de Socket.IO](https://socket.io/get-started/chat)
- [Mejores prácticas para Socket.IO](https://socket.io/docs/v4/performance-tuning/) 