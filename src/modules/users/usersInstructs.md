# Módulo de Usuarios

Este módulo permite gestionar los usuarios del sistema, incluyendo administradores y staff. Proporciona funcionalidades para crear, listar, actualizar y eliminar usuarios.

## Endpoints Disponibles

El módulo ofrece los siguientes endpoints, todos protegidos con autenticación JWT:

### 1. Crear Usuario

**Endpoint:** `POST /users`

**Descripción:** Crea un nuevo usuario en el sistema.

**Datos de Entrada (CreateUserDto):**

```json
{
  "username": "carlos_rodriguez",
  "password": "password123",
  "fullName": "Carlos Rodríguez",
  "email": "carlos@ejemplo.com",
  "role": "staff",
  "isActive": true
}
```

**Campos obligatorios:**
- `username`: Nombre de usuario único (string)
- `password`: Contraseña del usuario (string, mínimo 6 caracteres)
- `fullName`: Nombre completo del usuario (string)

**Campos opcionales:**
- `email`: Correo electrónico único (string, debe ser un email válido)
- `role`: Rol del usuario (enum: 'admin' o 'staff', valor por defecto: 'staff')
- `isActive`: Estado del usuario (boolean, valor por defecto: true)

**Respuesta exitosa (código 201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "carlos_rodriguez",
  "fullName": "Carlos Rodríguez",
  "email": "carlos@ejemplo.com",
  "role": "staff",
  "isActive": true,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-15T10:30:00.000Z"
}
```

### 2. Obtener Todos los Usuarios

**Endpoint:** `GET /users`

**Descripción:** Obtiene una lista de todos los usuarios.

**Datos de Entrada:** No requiere cuerpo de solicitud.

**Respuesta exitosa (código 200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "carlos_rodriguez",
    "fullName": "Carlos Rodríguez",
    "email": "carlos@ejemplo.com",
    "role": "staff",
    "isActive": true,
    "createdAt": "2023-08-15T10:30:00.000Z",
    "updatedAt": "2023-08-15T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "username": "maria_lopez",
    "fullName": "María López",
    "email": "maria@ejemplo.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2023-08-16T11:45:00.000Z",
    "updatedAt": "2023-08-16T11:45:00.000Z"
  }
]
```

### 3. Obtener Usuarios Paginados con Filtros

**Endpoint:** `GET /users/paginated`

**Descripción:** Obtiene una lista paginada de usuarios con posibilidad de filtrar por varios campos.

**Parámetros de Consulta:**
- `page`: Número de página (opcional, valor por defecto: 1)
- `limit`: Número de registros por página (opcional, valor por defecto: 10)
- `username`: Filtro por nombre de usuario (opcional)
- `fullName`: Filtro por nombre completo (opcional)
- `email`: Filtro por correo electrónico (opcional)
- `role`: Filtro por rol ('admin' o 'staff', opcional)
- `isActive`: Filtro por estado (true o false, opcional)

**Ejemplo de solicitud:**
```
GET /users/paginated?page=1&limit=10&role=staff&isActive=true
```

**Respuesta exitosa (código 200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "carlos_rodriguez",
      "fullName": "Carlos Rodríguez",
      "email": "carlos@ejemplo.com",
      "role": "staff",
      "isActive": true,
      "createdAt": "2023-08-15T10:30:00.000Z",
      "updatedAt": "2023-08-15T10:30:00.000Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "username": "pedro_sanchez",
      "fullName": "Pedro Sánchez",
      "email": "pedro@ejemplo.com",
      "role": "staff",
      "isActive": true,
      "createdAt": "2023-08-17T09:20:00.000Z",
      "updatedAt": "2023-08-17T09:20:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

### 4. Obtener Usuario por ID

**Endpoint:** `GET /users/:id`

**Descripción:** Obtiene los detalles de un usuario específico por su ID.

**Parámetros de Ruta:**
- `id`: ID del usuario a consultar

**Respuesta exitosa (código 200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "carlos_rodriguez",
  "fullName": "Carlos Rodríguez",
  "email": "carlos@ejemplo.com",
  "role": "staff",
  "isActive": true,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-15T10:30:00.000Z"
}
```

**Respuesta de error (código 404):**

```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado",
  "error": "Not Found"
}
```

### 5. Actualizar Usuario

**Endpoint:** `PATCH /users/:id`

**Descripción:** Actualiza los datos de un usuario existente.

**Parámetros de Ruta:**
- `id`: ID del usuario a actualizar

**Datos de Entrada (UpdateUserDto):**

```json
{
  "fullName": "Carlos Rodríguez Martínez",
  "email": "carlos.new@ejemplo.com",
  "isActive": false
}
```

**Nota:** Todos los campos son opcionales en la actualización. Solo es necesario enviar los campos que se desean modificar.

**Respuesta exitosa (código 200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "carlos_rodriguez",
  "fullName": "Carlos Rodríguez Martínez",
  "email": "carlos.new@ejemplo.com",
  "role": "staff",
  "isActive": false,
  "createdAt": "2023-08-15T10:30:00.000Z",
  "updatedAt": "2023-08-18T14:25:00.000Z"
}
```

### 6. Eliminar Usuario

**Endpoint:** `DELETE /users/:id`

**Descripción:** Elimina un usuario del sistema.

**Parámetros de Ruta:**
- `id`: ID del usuario a eliminar

**Datos de Entrada:** No requiere cuerpo de solicitud.

**Respuesta exitosa (código 200):**
```
// Respuesta sin contenido (204)
```

## Ejemplo de Uso con cURL

### Crear usuario:

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "clave123",
    "fullName": "Usuario Nuevo",
    "email": "usuario@ejemplo.com",
    "role": "staff"
  }'
```

### Obtener todos los usuarios:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Obtener usuarios paginados con filtros:

```bash
curl -X GET "http://localhost:3000/users/paginated?page=1&limit=10&role=staff&isActive=true" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Obtener usuario por ID:

```bash
curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Actualizar usuario:

```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nombre Actualizado",
    "isActive": false
  }'
```

### Eliminar usuario:

```bash
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints requieren autenticación JWT. Asegúrate de incluir el token en el encabezado `Authorization`.

2. **Validación de Datos**: 
   - El username debe ser único en el sistema
   - El email, si se proporciona, debe tener un formato válido y ser único
   - La contraseña debe tener al menos 6 caracteres
   - El rol solo puede ser 'admin' o 'staff'

3. **Contraseñas**: Las contraseñas se almacenan hasheadas en la base de datos por motivos de seguridad y nunca se devuelven en las respuestas.

4. **Eliminación**: La eliminación de usuarios podría ser lógica (cambio de estado) en lugar de física, dependiendo de la implementación del servicio. 