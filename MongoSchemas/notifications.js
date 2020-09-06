import mongoose from 'mongoose';

const Notifications = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    customer: {
        type: Number,
        required: true,
    },
    read: {

        type: Boolean,
        default: false,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model('notification', Notifications);