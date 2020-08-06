import jwt from 'jsonwebtoken';
import Customer from '../models/Customers';
import token from '../../config/authConfig';
import * as yup from 'yup';


class SessionController {
    async store(req, res) {
        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required().min(6),

        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'validation failed' });
        }
        const { email, password } = req.body;
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(400).json({ error: 'customer not found ' });
        }
        if (!(await customer.checkPassword(password))) {
            return res.status.json({ error: 'password invalid' });
        }
        const { id, name } = customer;

        return res.json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign({ id }, token.secret,
                {
                    expiresIn: token.expiresIn,
                }),
        });

    }

}

export default new SessionController();