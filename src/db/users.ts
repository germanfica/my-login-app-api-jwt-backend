export interface User {
    id: number;
    username: string;
    token: string;
    displayName: string;
    emails: { value: string }[];
}

const records: User[] = [
    { id: 1, username: 'jack', token: '123456789', displayName: 'Jack', emails: [{ value: 'jack@example.com' }] },
    { id: 2, username: 'jill', token: 'abcdefghi', displayName: 'Jill', emails: [{ value: 'jill@example.com' }] }
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
