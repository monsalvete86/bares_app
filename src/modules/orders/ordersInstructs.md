# Módulo de Órdenes

Este módulo permite gestionar las órdenes o pedidos del negocio, incluyendo todos los productos solicitados. Cada orden está vinculada a una mesa específica y opcionalmente a un cliente registrado.

## Órdenes (Orders)

### Crear una nueva orden

**Endpoint:** `POST /orders`

**Descripción:** Crea una nueva orden vinculada a una mesa con productos opcionales.

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
  ],
  "status": "pending" // Opcional, valores: "pending", "completed", "cancelled", "processing"
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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174005"]
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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174006"]
    }
  ],
  "total": 30.48,
  "status": "pending",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z",
  "isActive": true
}
```

### Obtener todas las órdenes

**Endpoint:** `GET /orders`

**Descripción:** Obtiene todas las órdenes registradas en el sistema, incluyendo información completa del cliente y los productos agrupados.

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
        "itemIds": ["123e4567-e89b-12d3-a456-426614174005"]
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
        "itemIds": ["123e4567-e89b-12d3-a456-426614174006"]
      }
    ],
    "total": 30.48,
    "status": "pending",
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z",
    "isActive": true
  },
  // ... más órdenes
]
```

### Obtener órdenes paginadas con filtros

**Endpoint:** `GET /orders/paginated`

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Límite de registros por página (por defecto: 10)
- `tableId` (opcional): Filtrar por ID de mesa
- `clientId` (opcional): Filtrar por ID de cliente
- `status` (opcional): Filtrar por estado de la orden (valores: "pending", "completed", "cancelled", "processing")
- `createdFrom` (opcional): Filtrar por fecha de creación (desde) - Formato: YYYY-MM-DD
- `createdTo` (opcional): Filtrar por fecha de creación (hasta) - Formato: YYYY-MM-DD
- `isActive` (opcional): Filtrar por estado activo/inactivo (valores: true, false)

**Ejemplo de solicitud:** `GET /orders/paginated?page=1&limit=10&status=pending&tableId=123e4567-e89b-12d3-a456-426614174000`

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
          "itemIds": ["123e4567-e89b-12d3-a456-426614174005"]
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
          "itemIds": ["123e4567-e89b-12d3-a456-426614174006"]
        }
      ],
      "total": 30.48,
      "status": "pending",
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z",
      "isActive": true
    },
    // ... más órdenes
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### Obtener una orden por ID

**Endpoint:** `GET /orders/:id`

**Descripción:** Obtiene una orden específica por su ID, incluyendo la información completa del cliente y los productos agrupados.

**Ejemplo de solicitud:** `GET /orders/123e4567-e89b-12d3-a456-426614174004`

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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174005"]
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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174006"]
    }
  ],
  "total": 30.48,
  "status": "pending",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z",
  "isActive": true
}
```

### Actualizar una orden

**Endpoint:** `PATCH /orders/:id`

**Descripción:** Actualiza los datos de una orden existente.

**Cuerpo de la solicitud:**

```json
{
  "clientId": "123e4567-e89b-12d3-a456-426614174007", // Actualizar cliente
  "status": "completed", // Actualizar estado
  "isActive": false // Desactivar orden
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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174005"]
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
      "itemIds": ["123e4567-e89b-12d3-a456-426614174006"]
    }
  ],
  "total": 30.48,
  "status": "completed",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:30:00Z",
  "isActive": false
}
```

### Eliminar una orden

**Endpoint:** `DELETE /orders/:id`

**Descripción:** Elimina una orden del sistema.

**Ejemplo de solicitud:** `DELETE /orders/123e4567-e89b-12d3-a456-426614174004`

**Respuesta:** HTTP 200 OK (sin cuerpo de respuesta)

## Items de Órdenes (Order Items)

### Añadir un item a una orden

**Endpoint:** `POST /orders/:orderId/items`

**Descripción:** Añade un nuevo producto a una orden existente.

**Ejemplo de solicitud:** `POST /orders/123e4567-e89b-12d3-a456-426614174004/items`

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
  "orderId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174008",
  "quantity": 3,
  "unitPrice": 15.99,
  "subtotal": 47.97,
  "createdAt": "2023-01-01T13:00:00Z",
  "updatedAt": "2023-01-01T13:00:00Z"
}
```

### Obtener todos los items de una orden

**Endpoint:** `GET /orders/:orderId/items`

**Descripción:** Obtiene todos los items/productos de una orden específica.

**Ejemplo de solicitud:** `GET /orders/123e4567-e89b-12d3-a456-426614174004/items`

**Respuesta:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "orderId": "123e4567-e89b-12d3-a456-426614174004",
    "productId": "123e4567-e89b-12d3-a456-426614174002",
    "quantity": 2,
    "unitPrice": 10.99,
    "subtotal": 21.98,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "orderId": "123e4567-e89b-12d3-a456-426614174004",
    "productId": "123e4567-e89b-12d3-a456-426614174003",
    "quantity": 1,
    "unitPrice": 8.50,
    "subtotal": 8.50,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174009",
    "orderId": "123e4567-e89b-12d3-a456-426614174004",
    "productId": "123e4567-e89b-12d3-a456-426614174008",
    "quantity": 3,
    "unitPrice": 15.99,
    "subtotal": 47.97,
    "createdAt": "2023-01-01T13:00:00Z",
    "updatedAt": "2023-01-01T13:00:00Z"
  }
]
```

### Obtener items de una orden con paginación y filtros

**Endpoint:** `GET /orders/:orderId/items/paginated`

**Parámetros de consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Límite de registros por página (por defecto: 10)
- `productId` (opcional): Filtrar por ID de producto
- `minQuantity` (opcional): Filtrar por cantidad mínima
- `maxQuantity` (opcional): Filtrar por cantidad máxima
- `minUnitPrice` (opcional): Filtrar por precio unitario mínimo
- `maxUnitPrice` (opcional): Filtrar por precio unitario máximo

**Ejemplo de solicitud:** `GET /orders/123e4567-e89b-12d3-a456-426614174004/items/paginated?page=1&limit=10&minQuantity=2`

**Respuesta:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174005",
      "orderId": "123e4567-e89b-12d3-a456-426614174004",
      "productId": "123e4567-e89b-12d3-a456-426614174002",
      "quantity": 2,
      "unitPrice": 10.99,
      "subtotal": 21.98,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174009",
      "orderId": "123e4567-e89b-12d3-a456-426614174004",
      "productId": "123e4567-e89b-12d3-a456-426614174008",
      "quantity": 3,
      "unitPrice": 15.99,
      "subtotal": 47.97,
      "createdAt": "2023-01-01T13:00:00Z",
      "updatedAt": "2023-01-01T13:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

### Obtener un item específico de una orden

**Endpoint:** `GET /orders/:orderId/items/:id`

**Descripción:** Obtiene un item específico de una orden por su ID.

**Ejemplo de solicitud:** `GET /orders/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

**Respuesta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "orderId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174002",
  "quantity": 2,
  "unitPrice": 10.99,
  "subtotal": 21.98,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

### Actualizar un item de una orden

**Endpoint:** `PATCH /orders/:orderId/items/:id`

**Descripción:** Actualiza un item existente en una orden.

**Ejemplo de solicitud:** `PATCH /orders/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

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
  "orderId": "123e4567-e89b-12d3-a456-426614174004",
  "productId": "123e4567-e89b-12d3-a456-426614174002",
  "quantity": 4,
  "unitPrice": 9.99,
  "subtotal": 39.96,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T14:00:00Z"
}
```

### Eliminar un item de una orden

**Endpoint:** `DELETE /orders/:orderId/items/:id`

**Descripción:** Elimina un item específico de una orden.

**Ejemplo de solicitud:** `DELETE /orders/123e4567-e89b-12d3-a456-426614174004/items/123e4567-e89b-12d3-a456-426614174005`

**Respuesta:** HTTP 200 OK (sin cuerpo de respuesta) 