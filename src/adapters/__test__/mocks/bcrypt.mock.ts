jest.mock('bcrypt', () => {
    return {
        hashSync: jest.fn().mockImplementation((value) => {
            return Buffer.from(value, 'base64').toString();
        }),
        compareSync: jest.fn().mockImplementation((password: string, hash: string): boolean => {
            return Buffer.from(password, 'base64').toString() === hash;
        })
    }
})