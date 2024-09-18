import User from '../models/user.js';
// import Story from '../models/story.js';
// import Task from '../models/task.js';

export const createUser = async (req, res, next) => {
    try {
        const { name, email, whatsappNumber } = req.body;

        // Check if email or WhatsApp number already exists
        const existingUser = await User.findOne({
            $or: [{ email: email }, { whatsappNumber: whatsappNumber }]
        });

        if (existingUser) {
            let errorMessage = 'User already exists with ';
            if (existingUser.email === email) {
                errorMessage += 'this email';
            }
            if (existingUser.whatsappNumber === whatsappNumber) {
                errorMessage += existingUser.email === email ? ' and WhatsApp number' : 'this WhatsApp number';
            }
            return res.status(400).send({ error: errorMessage });
        }

        // Create new user
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        console.error('Error creating user:', err);
        if (!err.status) {
            err.status = 500;
            err.message = 'Failed to create user';
        }
        res.status(err.status).send({ error: err.message });
    }
};

export const getUserByWhatsappNumber = async (req, res, next) => {
    try {
        const { whatsappNumber } = req.query;  // Get WhatsApp number from query parameter

        // Find user by WhatsApp number
        const user = await User.findOne({ whatsappNumber: whatsappNumber }).populate('userGroup');

        // If user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                invalid_message: `No user found with WhatsApp number: ${whatsappNumber}`
            });
        }

        // Prepare user data
        const userData = {
            name: user.name,
            email: user.email,
            whatsappNumber: user.whatsappNumber,
            userGroup: user.userGroup ? user.userGroup.name : 'No group assigned'
        };

        // Send response
        res.status(200).json({
            success: true,
            message: 'User found successfully.',
            welcome_message:`Welcome ${user.name}.`,
            data: userData
        });
    } catch (error) {
        // Handle error
        res.status(500).json({
            success: false,
            message: 'Error fetching user by WhatsApp number.',
            error: error.message
        });
        next(error);
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('userGroup');
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
        res.status(400).send({ error: err.message });
        err.status = 400;
        err.message = 'Failed to get user';
        next(err);
    }
};


// export const getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).populate('userGroup');
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching user', error });
//     }
// };

// Update a User by ID
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a User by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};


//
export const checkUserExists = async (req, res, next) => {
    try {
        const { name } = req.query;  // Fetch userName from the query parameter

        // Step 1: Check if the user exists by name
        const user = await User.findOne({ name: name });
        if (!user) {
            return res.status(404).json({
                success: false,
                failure_message: `User not found.`
            });
        }

        // Step 2: If the user exists, return success message
        res.status(200).json({
            success: true,
            message: `Welcome ${name}.`,
        });

    } catch (error) {
        next(error);  // Pass the error to the error handler middleware
    }
};