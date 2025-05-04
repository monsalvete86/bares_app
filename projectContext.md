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