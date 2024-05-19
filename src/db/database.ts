// db/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('myloginapp', 'user', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false, // Establecer en true para ver las consultas SQL en la consola
});

export default sequelize;
