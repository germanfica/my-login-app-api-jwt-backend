import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export interface User {
    id: number;
    username: string;
    password: string;
    token: string;
    displayName: string;
    emails: { value: string }[];
}

const records: User[] = [
    // Las contraseñas deben ser hasheadas al crear los usuarios en la realidad
    // el password de jack es jackspassword
    { id: 1, username: 'jack', password: '$2b$10$85DZBfUxdOa00ZOa73X.HOdIXAoSKvhhCqiUETml1HXDRMJJbm93G', token: '123456789', displayName: 'Jack', emails: [{ value: 'jack@example.com' }] },
    { id: 2, username: 'jill', password: '$2b$10$...', token: 'abcdefghi', displayName: 'Jill', emails: [{ value: 'jill@example.com' }] }
];

// should be private only not public
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed Password: ${hashedPassword}`); // Imprime el hash en consola
    return hashedPassword;
};

export const findByToken = (token: string, cb: (err: Error | null, record?: User | null) => void): void => {
    process.nextTick(() => {
        const user = records.find(record => record.token === token);
        return cb(null, user || null);
    });
};

export const findByUsername = (username: string, cb: (err: Error | null, user?: User | null) => void): void => {
    process.nextTick(() => {
        const user = records.find(record => record.username === username);
        return cb(null, user || null);
    });
};

export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
    console.log(`USERNAME: ${user.username}; PASSWORD ${password}`);
    console.log(`USER PASSWORD FROM RECORDS: ${user.password}`);
    const match = await bcrypt.compare(password, user.password);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`HASHED PASSWORD: ${hashedPassword}`);
    console.log(`VERIFICACION ${match}`);

    return bcrypt.compare(password, user.password);
};

export const generateToken = (user: User): string => {
    // Generar un nuevo token y guardarlo/actualizarlo en la base de datos o el almacén de tokens
    const newToken = randomBytes(16).toString('hex');
    user.token = newToken;

    // Simular la actualización en la base de datos
    const userIndex = records.findIndex(record => record.id === user.id);
    if (userIndex !== -1) {
        records[userIndex].token = newToken;
    }

    return newToken;
};

// Función para crear un usuario
export async function createUser(username: string, password: string, displayName: string, email: string): Promise<User> {
    // Comprobar si el nombre de usuario ya existe
    const existingUser = records.find(user => user.username === username);
    if (existingUser) {
        throw new Error('Username already exists.');
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Generación de un nuevo token
    const token = randomBytes(16).toString('hex');

    // Crear el usuario
    const newUser: User = {
        id: records.length + 1,  // Asumimos un ID simple basado en la longitud del arreglo
        username,
        password: hashedPassword,
        token,
        displayName,
        emails: [{ value: email }]
    };

    // Agregar el usuario al "almacén" de registros
    records.push(newUser);

    return newUser;
}