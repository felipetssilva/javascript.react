import appointments from '../models/appointments';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import * as yupp from 'yup';
import customers from '../models/customers';
import files from '../models/files';
import { date } from 'date-fns/locale/af';
import notification from '../MongoSchemas/notifications';
import Mail from 'nodemailer/lib/mailer';
class AppointmentController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const ListAppointments = await appointments.findAll({
            where: { id: req.userId, cancelled_at: null },
            order: ['date'],
            attributes: ['customer_id', 'provider_id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [{
                model: customers,
                as: 'prov_id',
                attributes: ['name', 'email', 'provider'],

                include: [{
                    model: files,
                    as: 'Avatar',
                    attributes: ['id', 'path', 'url'],
                },
                ],
            }
            ],

        });
        return res.json(ListAppointments);

    }
    async store(req, res) {
        const schema = yupp.object().shape({
            date: yupp.date().required(),
            provider_id: yupp.number().required(),
            // customer_id: yupp.number().required(),

        });
        console.log("this is the provider  in appointmentController -> " + req.body.provider_id);
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation in Appointment Controller failed!' });
        }

        const { provider_id, date } = req.body;
        const CheckIsProvider = await customers.findOne({
            where: { id: provider_id, provider: true },
        });
        if (provider_id === req.userId) {
            return res.status(401).
                json({ error: ' Provider cannot set appointment with him or herself!' });
        } else if (!CheckIsProvider) {
            return res.status(401).
                json({ error: 'Can only set appointments with providers!' });
        }
        const thisHour = startOfHour(parseISO(date));
        if (isBefore(thisHour, new Date())) {
            res.status(400).json({
                error: 'This time is invalid, past dates are not permitted!' +
                    'the time now is ' + thisHour
            });
        }

        const checkAvailability = await appointments.findOne({
            where: {
                provider_id: provider_id,
                cancelled_at: null,
                date: thisHour,
            },
        });
        if (checkAvailability) {
            return res.status(400).json({ error: 'This time is not available!' });
        }

        const appointment = await appointments.create({
            customer_id: req.userId,
            provider_id,
            date,
        });
        const customer = await customers.findByPk(req.userId);
        const aptmtDate = format(thisHour,
            "'the' dd 'of' mm ',' yyyy");

        //Notify appointment provider
        await notification.create({
            content: `New appointment for ${customer.name} on ${aptmtDate}`,
            customer: provider_id,
            read: false,
        });

        return res.json(appointment);
    }


    async erase(req, res) {
        const deleteThisAptmt = await appointments.findByPk(req.params.id, {
            include: [{
                model: customers,
                as: 'cust_id',
                attributes: ['name', 'email'],
            }],
        });


        if (deleteThisAptmt.id !== req.userId) {
            return res.status(400).json({
                error: " You don't have permission to delete this appointment"
            });
        }

        const enoughTime = subHours(deleteThisAptmt.date, 2);
        if (isBefore(enoughTime, new Date())) {

            return res.status(400).json({
                error: "You can only delete an appointment with 2 hours of its creation!"
            });
        }
        deleteThisAptmt.cancelled_at = new Date();

        await deleteThisAptmt.save();
        await Mail.sendMail({
            to: `${deleteThisAptmt.provider.name} <${deleteThisAptmt.provider.email}>`,
            subject: 'Appointment cancelled!',
        });
        return res.json(deleteThisAptmt);
    }
}
export default new AppointmentController();

