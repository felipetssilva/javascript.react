import customers from '../models/customers';
import notification from '../MongoSchemas/notifications';
class NotificationController {
    async index(req, res) {

        const CheckIsProvider = await customers.findOne({
            where: { id: req.userId, provider: true },
        });
        if (!CheckIsProvider) {
            return res.status(401).
                json({ error: 'Only service providers can load notifications!' });
        }
        const notifications = await notification.find({
            customers: req.userId,
        }).sort({ createdAt: 'desc' }).limit(20);
        return res.json({ notifications });
    }
    async update(req, res) {
        const notificationIsRead = await notification.findByIdAndUpdate(req.params.id,
            { read: true }, { new: true });

        return res.json(`New Notification : ${notificationIsRead}`);
    }
}


export default new NotificationController();