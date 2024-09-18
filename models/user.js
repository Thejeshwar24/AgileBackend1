import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                try {
                    // Basic regex for email validation
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                } catch (error) {
                    console.error('Email validation error:', error);
                    return false;
                }
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                try {
                    // Regex for exactly 10 digit phone numbers
                    return /^[0-9]{10}$/.test(v);
                } catch (error) {
                    console.error('WhatsApp number validation error:', error);
                    return false;
                }
            },
            message: props => `${props.value} is not a valid phone number! It should contain exactly 10 digits.`
        }
    },
    userGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'UserGroup', required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
