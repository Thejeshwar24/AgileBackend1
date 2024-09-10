import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true,trim:true },
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
    userGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'UserGroup' ,required:true},
});

const User = mongoose.model('User', userSchema);

export default User;
