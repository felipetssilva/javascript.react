import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Customers extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            provider: Sequelize.BOOLEAN,

        }, {
            sequelize
        });

        this.addHook('beforeSave', async customer => {
            if (customer.password) {
                customer.password_hash = await bcrypt.hash(customer.password, 8);
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Files, { foreignKey: 'avatar_id' });
    }
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

}
export default Customers;