// db/database.ts
import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'mysql',
    logging: false, // Establecer en true para ver las consultas SQL en la consola
});

export default sequelize;
