# Módulo de Configuración General

Este módulo permite gestionar la configuración general del bar/restaurante, incluyendo información básica como nombre del negocio, propietario, datos de contacto y configuración de facturación.

## Endpoints Disponibles

El módulo ofrece cuatro operaciones principales, todas protegidas con autenticación JWT:

### 1. Crear Configuración General

**Endpoint:** `POST /general-configs`

**Descripción:** Crea la configuración general del bar. Solo puede existir una configuración en el sistema (singleton).

**Datos de Entrada (CreateGeneralConfigDto):**

```json
{
  "nombreEntidad": "Bar El Rincón",
  "propietario": "Juan Pérez",
  "numeroId": "B12345678",
  "direccion": "Calle Principal 123, Ciudad",
  "telefono": "+34 912345678",
  "correo": "contacto@barrincon.com",
  "redesSociales": {
    "facebook": "facebook.com/elrincon",
    "instagram": "@elrincon",
    "twitter": "@bar_elrincon"
  },
  "numeroInicioFacturas": 1000,
  "textoFacturas": "Gracias por su visita a Bar El Rincón",
  "pieFacturas": "IVA incluido. Conserve esta factura para posibles reclamaciones."
}
```

**Campos obligatorios:**
- `nombreEntidad`: Nombre del negocio (string)
- `propietario`: Nombre del propietario (string)
- `numeroId`: Número de identificación fiscal/comercial (string)
- `direccion`: Dirección física del negocio (string)
- `telefono`: Número de contacto (string)
- `correo`: Email de contacto (string, debe ser un email válido)

**Campos opcionales:**
- `redesSociales`: Objeto con las redes sociales del negocio (objeto key-value)
- `numeroInicioFacturas`: Número para iniciar la secuencia de facturas (número, mínimo 1)
- `textoFacturas`: Texto para el encabezado de facturas (string)
- `pieFacturas`: Texto para el pie de facturas (string)

**Respuesta exitosa (código 201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombreEntidad": "Bar El Rincón",
  "propietario": "Juan Pérez",
  "numeroId": "B12345678",
  "direccion": "Calle Principal 123, Ciudad",
  "telefono": "+34 912345678",
  "correo": "contacto@barrincon.com",
  "redesSociales": {
    "facebook": "facebook.com/elrincon",
    "instagram": "@elrincon",
    "twitter": "@bar_elrincon"
  },
  "numeroInicioFacturas": 1000,
  "textoFacturas": "Gracias por su visita a Bar El Rincón",
  "pieFacturas": "IVA incluido. Conserve esta factura para posibles reclamaciones.",
  "isSingleton": true,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-15T10:30:00.000Z"
}
```

### 2. Obtener Configuración General

**Endpoint:** `GET /general-configs`

**Descripción:** Obtiene la configuración general actual del bar.

**Datos de Entrada:** No requiere cuerpo de solicitud.

**Respuesta exitosa (código 200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombreEntidad": "Bar El Rincón",
  "propietario": "Juan Pérez",
  "numeroId": "B12345678",
  "direccion": "Calle Principal 123, Ciudad",
  "telefono": "+34 912345678",
  "correo": "contacto@barrincon.com",
  "redesSociales": {
    "facebook": "facebook.com/elrincon",
    "instagram": "@elrincon",
    "twitter": "@bar_elrincon"
  },
  "numeroInicioFacturas": 1000,
  "textoFacturas": "Gracias por su visita a Bar El Rincón",
  "pieFacturas": "IVA incluido. Conserve esta factura para posibles reclamaciones.",
  "isSingleton": true,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-15T10:30:00.000Z"
}
```

**Respuesta de error (código 404):**

```json
{
  "statusCode": 404,
  "message": "No se ha configurado la información del bar todavía",
  "error": "Not Found"
}
```

### 3. Actualizar Configuración General

**Endpoint:** `PATCH /general-configs`

**Descripción:** Actualiza la configuración general existente. Todos los campos son opcionales en la actualización.

**Datos de Entrada (UpdateGeneralConfigDto):**

```json
{
  "nombreEntidad": "Bar El Rincón - Sucursal Centro",
  "telefono": "+34 912345679",
  "redesSociales": {
    "facebook": "facebook.com/elrincon.centro",
    "instagram": "@elrincon_centro",
    "twitter": "@bar_elrincon_centro",
    "tiktok": "@elrinconbar"
  }
}
```

**Nota:** En la actualización, todos los campos son opcionales. Solo es necesario enviar los campos que se desean modificar.

**Respuesta exitosa (código 200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombreEntidad": "Bar El Rincón - Sucursal Centro",
  "propietario": "Juan Pérez",
  "numeroId": "B12345678",
  "direccion": "Calle Principal 123, Ciudad",
  "telefono": "+34 912345679",
  "correo": "contacto@barrincon.com",
  "redesSociales": {
    "facebook": "facebook.com/elrincon.centro",
    "instagram": "@elrincon_centro",
    "twitter": "@bar_elrincon_centro",
    "tiktok": "@elrinconbar"
  },
  "numeroInicioFacturas": 1000,
  "textoFacturas": "Gracias por su visita a Bar El Rincón",
  "pieFacturas": "IVA incluido. Conserve esta factura para posibles reclamaciones.",
  "isSingleton": true,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-15T11:15:00.000Z"
}
```

**Respuesta de error (código 404):**

```json
{
  "statusCode": 404,
  "message": "No se ha configurado la información del bar todavía. Cree una configuración antes de actualizarla.",
  "error": "Not Found"
}
```

### 4. Eliminar Configuración General

**Endpoint:** `DELETE /general-configs`

**Descripción:** Elimina la configuración general actual del bar.

**Datos de Entrada:** No requiere cuerpo de solicitud.

**Respuesta exitosa (código 200):**
```
// Respuesta sin contenido (204)
```

**Respuesta de error (código 404):**

```json
{
  "statusCode": 404,
  "message": "No hay configuración para eliminar",
  "error": "Not Found"
}
```

## Ejemplo de Uso con cURL

### Crear configuración:

```bash
curl -X POST http://localhost:3000/general-configs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreEntidad": "Bar El Rincón",
    "propietario": "Juan Pérez",
    "numeroId": "B12345678",
    "direccion": "Calle Principal 123, Ciudad",
    "telefono": "+34 912345678",
    "correo": "contacto@barrincon.com",
    "redesSociales": {
      "facebook": "facebook.com/elrincon",
      "instagram": "@elrincon"
    },
    "numeroInicioFacturas": 1000
  }'
```

### Obtener configuración:

```bash
curl -X GET http://localhost:3000/general-configs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Actualizar configuración:

```bash
curl -X PATCH http://localhost:3000/general-configs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+34 912345679",
    "redesSociales": {
      "facebook": "facebook.com/elrincon.nuevo",
      "instagram": "@elrincon_nuevo",
      "tiktok": "@elrinconbar"
    }
  }'
```

### Eliminar configuración:

```bash
curl -X DELETE http://localhost:3000/general-configs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notas Importantes

1. **Singleton**: Este módulo está diseñado para mantener solo una configuración general en todo el sistema. No es posible tener múltiples configuraciones.

2. **Autenticación**: Todos los endpoints requieren autenticación JWT. Asegúrate de incluir el token en el encabezado `Authorization`.

3. **Validación de Datos**: 
   - Los campos obligatorios deben estar presentes en la creación
   - El correo electrónico debe tener un formato válido
   - El numeroInicioFacturas debe ser un número entero mayor o igual a 1

4. **Redes Sociales**: El campo `redesSociales` es un objeto flexible que permite agregar cualquier red social como clave y su respectivo valor. 