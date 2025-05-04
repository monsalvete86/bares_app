├── migrations/             # Carpeta a nivel raíz para las migraciones de la base de datos
│   ├── 1678886400000-InitialSchema.ts # Ejemplo: timestamp-NombreMigracion.ts
│   └── ...
├── src/
│   ├── app.module.ts       # Módulo raíz
│   ├── main.ts             # Archivo de inicio de la aplicación
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/            # Manejo de rutas para autenticación
│   │   │   │   └── auth.controller.ts  # Rutas: /auth/login, /auth/register, etc.
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts     # Lógica de negocio de autenticación
│   │   │   ├── strategies/             # Estrategias de Passport.js (ej: jwt.strategy.ts)
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/                 # Guards de autenticación (ej: jwt-auth.guard.ts)
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── dto/                    # Data Transfer Objects (ej: LoginDto, RegisterDto)
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── auth.module.ts          # Módulo de autenticación
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/            # Manejo de rutas para usuarios
│   │   │   │   └── users.controller.ts # Rutas: /users, /users/:id, etc.
│   │   │   ├── services/
│   │   │   │   └── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts      # Entidad de usuario
│   │   │   └── users.module.ts
│   │   │
│   │   ├── customers/
│   │   │   ├── controllers/            # Manejo de rutas para clientes
│   │   │   │   └── customers.controller.ts # Rutas: /customers, /customers/:id, etc.
│   │   │   ├── services/
│   │   │   │   └── customers.service.ts
│   │   │   ├── entities/
│   │   │   │   └── customer.entity.ts  # Entidad de cliente
│   │   │   └── customers.module.ts
│   │   │
│   │   ├── general-configs/
│   │   │   ├── controllers/            # Manejo de rutas para general-configs
│   │   │   │   └── general-configs.controller.ts # Rutas: /configs
│   │   │   ├── services/
│   │   │   │   └── general-configs.service.ts
│   │   │   ├── entities/
│   │   │   │   └── general-configs.entity.ts  # Entidad de general-configs
│   │   │   └── general-configs.module.ts
│   │   │
│   │   ├── products/
│   │   │   ├── controllers/            # Manejo de rutas para productos
│   │   │   │   └── products.controller.ts # Rutas: /products, /products/:id, etc.
│   │   │   ├── services/
│   │   │   │   └── products.service.ts
│   │   │   ├── entities/
│   │   │   │   └── product.entity.ts   # Entidad de producto
│   │   │   └── products.module.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── controllers/            # Manejo de rutas para pedidos
│   │   │   │   └── orders.controller.ts # Rutas: /orders, /orders/:id, etc.
│   │   │   ├── services/
│   │   │   │   └── orders.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── order.entity.ts     # Entidad de pedido
│   │   │   │   └── order-item.entity.ts # Entidad de ítem de pedido
│   │   │   └── orders.module.ts
│   │   │
│   │   ├── order-requests/             # Módulo para solicitudes de pedido (distinto de pedidos finalizados)
│   │   │   ├── controllers/            # Manejo de rutas para solicitudes de pedido
│   │   │   │   └── order-requests.controller.ts # Rutas: /order-requests, etc.
│   │   │   ├── services/
│   │   │   │   └── order-requests.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── order-request.entity.ts     # Entidad de solicitud de pedido
│   │   │   │   └── order-request-item.entity.ts # Entidad de ítem de solicitud de pedido
│   │   │   └── order-requests.module.ts
│   │   │
│   │   ├── tables/
│   │   │   ├── controllers/            # Manejo de rutas para mesas
│   │   │   │   └── tables.controller.ts # Rutas: /tables, /tables/:id, etc.
│   │   │   ├── services/
│   │   │   │   └── tables.service.ts
│   │   │   ├── entities/
│   │   │   │   └── table.entity.ts     # Entidad de mesa
│   │   │   └── tables.module.ts
│   │   │
│   │   ├── song-requests/
│   │   │   ├── controllers/            # Manejo de rutas para solicitudes de canciones
│   │   │   │   └── song-requests.controller.ts # Rutas: /song-requests, etc.
│   │   │   ├── services/
│   │   │   │   └── song-requests.service.ts
│   │   │   ├── entities/
│   │   │   │   └── song-request.entity.ts # Entidad de solicitud de canción
│   │   │   └── song-requests.module.ts
│   │   │
│   │   ├── websockets/                 # Módulo para manejar la lógica de WebSockets (si es centralizada)
│   │   │   ├── gateways/               # Gateways de Websocket
│   │   │   │   └── websockets.gateway.ts # Gateway principal o gateways relacionados
│   │   │   ├── services/
│   │   │   │   └── websockets.service.ts # Servicio con lógica de negocio para websockets
│   │   │   ├── dto/                    # DTOs para mensajes de websocket
│   │   │   │   └── ...
│   │   │   └── websockets.module.ts
│   │   │
│   │   └── ... (otros módulos si son necesarios)
│   │
│   ├── common/                       # Elementos transversales
│   │   ├── filters/
│   │   ├── guards/                   # Guards de acceso (incluida validación por rol)
│   │   │   └── roles.guard.ts          # Guard para verificar roles
│   │   │   └── jwt-auth.guard.ts       # Guard de autenticación JWT (si no está solo en auth)
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── decorators/               # Decoradores personalizados
│   │   │   └── roles.decorator.ts      # Decorador @Roles()
│   │   ├── constants/                # Constantes compartidas (ej: nombres de roles)
│   │   │   └── roles.enum.ts
│   │   └── ... (otros archivos transversales)
│   │
│   └── shared/                       # Módulos o servicios compartidos entre varios módulos de negocio
│       └── ...
│
└── package.json
└── tsconfig.json
└── ... (otros archivos de configuración del proyecto)