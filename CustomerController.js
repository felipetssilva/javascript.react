import Customer from '../models/Customers';
import * as yup from 'yup';
class CustomerController {
    async store(req, res) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            //oldPassword: yup.string().min(6),
            password: yup.string().required().min(6),

        });
        if (!(await schema.isValid(req.body))) {
            res.status(400).json({ error: 'validation failed' });
        }
        const ifExists = await Customer.findOne({ where: { email: req.body.email } });
        if (ifExists) {
            return res.status(400).json('user already exists');
        }
        const { id, name, email, provider } = await Customer.create(req.body);
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
    async update(req, res) {
        const schema = yup.object().shape({
            name: yup.string(),
            email: yup.string().email(),
            oldPassword: yup.string().min(6),
            password: yup.string().when('oldPassword',
                (oldPassword, field) =>
                    oldPassword ? field.required() : field
            ),
            confirmPassword: yup.string().when(
                'password', (password, field) =>
                password ? field.required().oneOf([yup.ref('password')]) : field)
        });
        if (!(await schema.isValid(req.body))) {
            res.status(400).json({ error: 'validation failed..' });
        }
        const { email, oldPassword } = req.body;
        const user = await Customer.findByPk(req.userId);
        if (email !== user.email) {
            const userExists = await Customer.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'user already exists!' });
            }
        }
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'password does not match' });
        }
        const { id, name, provider } = await user.update(req.body);
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
}
export default new CustomerController();


























