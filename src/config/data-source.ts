import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [
    path.join(__dirname, '..', '..', 'migrations', '*{.ts,.js}'),
    path.join(__dirname, '..', 'migrations', '*{.ts,.js}')
  ],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource; 