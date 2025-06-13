# Documentación de Endpoints - Módulo de Mesas (Tables)

Esta documentación proporciona detalles sobre los endpoints disponibles en el módulo de Mesas, incluyendo la estructura de datos necesaria para cada operación y ejemplos de respuestas.

## Endpoints

### 1. Crear nueva mesa

**Endpoint:** `POST /tables`

**Descripción:** Crea una nueva mesa en el sistema.

**Autenticación:** Se requiere token JWT.

**Estructura de la solicitud:**

```json
{
  "number": 1,
  "name": "Mesa VIP",
  "description": "Mesa para eventos especiales",
  "isOccupied": false,
  "isActive": true
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| number | number | Sí | Número de la mesa (mínimo 1) |
| name | string | Sí | Nombre de la mesa |
| description | string | No | Descripción de la mesa |
| isOccupied | boolean | No | Indica si la mesa está ocupada (default: false) |
| isActive | boolean | No | Indica si la mesa está activa (default: true) |

**Ejemplo de respuesta (201 Created):**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "number": 1,
  "name": "Mesa VIP",
  "description": "Mesa para eventos especiales",
  "isOccupied": false,
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### 2. Obtener todas las mesas

**Endpoint:** `GET /tables`

**Descripción:** Retorna una lista de todas las mesas registradas en el sistema.

**Autenticación:** Se requiere token JWT.

**Ejemplo de respuesta (200 OK):**

```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "number": 1,
    "name": "Mesa VIP",
    "description": "Mesa para eventos especiales",
    "isOccupied": false,
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  {
    "id": "22e49f4e-8e6f-4f9a-9a6c-f9b5a5a5a5a5",
    "number": 2,
    "name": "Mesa Regular",
    "description": "Mesa estándar",
    "isOccupied": true,
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
]
```

### 3. Obtener mesas paginadas con filtros

**Endpoint:** `GET /tables/paginated`

**Descripción:** Retorna una lista paginada de mesas con posibilidad de aplicar filtros.

**Autenticación:** Se requiere token JWT.

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | number | No | Número de página (default: 1) |
| limit | number | No | Número de registros por página (default: 10) |
| number | number | No | Filtrar por número de mesa |
| name | string | No | Filtrar por nombre de mesa |
| description | string | No | Filtrar por descripción de mesa |
| isOccupied | boolean | No | Filtrar por estado de ocupación (true/false) |
| isActive | boolean | No | Filtrar por estado activo/inactivo |

**Ejemplo de solicitud:**

```
GET /tables/paginated?page=1&limit=10&isOccupied=true
```

**Ejemplo de respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": "22e49f4e-8e6f-4f9a-9a6c-f9b5a5a5a5a5",
      "number": 2,
      "name": "Mesa Regular",
      "description": "Mesa estándar",
      "isOccupied": true,
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 4. Obtener una mesa por ID

**Endpoint:** `GET /tables/:id`

**Descripción:** Retorna los detalles de una mesa específica por su ID.

**Autenticación:** Se requiere token JWT.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | ID único de la mesa |

**Ejemplo de solicitud:**

```
GET /tables/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Ejemplo de respuesta (200 OK):**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "number": 1,
  "name": "Mesa VIP",
  "description": "Mesa para eventos especiales",
  "isOccupied": false,
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### 5. Obtener detalles completos de una mesa

**Endpoint:** `GET /tables/:id/details`

**Descripción:** Retorna información detallada sobre una mesa específica, incluyendo sus órdenes activas con detalles de productos y clientes, solicitudes de órdenes pendientes y clientes asociados.

**Autenticación:** Se requiere token JWT.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | ID único de la mesa |

**Ejemplo de solicitud:**

```
GET /tables/f47ac10b-58cc-4372-a567-0e02b2c3d479/details
```

**Ejemplo de respuesta (200 OK):**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "number": 1,
  "name": "Mesa Premium",
  "description": "Mesa para eventos VIP",
  "isOccupied": true,
  "isActive": true,
  "customers": [
    {
      "id": "a2b3c4d5-e6f7-8g9h-i0j1-k2l3m4n5o6p7",
      "name": "Juan Pérez",
      "tableId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "isActive": true,
      "createdAt": "2023-01-05T18:30:00Z",
      "updatedAt": "2023-01-05T18:30:00Z"
    }
  ],
  "activeOrders": [
    {
      "id": "b3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
      "client": {
        "id": "a2b3c4d5-e6f7-8g9h-i0j1-k2l3m4n5o6p7",
        "name": "Juan Pérez",
        "tableId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "isActive": true,
        "createdAt": "2023-01-05T18:30:00Z",
        "updatedAt": "2023-01-05T18:30:00Z"
      },
      "items": [
        {
          "id": "c4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9",
          "productId": "d5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0",
          "productName": "Hamburguesa con queso",
          "quantity": 2,
          "unitPrice": 10.99,
          "subtotal": 21.98
        },
        {
          "id": "e6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1",
          "productId": "f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u2",
          "productName": "Refresco cola",
          "quantity": 3,
          "unitPrice": 2.50,
          "subtotal": 7.50
        }
      ],
      "total": 29.48,
      "status": "pending",
      "createdAt": "2023-01-05T18:35:00Z"
    }
  ],
  "pendingOrderRequests": [
    {
      "id": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
      "tableId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "clientId": "a2b3c4d5-e6f7-8g9h-i0j1-k2l3m4n5o6p7",
      "client": {
        "id": "a2b3c4d5-e6f7-8g9h-i0j1-k2l3m4n5o6p7",
        "name": "Juan Pérez",
        "tableId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "isActive": true,
        "createdAt": "2023-01-05T18:30:00Z",
        "updatedAt": "2023-01-05T18:30:00Z"
      },
      "items": [
        {
          "id": "h9i0j1k2-l3m4-n5o6-p7q8-r9s0t1u2v3w4",
          "orderRequestId": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
          "productId": "i0j1k2l3-m4n5-o6p7-q8r9-s0t1u2v3w4x5",
          "product": {
            "id": "i0j1k2l3-m4n5-o6p7-q8r9-s0t1u2v3w4x5",
            "name": "Pastel de chocolate",
            "price": 6.99,
            "description": "Porción de pastel de chocolate",
            "type": "food",
            "isActive": true,
            "stock": 10,
            "createdAt": "2023-01-01T12:00:00Z",
            "updatedAt": "2023-01-01T12:00:00Z"
          },
          "quantity": 1,
          "unitPrice": 6.99,
          "subtotal": 6.99,
          "createdAt": "2023-01-05T19:15:00Z",
          "updatedAt": "2023-01-05T19:15:00Z"
        }
      ],
      "total": 6.99,
      "createdAt": "2023-01-05T19:15:00Z",
      "updatedAt": "2023-01-05T19:15:00Z",
      "isCompleted": false
    }
  ],
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-05T18:20:00Z"
}
```

### 6. Actualizar una mesa

**Endpoint:** `PATCH /tables/:id`

**Descripción:** Actualiza la información de una mesa existente.

**Autenticación:** Se requiere token JWT.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | ID único de la mesa |

**Estructura de la solicitud:**

```json
{
  "name": "Mesa Premium",
  "description": "Mesa actualizada para eventos VIP"
}
```

**Notas:** Todos los campos son opcionales. Solo se actualizarán los campos incluidos en la solicitud.

**Ejemplo de respuesta (200 OK):**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "number": 1,
  "name": "Mesa Premium",
  "description": "Mesa actualizada para eventos VIP",
  "isOccupied": false,
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-05T00:00:00Z"
}
```

### 7. Cambiar estado de ocupación de una mesa

**Endpoint:** `PATCH /tables/:id/occupation`

**Descripción:** Actualiza el estado de ocupación de una mesa.

**Autenticación:** Se requiere token JWT.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | ID único de la mesa |

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| isOccupied | boolean | Sí | Estado de ocupación (true: ocupada, false: disponible) |

**Ejemplo de solicitud:**

```
PATCH /tables/f47ac10b-58cc-4372-a567-0e02b2c3d479/occupation?isOccupied=true
```

**Ejemplo de respuesta (200 OK):**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "number": 1,
  "name": "Mesa Premium",
  "description": "Mesa actualizada para eventos VIP",
  "isOccupied": true,
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-05T00:10:00Z"
}
```

### 8. Eliminar una mesa

**Endpoint:** `DELETE /tables/:id`

**Descripción:** Elimina una mesa del sistema.

**Autenticación:** Se requiere token JWT.

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | ID único de la mesa |

**Ejemplo de solicitud:**

```
DELETE /tables/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Ejemplo de respuesta (200 OK):**

```
// Sin contenido en el cuerpo de la respuesta
```

## Códigos de error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autorizado - Token JWT inválido o expirado |
| 404 | Mesa no encontrada |
| 409 | Ya existe una mesa con el mismo número |

## Uso con autenticación

Todos los endpoints del módulo de mesas requieren autenticación JWT. Para acceder a cualquiera de estos endpoints, se debe incluir un encabezado de autorización con el token JWT:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Para obtener un token JWT, utilice el endpoint de inicio de sesión:

```
POST /auth/login

{
  "username": "usuario",
  "password": "contraseña"
}
``` 