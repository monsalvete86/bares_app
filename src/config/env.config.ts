import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || 'localhost',
    },
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      name: process.env.DB_NAME || 'bares_db',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret_key',
      expiresIn: process.env.JWT_EXPIRATION || '1d',
    },
  };
}); 