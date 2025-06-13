# Módulo de Solicitudes de Canciones (songs-requests)

## Descripción

Este módulo gestiona las solicitudes de canciones realizadas por los clientes en las mesas del bar. Permite crear, consultar, actualizar y eliminar solicitudes de canciones, así como marcar canciones como reproducidas y gestionar la lista de reproducción.

## Estructura de Carpetas y Archivos

```
src/modules/songs-requests/
  ├── controllers/
  │   └── song-requests.controller.ts  # Controlador con endpoints REST
  ├── dto/
  │   ├── create-song-request.dto.ts   # DTO para crear solicitudes
  │   ├── update-song-request.dto.ts   # DTO para actualizar solicitudes
  │   ├── filter-song-request.dto.ts   # DTO para filtrar solicitudes
  │   └── pagination.dto.ts            # DTO para paginación
  ├── entities/
  │   └── song-request.entity.ts       # Entidad para la tabla song_requests
  ├── services/
  │   └── song-requests.service.ts     # Servicios con lógica de negocio
  └── song-requests.module.ts          # Configuración del módulo
```

## Entidad SongRequest

La entidad `SongRequest` representa una solicitud de canción en el sistema y tiene las siguientes propiedades:

| Campo        | Tipo      | Descripción                                    |
|--------------|-----------|------------------------------------------------|
| id           | string    | ID único (UUID) de la solicitud                |
| songName     | string    | Nombre de la canción solicitada                |
| tableId      | string    | ID de la mesa que solicita la canción          |
| table        | Table     | Relación con la entidad Table                  |
| clientId     | string    | ID del cliente que solicita (opcional)         |
| client       | Customer  | Relación con la entidad Customer               |
| isKaraoke    | boolean   | Indica si la canción es para karaoke           |
| isPlayed     | boolean   | Indica si la canción ya fue reproducida        |
| orderInRound | number    | Orden de la canción en la ronda actual         |
| roundNumber  | number    | Número de ronda al que pertenece la canción    |
| createdAt    | Date      | Fecha de creación de la solicitud              |
| updatedAt    | Date      | Fecha de última actualización de la solicitud  |
| isActive     | boolean   | Indica si la solicitud está activa             |

## Endpoints API

### 1. Crear Solicitud de Canción

**Endpoint:** `POST /song-requests`

**Descripción:** Crea una nueva solicitud de canción y la añade a la lista de reproducción.

**Request Body:**
```json
{
  "songName": "Bohemian Rhapsody",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "clientId": "123e4567-e89b-12d3-a456-426614174001", // Opcional
  "isKaraoke": false, // Opcional, default: false
  "isPlayed": false, // Opcional, default: false
  "isActive": true // Opcional, default: true
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "songName": "Bohemian Rhapsody",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "isKaraoke": false,
  "isPlayed": false,
  "orderInRound": 1,
  "roundNumber": 1,
  "isActive": true,
  "createdAt": "2023-05-20T14:30:00Z",
  "updatedAt": "2023-05-20T14:30:00Z"
}
```

**Notas:** 
- El sistema asigna automáticamente el número de ronda y el orden en la ronda.
- El evento de WebSocket `songRequestUpdate` se emite automáticamente para notificar a los clientes conectados sobre la actualización de la lista.

### 2. Obtener Todas las Solicitudes

**Endpoint:** `GET /song-requests`

**Descripción:** Devuelve todas las solicitudes de canciones.

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "songName": "Bohemian Rhapsody",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "table": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Mesa 1",
      "status": "occupied"
    },
    "clientId": "123e4567-e89b-12d3-a456-426614174001",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Juan Pérez"
    },
    "isKaraoke": false,
    "isPlayed": false,
    "orderInRound": 1,
    "roundNumber": 1,
    "isActive": true,
    "createdAt": "2023-05-20T14:30:00Z",
    "updatedAt": "2023-05-20T14:30:00Z"
  },
  // Más solicitudes...
]
```

### 3. Obtener Solicitudes con Paginación y Filtros

**Endpoint:** `GET /song-requests/paginated`

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 10)
- `songName`: Filtrar por nombre de canción
- `tableId`: Filtrar por ID de mesa
- `clientId`: Filtrar por ID de cliente
- `isKaraoke`: Filtrar por estado de karaoke (true/false)
- `isPlayed`: Filtrar por estado de reproducción (true/false)
- `isActive`: Filtrar por estado activo (true/false)

**Ejemplo:** `GET /song-requests/paginated?page=1&limit=10&isPlayed=false&tableId=123e4567-e89b-12d3-a456-426614174000`

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "songName": "Bohemian Rhapsody",
      "tableId": "123e4567-e89b-12d3-a456-426614174000",
      "table": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Mesa 1",
        "status": "occupied"
      },
      "clientId": "123e4567-e89b-12d3-a456-426614174001",
      "client": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Juan Pérez"
      },
      "isKaraoke": false,
      "isPlayed": false,
      "orderInRound": 1,
      "roundNumber": 1,
      "isActive": true,
      "createdAt": "2023-05-20T14:30:00Z",
      "updatedAt": "2023-05-20T14:30:00Z"
    }
    // Más solicitudes...
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### 4. Obtener Solicitud por ID

**Endpoint:** `GET /song-requests/:id`

**Descripción:** Devuelve una solicitud de canción específica por su ID.

**Ejemplo:** `GET /song-requests/123e4567-e89b-12d3-a456-426614174002`

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "songName": "Bohemian Rhapsody",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "table": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Mesa 1",
    "status": "occupied"
  },
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Juan Pérez"
  },
  "isKaraoke": false,
  "isPlayed": false,
  "orderInRound": 1,
  "roundNumber": 1,
  "isActive": true,
  "createdAt": "2023-05-20T14:30:00Z",
  "updatedAt": "2023-05-20T14:30:00Z"
}
```

### 5. Obtener Solicitudes Activas por Mesa

**Endpoint:** `GET /song-requests/table/:tableId`

**Descripción:** Devuelve todas las solicitudes de canciones activas para una mesa específica.

**Ejemplo:** `GET /song-requests/table/123e4567-e89b-12d3-a456-426614174000`

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "songName": "Bohemian Rhapsody",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "table": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Mesa 1",
      "status": "occupied"
    },
    "clientId": "123e4567-e89b-12d3-a456-426614174001",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Juan Pérez"
    },
    "isKaraoke": false,
    "isPlayed": false,
    "orderInRound": 1,
    "roundNumber": 1,
    "isActive": true,
    "createdAt": "2023-05-20T14:30:00Z",
    "updatedAt": "2023-05-20T14:30:00Z"
  },
  // Más solicitudes de esa mesa...
]
```

### 6. Actualizar Solicitud de Canción

**Endpoint:** `PATCH /song-requests/:id`

**Descripción:** Actualiza una solicitud de canción existente.

**Request Body:** (todos los campos son opcionales)
```json
{
  "songName": "Bohemian Rhapsody - Queen",
  "isKaraoke": true,
  "isPlayed": false,
  "isActive": true
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "songName": "Bohemian Rhapsody - Queen",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "isKaraoke": true,
  "isPlayed": false,
  "orderInRound": 1,
  "roundNumber": 1,
  "isActive": true,
  "createdAt": "2023-05-20T14:30:00Z",
  "updatedAt": "2023-05-20T14:35:00Z"
}
```

**Notas:** El evento de WebSocket `songRequestUpdate` se emite automáticamente.

### 7. Marcar Canción como Reproducida

**Endpoint:** `PATCH /song-requests/:id/mark-played`

**Descripción:** Marca una solicitud de canción como reproducida.

**Ejemplo:** `PATCH /song-requests/123e4567-e89b-12d3-a456-426614174002/mark-played`

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "songName": "Bohemian Rhapsody",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "isKaraoke": false,
  "isPlayed": true,
  "orderInRound": 1,
  "roundNumber": 1,
  "isActive": true,
  "createdAt": "2023-05-20T14:30:00Z",
  "updatedAt": "2023-05-20T14:40:00Z"
}
```

**Notas:** El evento de WebSocket `songRequestUpdate` se emite automáticamente.

### 8. Desactivar Todas las Solicitudes de una Mesa

**Endpoint:** `DELETE /song-requests/table/:tableId`

**Descripción:** Desactiva todas las solicitudes de canciones para una mesa específica.

**Ejemplo:** `DELETE /song-requests/table/123e4567-e89b-12d3-a456-426614174000`

**Response:** `204 No Content`

**Notas:** 
- Esta operación no elimina las solicitudes, solo las marca como inactivas.
- El evento de WebSocket `songRequestUpdate` se emite automáticamente.

### 9. Eliminar Solicitud de Canción

**Endpoint:** `DELETE /song-requests/:id`

**Descripción:** Elimina permanentemente una solicitud de canción.

**Ejemplo:** `DELETE /song-requests/123e4567-e89b-12d3-a456-426614174002`

**Response:** `204 No Content`

**Notas:** El evento de WebSocket `songRequestUpdate` se emite automáticamente.

## Integración con WebSockets

El módulo de solicitudes de canciones está integrado con WebSockets para proporcionar actualizaciones en tiempo real:

1. **Evento emitido:** `songRequestUpdate`
2. **Datos emitidos:** Lista actualizada de solicitudes de canciones activas para una mesa específica
3. **Formato del evento:**
   ```json
   {
     "tableId": "123e4567-e89b-12d3-a456-426614174000",
     "songRequests": [
       {
         "id": "123e4567-e89b-12d3-a456-426614174002",
         "songName": "Bohemian Rhapsody",
         "tableId": "123e4567-e89b-12d3-a456-426614174000",
         "clientId": "123e4567-e89b-12d3-a456-426614174001",
         "isKaraoke": false,
         "isPlayed": false,
         "orderInRound": 1,
         "roundNumber": 1,
         "isActive": true,
         "createdAt": "2023-05-20T14:30:00Z",
         "updatedAt": "2023-05-20T14:30:00Z"
       }
       // Más solicitudes...
     ]
   }
   ```

## Algoritmo de Rondas

El módulo implementa un sistema de rondas para garantizar que todas las mesas tengan la oportunidad de reproducir sus canciones:

1. **Ronda inicial:** Cuando se crea la primera solicitud de canción para una mesa, se asigna a la ronda 1 con orden 1.
2. **Solicitudes adicionales:** Las solicitudes adicionales para la misma mesa se asignan a la misma ronda con un orden incrementado.
3. **Orden de reproducción:** Las canciones se ordenan primero por número de ronda, luego por orden dentro de la ronda y finalmente por fecha de creación.

Este sistema garantiza que cada mesa pueda reproducir una canción antes de que cualquier mesa pueda reproducir su segunda canción.

## Ejemplo de Uso (Flujo Típico)

1. **Cliente solicita una canción:**
   ```http
   POST /song-requests
   {
     "songName": "Bohemian Rhapsody",
     "tableId": "123e4567-e89b-12d3-a456-426614174000",
     "clientId": "123e4567-e89b-12d3-a456-426614174001",
     "isKaraoke": false
   }
   ```

2. **Administrador consulta la lista de canciones pendientes:**
   ```http
   GET /song-requests/paginated?isPlayed=false&isActive=true
   ```

3. **Administrador marca una canción como reproducida:**
   ```http
   PATCH /song-requests/123e4567-e89b-12d3-a456-426614174002/mark-played
   ```

4. **Al cerrar una mesa, se desactivan todas sus solicitudes:**
   ```http
   DELETE /song-requests/table/123e4567-e89b-12d3-a456-426614174000
   ``` 