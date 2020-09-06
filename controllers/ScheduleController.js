import customers from '../models/customers';
import AppointmentController from './AppointmentController';
import appointments from '../models/appointments';

class ScheduleController {// get all appointments scheduled per provider 
    async index(req, res) {
        const appointmentsScheduled = await customers.findOne({
            where: { id: req.userId, provider: true }
        });

        if (!appointmentsScheduled) {
            res.status(401).json({ error: 'No appointents for user on this date or its not a provider' });
        }

        const { dates } = req.query;
        console.log('this is the req.body -->>>' + req.body);

        res.json({ dates });

    }

}

export default new ScheduleController();