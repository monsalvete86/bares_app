# Módulo de Reportes

Este módulo proporciona estadísticas y datos sobre las ventas y operaciones del negocio. Permite obtener información resumida y detallada sobre ventas, productos más vendidos y tendencias en períodos específicos.

## Resumen de Ventas

### Obtener resumen de ventas

**Endpoint:** `GET /reports/sales/summary`

**Descripción:** Devuelve un resumen de las ventas, incluyendo el total de ventas, número de pedidos y valor promedio por pedido.

**Parámetros de consulta (opcionales):**
- `startDate`: Fecha de inicio para el período (formato: YYYY-MM-DD)
- `endDate`: Fecha de fin para el período (formato: YYYY-MM-DD)
- `tableId`: Filtrar ventas por mesa específica
- `clientId`: Filtrar ventas por cliente específico
- `isActive`: Incluir solo órdenes activas (true) o inactivas (false)

**Respuesta:**

```json
{
  "totalSales": 1500.25,
  "totalOrders": 50,
  "averageOrderValue": 30.01
}
```

## Timeline de Ventas

### Obtener timeline de ventas

**Endpoint:** `GET /reports/sales/timeline`

**Descripción:** Devuelve datos históricos de ventas agrupados por fecha.

**Parámetros de consulta (opcionales):**
- `startDate`: Fecha de inicio para el período (formato: YYYY-MM-DD)
- `endDate`: Fecha de fin para el período (formato: YYYY-MM-DD)
- `tableId`: Filtrar ventas por mesa específica
- `clientId`: Filtrar ventas por cliente específico
- `isActive`: Incluir solo órdenes activas (true) o inactivas (false)

**Respuesta:**

```json
[
  {
    "date": "2023-05-01",
    "total": 350.75,
    "ordersCount": 12
  },
  {
    "date": "2023-05-02",
    "total": 420.50,
    "ordersCount": 15
  },
  {
    "date": "2023-05-03",
    "total": 380.00,
    "ordersCount": 13
  }
]
```

## Productos más Vendidos

### Obtener productos más vendidos

**Endpoint:** `GET /reports/products/top`

**Descripción:** Devuelve una lista de los productos más vendidos ordenados por total de ventas.

**Parámetros de consulta (opcionales):**
- `startDate`: Fecha de inicio para el período (formato: YYYY-MM-DD)
- `endDate`: Fecha de fin para el período (formato: YYYY-MM-DD)
- `tableId`: Filtrar ventas por mesa específica
- `clientId`: Filtrar ventas por cliente específico
- `isActive`: Incluir solo órdenes activas (true) o inactivas (false)
- `limit`: Número máximo de productos a devolver (por defecto: 10)

**Respuesta:**

```json
[
  {
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "productName": "Hamburguesa Especial",
    "quantity": 120,
    "totalSales": 1200.00
  },
  {
    "productId": "123e4567-e89b-12d3-a456-426614174001",
    "productName": "Cerveza Artesanal",
    "quantity": 200,
    "totalSales": 800.00
  },
  {
    "productId": "123e4567-e89b-12d3-a456-426614174002",
    "productName": "Papas Fritas",
    "quantity": 150,
    "totalSales": 600.00
  }
]
```

## Exportación de Datos

### Exportar datos de órdenes

**Endpoint:** `GET /reports/orders/export`

**Descripción:** Proporciona datos para exportación en formato JSON que pueden ser convertidos a CSV o Excel por el cliente.

**Parámetros de consulta (opcionales):**
- `startDate`: Fecha de inicio para el período (formato: YYYY-MM-DD)
- `endDate`: Fecha de fin para el período (formato: YYYY-MM-DD)
- `tableId`: Filtrar ventas por mesa específica
- `clientId`: Filtrar ventas por cliente específico
- `isActive`: Incluir solo órdenes activas (true) o inactivas (false)

**Respuesta:**
Los datos se devuelven en el mismo formato que el timeline de ventas:

```json
[
  {
    "date": "2023-05-01",
    "total": 350.75,
    "ordersCount": 12
  },
  {
    "date": "2023-05-02",
    "total": 420.50,
    "ordersCount": 15
  },
  {
    "date": "2023-05-03",
    "total": 380.00,
    "ordersCount": 13
  }
]
```

## Uso desde el Frontend

Para implementar la vista de "Informes de Ventas", el frontend debe realizar las siguientes llamadas:

1. **Tarjetas de resumen:**
   - Llamar a `GET /reports/sales/summary` para obtener las ventas totales, número de pedidos y valor promedio
   - Mostrar estos valores en las tarjetas correspondientes

2. **Filtros:**
   - Implementar campos de búsqueda, selección de fechas (inicial y final)
   - Al aplicar los filtros, actualizar todas las llamadas a la API con los parámetros correspondientes

3. **Historial de ventas:**
   - Llamar a `GET /reports/sales/timeline` para obtener los datos por fecha
   - Renderizar estos datos en un gráfico o tabla según el diseño

4. **Botón de exportar:**
   - Al hacer clic en el botón "Exportar", llamar a `GET /reports/orders/export`
   - Convertir los datos recibidos al formato deseado (CSV, Excel, etc.)
   - Descargar el archivo generado 