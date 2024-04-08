import { randomBytes } from "crypto";

export interface User {
    id: number;
    username: string;
    password: string;  // Suponiendo que tenemos una contraseña para verificar
    token: string;
    displayName: string;
    emails: { value: string }[];
}

const records: User[] = [
    { id: 1, username: 'jack', password: 'jackspassword', token: '123456789', displayName: 'Jack', emails: [{ value: 'jack@example.com' }] },
    { id: 2, username: 'jill', password: 'jillspassword', token: 'abcdefghi', displayName: 'Jill', emails: [{ value: 'jill@example.com' }] }
];

export const findByToken = (token: string, cb: (err: Error | null, record?: User | null) => void): void => {
    process.nextTick(() => {
        for (let i = 0, len = records.length; i < len; i++) {
            const record = records[i];
            if (record.token === token) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

export const findByUsername = (username: string, cb: (err: Error | null, user?: User | null) => void): void => {
    process.nextTick(() => {
        const user = records.find(record => record.username === username);
        return cb(null, user || null);
    });
};

export const verifyPassword = (user: User, password: string): boolean => {
    // En un entorno de producción, usa un método seguro de verificación de contraseñas
    return user.password === password;
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