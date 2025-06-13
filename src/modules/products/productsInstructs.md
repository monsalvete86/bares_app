# Módulo de Productos

Este módulo permite la gestión completa de productos del bar o restaurante, incluyendo operaciones CRUD (Crear, Leer, Actualizar y Eliminar).

## Estructura de la Entidad Product

La entidad `Product` contiene la siguiente estructura:

```json
{
  "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
  "name": "Hamburguesa",
  "description": "Hamburguesa con queso y papas fritas",
  "price": 10.99,
  "stock": 50,
  "type": "food",
  "isActive": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

* `id`: Identificador único UUID generado automáticamente
* `name`: Nombre del producto (requerido, único)
* `description`: Descripción del producto (opcional)
* `price`: Precio del producto (requerido, número decimal con máximo 2 decimales)
* `stock`: Cantidad disponible en inventario (opcional, valor por defecto: 0)
* `type`: Tipo de producto (opcional, valores posibles: "food", "beverage", "other", valor por defecto: "other")
* `isActive`: Estado del producto (opcional, valor por defecto: true)
* `createdAt`: Fecha de creación (generada automáticamente)
* `updatedAt`: Fecha de última actualización (generada automáticamente)

## Endpoints

### 1. Crear Producto

**Endpoint:** `POST /products`

**Descripción:** Crea un nuevo producto en el sistema.

**Permisos requeridos:** Autenticación con JWT

**Cuerpo de la solicitud:**

```json
{
  "name": "Hamburguesa",
  "description": "Hamburguesa con queso y papas fritas",
  "price": 10.99,
  "stock": 50,
  "type": "food",
  "isActive": true
}
```

Campos obligatorios:
* `name`: String
* `price`: Number

Campos opcionales:
* `description`: String
* `stock`: Number
* `type`: String (valores permitidos: "food", "beverage", "other")
* `isActive`: Boolean

**Respuesta exitosa (201 Created):**

```json
{
  "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
  "name": "Hamburguesa",
  "description": "Hamburguesa con queso y papas fritas",
  "price": 10.99,
  "stock": 50,
  "type": "food",
  "isActive": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

**Posibles errores:**
* `400 Bad Request`: Datos de entrada inválidos
* `401 Unauthorized`: No autenticado
* `409 Conflict`: Ya existe un producto con este nombre

### 2. Obtener Todos los Productos

**Endpoint:** `GET /products`

**Descripción:** Obtiene la lista completa de productos ordenados por nombre.

**Permisos requeridos:** Autenticación con JWT

**Parámetros:** Ninguno

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
    "name": "Hamburguesa",
    "description": "Hamburguesa con queso y papas fritas",
    "price": 10.99,
    "stock": 50,
    "type": "food",
    "isActive": true,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": "8e6d4c2a-0b9c-8d7e-6f5g-4h3i2j1k0l1m",
    "name": "Refresco",
    "description": "Refresco de cola",
    "price": 2.50,
    "stock": 100,
    "type": "beverage",
    "isActive": true,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
]
```

**Posibles errores:**
* `401 Unauthorized`: No autenticado

### 3. Obtener Productos Paginados con Filtros

**Endpoint:** `GET /products/paginated`

**Descripción:** Obtiene una lista paginada de productos con opciones de filtrado.

**Permisos requeridos:** Autenticación con JWT

**Parámetros de consulta (query params):**
* `page`: Número de página (opcional, predeterminado: 1)
* `limit`: Cantidad de registros por página (opcional, predeterminado: 10)
* `name`: Filtrar por nombre (opcional, búsqueda parcial)
* `description`: Filtrar por descripción (opcional, búsqueda parcial)
* `minPrice`: Filtrar por precio mínimo (opcional)
* `maxPrice`: Filtrar por precio máximo (opcional)
* `minStock`: Filtrar por stock mínimo (opcional)
* `type`: Filtrar por tipo de producto (opcional, valores: "food", "beverage", "other")
* `isActive`: Filtrar por estado (opcional, valores: true, false)

**Ejemplo de solicitud:**
```
GET /products/paginated?page=1&limit=10&name=Hamburguesa&minPrice=5&maxPrice=15&type=food&isActive=true
```

**Respuesta exitosa (200 OK):**

```json
{
  "data": [
    {
      "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
      "name": "Hamburguesa",
      "description": "Hamburguesa con queso y papas fritas",
      "price": 10.99,
      "stock": 50,
      "type": "food",
      "isActive": true,
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

**Posibles errores:**
* `401 Unauthorized`: No autenticado

### 4. Obtener Producto por ID

**Endpoint:** `GET /products/:id`

**Descripción:** Obtiene un producto específico por su ID.

**Permisos requeridos:** Autenticación con JWT

**Parámetros de ruta (path params):**
* `id`: ID del producto a consultar

**Ejemplo de solicitud:**
```
GET /products/9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
  "name": "Hamburguesa",
  "description": "Hamburguesa con queso y papas fritas",
  "price": 10.99,
  "stock": 50,
  "type": "food",
  "isActive": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

**Posibles errores:**
* `401 Unauthorized`: No autenticado
* `404 Not Found`: Producto no encontrado

### 5. Actualizar Producto

**Endpoint:** `PATCH /products/:id`

**Descripción:** Actualiza un producto existente.

**Permisos requeridos:** Autenticación con JWT

**Parámetros de ruta (path params):**
* `id`: ID del producto a actualizar

**Cuerpo de la solicitud (todos los campos son opcionales):**

```json
{
  "name": "Hamburguesa Especial",
  "description": "Hamburguesa con queso, tocino y papas fritas",
  "price": 12.99,
  "stock": 30,
  "type": "food",
  "isActive": true
}
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": "9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o",
  "name": "Hamburguesa Especial",
  "description": "Hamburguesa con queso, tocino y papas fritas",
  "price": 12.99,
  "stock": 30,
  "type": "food",
  "isActive": true,
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-02T12:00:00Z"
}
```

**Posibles errores:**
* `400 Bad Request`: Datos de entrada inválidos
* `401 Unauthorized`: No autenticado
* `404 Not Found`: Producto no encontrado
* `409 Conflict`: Ya existe un producto con este nombre

### 6. Eliminar Producto

**Endpoint:** `DELETE /products/:id`

**Descripción:** Elimina un producto del sistema.

**Permisos requeridos:** Autenticación con JWT

**Parámetros de ruta (path params):**
* `id`: ID del producto a eliminar

**Ejemplo de solicitud:**
```
DELETE /products/9f7b5c3a-1d2e-4f5g-6h7i-8j9k0l1m2n3o
```

**Respuesta exitosa (200 OK):**
No devuelve contenido en caso exitoso.

**Posibles errores:**
* `401 Unauthorized`: No autenticado
* `404 Not Found`: Producto no encontrado

## Funcionalidades Adicionales

### Actualización de Stock

El servicio `ProductsService` proporciona un método `updateStock` que permite actualizar la cantidad en stock de un producto. Este método es utilizado internamente por otros módulos cuando se realizan pedidos o se actualizan inventarios.

**Funcionalidad:**
- Permite incrementar o decrementar el stock de un producto
- Evita que el stock se vuelva negativo (establece mínimo a 0)
- Valida la existencia del producto antes de actualizar

**Nota:** Esta funcionalidad no está expuesta directamente como un endpoint, sino que es utilizada por otros módulos del sistema. 