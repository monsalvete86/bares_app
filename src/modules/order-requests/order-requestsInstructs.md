# Módulo de Solicitudes de Órdenes

Este módulo permite gestionar las solicitudes de órdenes que realizan los clientes antes de que sean confirmadas como órdenes finales. Cada solicitud está vinculada a una mesa específica y opcionalmente a un cliente registrado.

## Estructura del Módulo

```
src/modules/order-requests/
  ├── controllers/               # Controladores REST
  │   ├── order-requests.controller.ts    # Endpoints para solicitudes de órdenes
  │   └── order-request-items.controller.ts # Endpoints para items de solicitudes
  ├── dto/                       # Objetos de transferencia de datos
  │   ├── create-order-request.dto.ts     # DTO para crear solicitudes
  │   ├── create-order-request-item.dto.ts # DTO para crear items
  │   ├── update-order-request.dto.ts     # DTO para actualizar solicitudes
  │   ├── update-order-request-item.dto.ts # DTO para actualizar items
  │   ├── filter-order-request.dto.ts     # DTO para filtrar solicitudes
  │   ├── filter-order-request-item.dto.ts # DTO para filtrar items
  │   └── pagination.dto.ts                # DTO para paginación
  ├── entities/                  # Entidades de la base de datos
  │   ├── order-request.entity.ts         # Entidad de solicitud de orden
  │   └── order-request-item.entity.ts     # Entidad de ítem de solicitud
  ├── services/                  # Servicios con lógica de negocio
  │   ├── order-requests.service.ts       # Servicio para gestionar solicitudes
  │   └── order-request-items.service.ts   # Servicio para gestionar items
  └── order-requests.module.ts   # Módulo principal
```

## Solicitudes de Órdenes (Order Requests)

### Crear una nueva solicitud de orden

**Endpoint:** `POST /order-requests`

**Descripción:** Crea una nueva solicitud de orden vinculada a una mesa con productos opcionales.

**Cuerpo de la solicitud:**

```json
{
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "clientId": "123e4567-e89b-12d3-a456-426614174001", // Opcional
  "items": [
    {
      "productId": "123e4567-e89b-12d3-a456-426614174002",
      "quantity": 2,
      "unitPrice": 10.99
    },
    {
      "productId": "123e4567-e89b-12d3-a456-426614174003",
      "quantity": 1,
      "unitPrice": 8.50
    }
  ]
}
```

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "table": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "number": 1,
    "capacity": 4,
    "status": "occupied",
    "isActive": true,
    "createdAt": "2023-01-01T10:00:00Z",
    "updatedAt": "2023-01-01T11:00:00Z"
  },
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Juan Pérez",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "isActive": true,
    "createdAt": "2023-01-01T10:30:00Z",
    "updatedAt": "2023-01-01T10:30:00Z"
  },
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174005",
      "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
      "productId": "123e4567-e89b-12d3-a456-426614174002",
      "product": {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Hamburguesa",
        "description": "Hamburguesa con queso",
        "price": 10.99,
        "stock": 50,
        "type": "food",
        "isActive": true,
        "createdAt": "2023-01-01T09:00:00Z",
        "updatedAt": "2023-01-01T09:00:00Z"
      },
      "quantity": 2,
      "unitPrice": 10.99,
      "subtotal": 21.98,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174006",
      "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
      "productId": "123e4567-e89b-12d3-a456-426614174003",
      "product": {
        "id": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Refresco",
        "description": "Refresco de cola",
        "price": 8.50,
        "stock": 100,
        "type": "beverage",
        "isActive": true,
        "createdAt": "2023-01-01T09:00:00Z",
        "updatedAt": "2023-01-01T09:00:00Z"
      },
      "quantity": 1,
      "unitPrice": 8.50,
      "subtotal": 8.50,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    }
  ],
  "total": 30.48,
  "isCompleted": false,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Obtener todas las solicitudes de órdenes

**Endpoint:** `GET /order-requests`

**Descripción:** Obtiene todas las solicitudes de órdenes registradas en el sistema.

**Respuesta:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "table": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "number": 1,
      "capacity": 4,
      "status": "occupied",
      "isActive": true,
      "createdAt": "2023-01-01T10:00:00Z",
      "updatedAt": "2023-01-01T11:00:00Z"
    },
    "clientId": "123e4567-e89b-12d3-a456-426614174001",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Juan Pérez",
      "tableId": "123e4567-e89b-12d3-a456-426614174000",
      "isActive": true,
      "createdAt": "2023-01-01T10:30:00Z",
      "updatedAt": "2023-01-01T10:30:00Z"
    },
    "items": [
      // Items de la solicitud (similar al ejemplo anterior)
    ],
    "total": 30.48,
    "isCompleted": false,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  },
  // ... más solicitudes
]
```

### Obtener solicitudes de órdenes paginadas con filtros

**Endpoint:** `GET /order-requests/paginated`

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Límite de registros por página (por defecto: 10)
- `tableId` (opcional): Filtrar por ID de mesa
- `clientId` (opcional): Filtrar por ID de cliente
- `createdFrom` (opcional): Filtrar por fecha de creación (desde) - Formato: YYYY-MM-DD
- `createdTo` (opcional): Filtrar por fecha de creación (hasta) - Formato: YYYY-MM-DD
- `isCompleted` (opcional): Filtrar por estado completado (valores: true, false)

**Ejemplo de solicitud:** `GET /order-requests/paginated?page=1&limit=10&isCompleted=false&tableId=123e4567-e89b-12d3-a456-426614174000`

**Respuesta:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174004",
      "tableId": "123e4567-e89b-12d3-a456-426614174000",
      "table": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "number": 1,
        "capacity": 4,
        "status": "occupied",
        "isActive": true,
        "createdAt": "2023-01-01T10:00:00Z",
        "updatedAt": "2023-01-01T11:00:00Z"
      },
      "clientId": "123e4567-e89b-12d3-a456-426614174001",
      "client": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Juan Pérez",
        "tableId": "123e4567-e89b-12d3-a456-426614174000",
        "isActive": true,
        "createdAt": "2023-01-01T10:30:00Z",
        "updatedAt": "2023-01-01T10:30:00Z"
      },
      "items": [
        // Items de la solicitud
      ],
      "total": 30.48,
      "isCompleted": false,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    },
    // ... más solicitudes
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### Obtener una solicitud de orden por ID

**Endpoint:** `GET /order-requests/:id`

**Descripción:** Obtiene una solicitud de orden específica por su ID.

**Ejemplo de solicitud:** `GET /order-requests/123e4567-e89b-12d3-a456-426614174004`

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "table": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "number": 1,
    "capacity": 4,
    "status": "occupied",
    "isActive": true,
    "createdAt": "2023-01-01T10:00:00Z",
    "updatedAt": "2023-01-01T11:00:00Z"
  },
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Juan Pérez",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "isActive": true,
    "createdAt": "2023-01-01T10:30:00Z",
    "updatedAt": "2023-01-01T10:30:00Z"
  },
  "items": [
    // Items de la solicitud
  ],
  "total": 30.48,
  "isCompleted": false,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Actualizar una solicitud de orden

**Endpoint:** `PATCH /order-requests/:id`

**Descripción:** Actualiza los datos de una solicitud de orden existente.

**Cuerpo de la solicitud:**

```json
{
  "clientId": "123e4567-e89b-12d3-a456-426614174007" // Actualizar cliente
}
```

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "table": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "number": 1,
    "capacity": 4,
    "status": "occupied",
    "isActive": true,
    "createdAt": "2023-01-01T10:00:00Z",
    "updatedAt": "2023-01-01T11:00:00Z"
  },
  "clientId": "123e4567-e89b-12d3-a456-426614174007",
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174007",
    "name": "María López",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "isActive": true,
    "createdAt": "2023-01-01T10:30:00Z",
    "updatedAt": "2023-01-01T10:30:00Z"
  },
  "items": [
    // Items de la solicitud
  ],
  "total": 30.48,
  "isCompleted": false,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:30:00Z"
}
```

### Marcar una solicitud de orden como completada

**Endpoint:** `PATCH /order-requests/:id/complete`

**Descripción:** Marca una solicitud de orden como completada, lo que permite su transformación a una orden final.

**Ejemplo de solicitud:** `PATCH /order-requests/123e4567-e89b-12d3-a456-426614174004/complete`

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "tableId": "123e4567-e89b-12d3-a456-426614174000",
  "table": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "number": 1,
    "capacity": 4,
    "status": "occupied",
    "isActive": true,
    "createdAt": "2023-01-01T10:00:00Z",
    "updatedAt": "2023-01-01T11:00:00Z"
  },
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Juan Pérez",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "isActive": true,
    "createdAt": "2023-01-01T10:30:00Z",
    "updatedAt": "2023-01-01T10:30:00Z"
  },
  "items": [
    // Items de la solicitud
  ],
  "total": 30.48,
  "isCompleted": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T13:00:00Z"
}
```

### Aceptar una solicitud de orden y convertirla en una orden

**Endpoint:** `PATCH /order-requests/:id/accept`

**Descripción:** Acepta una solicitud de orden, la marca como completada y crea automáticamente una nueva orden con los mismos productos y cantidades. Este endpoint combina la funcionalidad de completar una solicitud con la creación de una orden final, facilitando el flujo de trabajo.

**Ejemplo de solicitud:** `PATCH /order-requests/123e4567-e89b-12d3-a456-426614174004/accept`

**Respuesta:**

```json
{
  "orderRequest": {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "table": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "number": 1,
      "capacity": 4,
      "status": "occupied",
      "isActive": true,
      "createdAt": "2023-01-01T10:00:00Z",
      "updatedAt": "2023-01-01T11:00:00Z"
    },
    "clientId": "123e4567-e89b-12d3-a456-426614174001",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Juan Pérez",
      "tableId": "123e4567-e89b-12d3-a456-426614174000",
      "isActive": true,
      "createdAt": "2023-01-01T10:30:00Z",
      "updatedAt": "2023-01-01T10:30:00Z"
    },
    "items": [
      // Items de la solicitud
    ],
    "total": 30.48,
    "isCompleted": true,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T13:00:00Z"
  },
  "order": {
    "id": "123e4567-e89b-12d3-a456-426614174100",
    "tableId": "123e4567-e89b-12d3-a456-426614174000",
    "table": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "number": 1,
      "capacity": 4,
      "status": "occupied",
      "isActive": true,
      "createdAt": "2023-01-01T10:00:00Z",
      "updatedAt": "2023-01-01T11:00:00Z"
    },
    "clientId": "123e4567-e89b-12d3-a456-426614174001",
    "client": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Juan Pérez",
      "tableId": "123e4567-e89b-12d3-a456-426614174000",
      "isActive": true,
      "createdAt": "2023-01-01T10:30:00Z",
      "updatedAt": "2023-01-01T10:30:00Z"
    },
    "groupedItems": [
      {
        "productId": "123e4567-e89b-12d3-a456-426614174002",
        "product": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "name": "Hamburguesa",
          "description": "Hamburguesa con queso",
          "price": 10.99,
          "stock": 50,
          "type": "food",
          "isActive": true,
          "createdAt": "2023-01-01T09:00:00Z",
          "updatedAt": "2023-01-01T09:00:00Z"
        },
        "totalQuantity": 2,
        "unitPrice": 10.99,
        "subtotal": 21.98,
        "itemIds": ["123e4567-e89b-12d3-a456-426614174105"]
      },
      {
        "productId": "123e4567-e89b-12d3-a456-426614174003",
        "product": {
          "id": "123e4567-e89b-12d3-a456-426614174003",
          "name": "Refresco",
          "description": "Refresco de cola",
          "price": 8.50,
          "stock": 100,
          "type": "beverage",
          "isActive": true,
          "createdAt": "2023-01-01T09:00:00Z",
          "updatedAt": "2023-01-01T09:00:00Z"
        },
        "totalQuantity": 1,
        "unitPrice": 8.50,
        "subtotal": 8.50,
        "itemIds": ["123e4567-e89b-12d3-a456-426614174106"]
      }
    ],
    "total": 30.48,
    "status": "processing",
    "isActive": true,
    "createdAt": "2023-01-01T13:00:00Z",
    "updatedAt": "2023-01-01T13:00:00Z"
  }
}
```

**Notas:**
1. El estado inicial de la orden creada es `processing`, indicando que está siendo preparada.
2. Los `groupedItems` en la respuesta de la orden representan los productos agrupados por tipo (a diferencia de los items individuales en la solicitud).
3. Este endpoint simplifica el flujo de trabajo al realizar dos operaciones en una sola llamada:
   - Marcar la solicitud como completada
   - Crear una nueva orden en base a la solicitud

### Eliminar una solicitud de orden

**Endpoint:** `DELETE /order-requests/:id`

**Descripción:** Elimina una solicitud de orden del sistema.

**Ejemplo de solicitud:** `DELETE /order-requests/123e4567-e89b-12d3-a456-426614174004`

**Respuesta:** HTTP 200 OK (sin cuerpo de respuesta)

## Items de Solicitudes de Órdenes (Order Request Items)

### Añadir un item a una solicitud de orden

**Endpoint:** `POST /order-requests/:orderRequestId/items`

**Descripción:** Añade un nuevo producto a una solicitud de orden existente.

**Ejemplo de solicitud:** `POST /order-requests/123e4567-e89b-12d3-a456-426614174004/items`

**Cuerpo de la solicitud:**

```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174008",
  "quantity": 3,
  "unitPrice": 15.99
}
```

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174009",
  "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174008",
  "product": {
    "id": "123e4567-e89b-12d3-a456-426614174008",
    "name": "Ensalada",
    "description": "Ensalada mixta",
    "price": 15.99,
    "stock": 20,
    "type": "food",
    "isActive": true,
    "createdAt": "2023-01-01T09:00:00Z",
    "updatedAt": "2023-01-01T09:00:00Z"
  },
  "quantity": 3,
  "unitPrice": 15.99,
  "subtotal": 47.97,
  "createdAt": "2023-01-01T13:00:00Z",
  "updatedAt": "2023-01-01T13:00:00Z"
}
```

### Obtener todos los items de una solicitud de orden

**Endpoint:** `GET /order-requests/:orderRequestId/items`

**Descripción:** Obtiene todos los items/productos de una solicitud de orden específica.

**Ejemplo de solicitud:** `GET /order-requests/123e4567-e89b-12d3-a456-426614174004/items`

**Respuesta:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
    "productId": "123e4567-e89b-12d3-a456-426614174002",
    "product": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Hamburguesa",
      "description": "Hamburguesa con queso",
      "price": 10.99,
      "stock": 50,
      "type": "food",
      "isActive": true,
      "createdAt": "2023-01-01T09:00:00Z",
      "updatedAt": "2023-01-01T09:00:00Z"
    },
    "quantity": 2,
    "unitPrice": 10.99,
    "subtotal": 21.98,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
    "productId": "123e4567-e89b-12d3-a456-426614174003",
    "product": {
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "name": "Refresco",
      "description": "Refresco de cola",
      "price": 8.50,
      "stock": 100,
      "type": "beverage",
      "isActive": true,
      "createdAt": "2023-01-01T09:00:00Z",
      "updatedAt": "2023-01-01T09:00:00Z"
    },
    "quantity": 1,
    "unitPrice": 8.50,
    "subtotal": 8.50,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
]
```

### Obtener items de una solicitud de orden con paginación y filtros

**Endpoint:** `GET /order-requests/:orderRequestId/items/paginated`

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Límite de registros por página (por defecto: 10)
- `productId` (opcional): Filtrar por ID de producto
- `minQuantity` (opcional): Filtrar por cantidad mínima
- `maxQuantity` (opcional): Filtrar por cantidad máxima
- `minUnitPrice` (opcional): Filtrar por precio unitario mínimo
- `maxUnitPrice` (opcional): Filtrar por precio unitario máximo

**Ejemplo de solicitud:** `GET /order-requests/123e4567-e89b-12d3-a456-426614174004/items/paginated?page=1&limit=10&minQuantity=2`

**Respuesta:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174005",
      "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
      "productId": "123e4567-e89b-12d3-a456-426614174002",
      "product": {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Hamburguesa",
        "description": "Hamburguesa con queso",
        "price": 10.99,
        "stock": 50,
        "type": "food",
        "isActive": true,
        "createdAt": "2023-01-01T09:00:00Z",
        "updatedAt": "2023-01-01T09:00:00Z"
      },
      "quantity": 2,
      "unitPrice": 10.99,
      "subtotal": 21.98,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Obtener un item específico de una solicitud de orden

**Endpoint:** `GET /order-requests/:orderRequestId/items/:id`

**Descripción:** Obtiene un item específico de una solicitud de orden por su ID.

**Ejemplo de solicitud:** `GET /order-requests/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174002",
  "product": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Hamburguesa",
    "description": "Hamburguesa con queso",
    "price": 10.99,
    "stock": 50,
    "type": "food",
    "isActive": true,
    "createdAt": "2023-01-01T09:00:00Z",
    "updatedAt": "2023-01-01T09:00:00Z"
  },
  "quantity": 2,
  "unitPrice": 10.99,
  "subtotal": 21.98,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Actualizar un item de una solicitud de orden

**Endpoint:** `PATCH /order-requests/:orderRequestId/items/:id`

**Descripción:** Actualiza un item existente en una solicitud de orden.

**Ejemplo de solicitud:** `PATCH /order-requests/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

**Cuerpo de la solicitud:**

```json
{
  "quantity": 4, // Actualizar cantidad
  "unitPrice": 9.99 // Actualizar precio
}
```

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "orderRequestId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174002",
  "product": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Hamburguesa",
    "description": "Hamburguesa con queso",
    "price": 10.99,
    "stock": 50,
    "type": "food",
    "isActive": true,
    "createdAt": "2023-01-01T09:00:00Z",
    "updatedAt": "2023-01-01T09:00:00Z"
  },
  "quantity": 4,
  "unitPrice": 9.99,
  "subtotal": 39.96,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T14:00:00Z"
}
```

### Eliminar un item de una solicitud de orden

**Endpoint:** `DELETE /order-requests/:orderRequestId/items/:id`

**Descripción:** Elimina un item específico de una solicitud de orden.

**Ejemplo de solicitud:** `DELETE /order-requests/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

**Respuesta:** HTTP 200 OK (sin cuerpo de respuesta)

## Diferencias con el módulo de Órdenes

Las solicitudes de órdenes (order-requests) son pedidos preliminares que hacen los clientes y que luego pueden convertirse en órdenes finales. Las principales diferencias son:

1. Las solicitudes de órdenes tienen un estado `isCompleted` que indica si han sido procesadas.
2. Las órdenes finales tienen un estado más complejo (`pending`, `completed`, `cancelled`, `processing`).
3. El endpoint `PATCH /order-requests/:id/complete` permite marcar una solicitud como completada, lo que normalmente implica su conversión a una orden final.
4. Las solicitudes de órdenes son más simples y no contienen la agrupación de items por producto que tienen las órdenes finales.

Este módulo es esencial para el flujo de trabajo donde los clientes solicitan productos y el personal del bar/restaurante revisa estas solicitudes antes de confirmarlas como órdenes finales. 