import mongoose from 'mongoose';

const UserInformationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Basic regex for phone number validation (modify as needed)
                return /^\+?[1-9]\d{1,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid WhatsApp number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Basic regex for email validation
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }
});

// Export the UserInformation model
const userInformation = mongoose.model('userInformation', UserInformationSchema);
export default userInformation;
