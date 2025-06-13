# Estructura Completa del Proyecto

Este documento muestra la estructura completa de carpetas y archivos del proyecto Sasseri Bares, proporcionando una visión general de cómo está organizado.

```
bares_app/
├── dist/                # Código compilado para producción
│   ├── migrations/      # Migraciones de base de datos compiladas
│   └── src/             # Código fuente compilado
├── docs/                # Documentación detallada
│   ├── CORSConfig.md    # Guía de configuración CORS
│   ├── CreacionModulos.md # Guía para crear nuevos módulos
│   ├── SwaggerGuide.md  # Guía de documentación Swagger
│   └── VariablesEntorno.md # Guía de variables de entorno
├── migrations/          # Migraciones de base de datos
├── rules/               # Reglas personalizadas (ESLint, etc.)
├── src/                 # Código fuente principal
│   ├── common/          # Utilidades comunes
│   │   ├── constants/   # Constantes del sistema
│   │   ├── decorators/  # Decoradores personalizados
│   │   ├── entities/    # Entidades base (BaseEntity, etc.)
│   │   ├── filters/     # Filtros de excepciones
│   │   ├── guards/      # Guardias personalizados
│   │   ├── interceptors/ # Interceptores
│   │   └── pipes/       # Pipes personalizados
│   ├── config/          # Configuración de la aplicación
│   │   ├── app.config.ts # Configuración general
│   │   ├── cors.config.ts # Configuración de CORS
│   │   ├── database.config.ts # Configuración de base de datos
│   │   └── jwt.config.ts # Configuración de JWT
│   ├── migrations/      # Migraciones de TypeORM
│   └── modules/         # Módulos del sistema
│       ├── auth/        # Autenticación y autorización
│       │   ├── controllers/ # Controladores de autenticación
│       │   ├── dto/     # DTOs para autenticación
│       │   ├── guards/  # Guardias de autenticación
│       │   ├── services/ # Servicios de autenticación
│       │   └── strategies/ # Estrategias de autenticación (JWT, local)
│       ├── users/       # Gestión de usuarios
│       │   ├── controllers/ # Controladores de usuarios
│       │   ├── dto/     # DTOs de usuarios
│       │   ├── entities/ # Entidades de usuarios
│       │   └── services/ # Servicios de usuarios
│       ├── general-configs/ # Configuraciones generales del bar
│       │   ├── controllers/ # Controladores de configuración
│       │   ├── dto/     # DTOs de configuración
│       │   ├── entities/ # Entidades de configuración
│       │   └── services/ # Servicios de configuración
│       ├── customers/   # Gestión de clientes
│       │   ├── controllers/ # Controladores de clientes
│       │   ├── dto/     # DTOs de clientes
│       │   ├── entities/ # Entidades de clientes
│       │   └── services/ # Servicios de clientes
│       ├── tables/      # Gestión de mesas
│       │   ├── controllers/ # Controladores de mesas
│       │   ├── dto/     # DTOs de mesas
│       │   ├── entities/ # Entidades de mesas
│       │   └── services/ # Servicios de mesas
│       ├── products/    # Gestión de productos
│       │   ├── controllers/ # Controladores de productos
│       │   ├── dto/     # DTOs de productos
│       │   ├── entities/ # Entidades de productos
│       │   └── services/ # Servicios de productos
│       ├── orders/      # Gestión de órdenes/facturas
│       │   ├── controllers/ # Controladores de órdenes
│       │   ├── dto/     # DTOs de órdenes
│       │   ├── entities/ # Entidades de órdenes
│       │   └── services/ # Servicios de órdenes
│       ├── order-requests/ # Gestión de solicitudes de pedidos
│       │   ├── controllers/ # Controladores de solicitudes
│       │   ├── dto/     # DTOs de solicitudes
│       │   ├── entities/ # Entidades de solicitudes
│       │   └── services/ # Servicios de solicitudes
│       ├── songs-requests/ # Gestión de solicitudes de canciones
│       │   ├── controllers/ # Controladores de canciones
│       │   ├── dto/     # DTOs de canciones
│       │   ├── entities/ # Entidades de canciones
│       │   └── services/ # Servicios de canciones
│       ├── reports/     # Generación de reportes
│       │   ├── controllers/ # Controladores de reportes
│       │   ├── dto/     # DTOs de reportes
│       │   └── services/ # Servicios de reportes
│       └── websockets/  # Comunicación en tiempo real
│           ├── dto/     # DTOs para eventos WebSocket
│           ├── gateways/ # Gateways de WebSocket
│           └── services/ # Servicios de WebSocket
├── test/                # Pruebas automatizadas
│   ├── e2e/             # Pruebas de extremo a extremo
│   └── unit/            # Pruebas unitarias
├── .env                 # Variables de entorno (producción/desarrollo)
├── .env.development     # Variables de entorno específicas para desarrollo
├── .gitignore           # Archivos ignorados por Git
├── .prettierrc          # Configuración de Prettier
├── env                  # Plantilla para archivo .env
├── env.development      # Plantilla para archivo .env.development
├── env.example          # Ejemplo de configuración de variables de entorno
├── eslint.config.mjs    # Configuración de ESLint
├── FrontendImplementation.md # Guía para implementación del frontend
├── nest-cli.json        # Configuración de NestJS CLI
├── package.json         # Dependencias y scripts
├── package-lock.json    # Versiones exactas de dependencias
├── projectContext.md    # Contexto general del proyecto
├── projectFilesStructure.md # Este archivo - Estructura de archivos
├── README.md            # Documentación principal
├── tsconfig.build.json  # Configuración de TypeScript para build
└── tsconfig.json        # Configuración principal de TypeScript
```

## Resumen de la Estructura

- **`dist/`**: Contiene el código compilado, listo para su despliegue en producción.
- **`docs/`**: Documentación detallada sobre diferentes aspectos del proyecto.
- **`migrations/`**: Scripts de migración de base de datos.
- **`rules/`**: Reglas personalizadas para herramientas como ESLint.
- **`src/`**: Código fuente principal del proyecto.
  - **`common/`**: Código compartido entre diferentes módulos.
  - **`config/`**: Configuraciones generales del sistema.
  - **`modules/`**: Módulos funcionales de la aplicación.
- **`test/`**: Pruebas automatizadas.
- Archivos de configuración en la raíz para diferentes herramientas (TypeScript, ESLint, etc.).

## Patrones y Convenciones

La estructura del proyecto sigue varios patrones y convenciones importantes:

1. **Arquitectura Modular**: El proyecto está organizado en módulos independientes.
2. **Patrón por Funcionalidad**: Cada módulo representa una funcionalidad específica del sistema.
3. **Estructura Coherente**: Cada módulo sigue la misma estructura interna (controllers, services, entities, dto).
4. **Separación de Preocupaciones**: Cada componente tiene una responsabilidad clara.
5. **Entidades Centralizadas**: Las entidades base y comunes están en `common/entities`.
6. **Configuración Centralizada**: Todas las configuraciones están en la carpeta `config`.
7. **Convención de Nomenclatura**: Se utiliza kebab-case para carpetas y archivos, y PascalCase para clases.

## Cómo Navegar por el Proyecto

Para entender mejor el proyecto, se recomienda explorar en el siguiente orden:

1. Revisar los archivos de configuración principales (nest-cli.json, package.json)
2. Examinar la carpeta `src/config` para entender cómo está configurada la aplicación
3. Estudiar la estructura de `src/common` para comprender las utilidades comunes
4. Explorar los módulos en `src/modules`, comenzando por auth y users
5. Revisar las integraciones y módulos especializados como websockets