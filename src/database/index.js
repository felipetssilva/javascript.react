import Sequelize from 'sequelize';
import dataConfig from '../config/database';
import Files from '../app/models/Files';
import Customers from '../app/models/Customers';

const models = [Customers, Files];


class Database {
    constructor() {
        this.init();
    }
    init() {
        this.connection = new Sequelize(dataConfig);

        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    }

}
export default new Database();