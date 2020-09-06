module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'goBarber',
    define: {
        timestamps: false,
        underscore: true,
        underscoreAll: true,
    },
};