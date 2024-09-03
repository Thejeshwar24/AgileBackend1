import User from '../models/user.js';

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('userGroup');
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('userGroup');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

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

export const getUsersByName = async (req, res) => {
    try {
        const users = await User.find({ name: new RegExp(req.params.name, 'i') });
        if (!users.length) return res.status(404).json({ message: 'No users found with this name' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users by name', error });
    }
};



export const getStoriesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find stories assigned to the user by userId string
        const stories = await Story.find({ assignedUser: userId })
            .populate({
                path: 'epicId',
                select: 'epicName description' // Select only the epicName and description fields
            })
            .select('storyName description priority duration startDate endDate'); // Select the fields to display

        if (!stories.length) {
            return res.status(404).json({ message: 'No stories found for this user' });
        }
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stories', error });
    }
};