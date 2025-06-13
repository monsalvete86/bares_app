# Módulo de Clientes (customers)

## Descripción

Este módulo permite gestionar los clientes del bar/restaurante. Cada cliente está asociado a una mesa específica y puede tener órdenes, solicitudes de órdenes y solicitudes de canciones.

## Estructura de Carpetas y Archivos

```
src/modules/customers/
├── controllers/
│   └── customers.controller.ts  # Controlador con endpoints REST
├── dto/
│   ├── create-customer.dto.ts   # DTO para crear clientes
│   ├── filter-customer.dto.ts   # DTO para filtrar clientes
│   ├── pagination.dto.ts        # DTO para paginación
│   └── update-customer.dto.ts   # DTO para actualizar clientes
├── entities/
│   └── customer.entity.ts       # Entidad Cliente para la base de datos
├── services/
│   └── customers.service.ts     # Servicios con lógica de negocio
└── customers.module.ts          # Configuración del módulo
```

## Entidad Customer

La entidad `Customer` tiene las siguientes propiedades:

- `id`: Identificador único del cliente (UUID)
- `name`: Nombre del cliente
- `tableId`: ID de la mesa asociada al cliente
- `table`: Relación con la entidad Mesa
- `orders`: Relación con las órdenes del cliente
- `orderRequests`: Relación con las solicitudes de órdenes
- `songRequests`: Relación con las solicitudes de canciones
- `isActive`: Indica si el cliente está activo (booleano)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

## Endpoints

### 1. Crear un nuevo cliente

**Endpoint**: `POST /customers`

**Autenticación requerida**: JWT (Bearer Token)

**Payload**:

```json
{
  "name": "Juan Pérez",
  "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "isActive": true
}
```

**Respuesta exitosa** (201 Created):

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "isActive": true,
  "createdAt": "2023-05-15T14:30:00.000Z",
  "updatedAt": "2023-05-15T14:30:00.000Z",
  "table": {
    "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "number": 1,
    "description": "Mesa interior",
    "isOccupied": true,
    "createdAt": "2023-05-10T10:00:00.000Z",
    "updatedAt": "2023-05-15T14:30:00.000Z"
  }
}
```

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado
- 409 Conflict: La mesa especificada no existe

### 2. Obtener todos los clientes

**Endpoint**: `GET /customers`

**Autenticación requerida**: JWT (Bearer Token)

**Respuesta exitosa** (200 OK):

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Juan Pérez",
    "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "isActive": true,
    "createdAt": "2023-05-15T14:30:00.000Z",
    "updatedAt": "2023-05-15T14:30:00.000Z",
    "table": {
      "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "number": 1,
      "description": "Mesa interior",
      "isOccupied": true,
      "createdAt": "2023-05-10T10:00:00.000Z",
      "updatedAt": "2023-05-15T14:30:00.000Z"
    }
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "name": "María García",
    "tableId": "b1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "isActive": true,
    "createdAt": "2023-05-15T15:30:00.000Z",
    "updatedAt": "2023-05-15T15:30:00.000Z",
    "table": {
      "id": "b1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "number": 2,
      "description": "Mesa terraza",
      "isOccupied": true,
      "createdAt": "2023-05-10T10:00:00.000Z",
      "updatedAt": "2023-05-15T15:30:00.000Z"
    }
  }
]
```

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado

### 3. Obtener clientes paginados con filtros

**Endpoint**: `GET /customers/paginated`

**Autenticación requerida**: JWT (Bearer Token)

**Parámetros de consulta**:
- `page`: Número de página (opcional, por defecto: 1)
- `limit`: Límite de registros por página (opcional, por defecto: 10)
- `name`: Filtrar por nombre (opcional)
- `tableId`: Filtrar por ID de mesa (opcional)
- `isActive`: Filtrar por estado (opcional, valores: true/false)

**Ejemplo**: `GET /customers/paginated?page=1&limit=10&name=Juan&isActive=true`

**Respuesta exitosa** (200 OK):

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Juan Pérez",
      "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "isActive": true,
      "createdAt": "2023-05-15T14:30:00.000Z",
      "updatedAt": "2023-05-15T14:30:00.000Z",
      "table": {
        "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        "number": 1,
        "description": "Mesa interior",
        "isOccupied": true,
        "createdAt": "2023-05-10T10:00:00.000Z",
        "updatedAt": "2023-05-15T14:30:00.000Z"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado

### 4. Obtener un cliente por ID

**Endpoint**: `GET /customers/:id`

**Autenticación requerida**: JWT (Bearer Token)

**Ejemplo**: `GET /customers/123e4567-e89b-12d3-a456-426614174000`

**Respuesta exitosa** (200 OK):

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "isActive": true,
  "createdAt": "2023-05-15T14:30:00.000Z",
  "updatedAt": "2023-05-15T14:30:00.000Z",
  "table": {
    "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "number": 1,
    "description": "Mesa interior",
    "isOccupied": true,
    "createdAt": "2023-05-10T10:00:00.000Z",
    "updatedAt": "2023-05-15T14:30:00.000Z"
  }
}
```

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado
- 404 Not Found: Cliente no encontrado

### 5. Actualizar un cliente

**Endpoint**: `PATCH /customers/:id`

**Autenticación requerida**: JWT (Bearer Token)

**Ejemplo**: `PATCH /customers/123e4567-e89b-12d3-a456-426614174000`

**Payload** (campos opcionales):

```json
{
  "name": "Juan Carlos Pérez",
  "tableId": "c1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "isActive": false
}
```

**Respuesta exitosa** (200 OK):

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Carlos Pérez",
  "tableId": "c1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "isActive": false,
  "createdAt": "2023-05-15T14:30:00.000Z",
  "updatedAt": "2023-05-15T16:45:00.000Z",
  "table": {
    "id": "c1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "number": 3,
    "description": "Mesa VIP",
    "isOccupied": true,
    "createdAt": "2023-05-10T10:00:00.000Z",
    "updatedAt": "2023-05-15T16:45:00.000Z"
  }
}
```

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado
- 404 Not Found: Cliente no encontrado
- 409 Conflict: La mesa especificada no existe

### 6. Eliminar un cliente

**Endpoint**: `DELETE /customers/:id`

**Autenticación requerida**: JWT (Bearer Token)

**Ejemplo**: `DELETE /customers/123e4567-e89b-12d3-a456-426614174000`

**Respuesta exitosa** (200 OK): No hay cuerpo de respuesta

**Posibles errores**:
- 401 Unauthorized: Token JWT no válido o expirado
- 404 Not Found: Cliente no encontrado

## Ejemplos de uso con cURL

### Crear un cliente
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Juan Pérez",
    "tableId": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "isActive": true
  }'
```

### Obtener todos los clientes
```bash
curl -X GET http://localhost:3000/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtener clientes paginados con filtros
```bash
curl -X GET "http://localhost:3000/customers/paginated?page=1&limit=10&name=Juan&isActive=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtener un cliente por ID
```bash
curl -X GET http://localhost:3000/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Actualizar un cliente
```bash
curl -X PATCH http://localhost:3000/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Juan Carlos Pérez",
    "tableId": "c1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "isActive": false
  }'
```

### Eliminar un cliente
```bash
curl -X DELETE http://localhost:3000/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
``` 