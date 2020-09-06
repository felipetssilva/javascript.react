import customer from '../models/customers';
import files from '../models/files';

class ProviderController {
    async index(req, res) {
        const providers = await customer.findAll({
            where: { provider: true },
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [{
                model: files, as: 'Avatar',
                attributes: ['name', 'path', 'url'],
            },
            ]

        });

        return res.json(providers);
    }
}

export default new ProviderController();