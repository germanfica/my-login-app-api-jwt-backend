// models/index.ts
import sequelize from "../config/database";
import RoleModel from "./role.model";
import UserModel from "./user.model";

interface Database {
    sequelize: typeof sequelize;
    UserModel: typeof UserModel;
    RoleModel: typeof RoleModel;
    initializeDatabase: () => Promise<void>;
}

const db: Database = {
    sequelize,
    UserModel,
    RoleModel,
    initializeDatabase
};

/**
 * Initialize the database by synchronizing the Sequelize models.
 * This function will create the tables if they do not exist.
 * 
 * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
 */
async function initializeDatabase(): Promise<void> {
    try {
        // await sequelize.sync({ force: true }); // Usar { force: true } solo en desarrollo; elimina tablas existentes
        // await sequelize.sync({ alter: true }); // Usar { alter: true } para actualizar la estructura sin eliminar datos
        await sequelize.sync(); // Sincroniza la base de datos con los modelos definidos. Esto crea las tablas si no existen, pero no realiza cambios estructurales. Es adecuado para entornos de desarrollo y pruebas donde la estructura de la base de datos no cambia frecuentemente.
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
        throw error; // Re-throw the error to ensure it can be handled by the caller
    }
}

export default db;