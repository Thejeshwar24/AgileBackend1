import UserInformation from "../models/userInformation.js";

export const createUserInformation = async (req, res) => {
    try {
        const { name, whatsappNumber, email } = req.body;

        // Step 1: Create a new UserInformation object
        const newUserInfo = new UserInformation({ name, whatsappNumber, email });

        // Step 2: Save the new UserInformation in the database
        await newUserInfo.save();

        res.status(201).json({
            success: true,
            message: 'User information created successfully',
            data: newUserInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating user information',
            error: error.message
        });
    }
};

// Get all user information
export const getUserInformation = async (req, res) => {
    try {
        const usersInfo = await UserInformation.find();

        res.status(200).json({
            success: true,
            message: 'User information retrieved successfully',
            data: usersInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user information',
            error: error.message
        });
    }
};

// Get user information by ID
export const getUserInformationById = async (req, res) => {
    try {
        const userInfo = await UserInformation.findById(req.params.id);

        if (!userInfo) {
            return res.status(404).json({
                success: false,
                message: 'User information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User information retrieved successfully',
            data: userInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user information',
            error: error.message
        });
    }
};

// Update user information
export const updateUserInformation = async (req, res) => {
    try {
        const { name, whatsappNumber, email } = req.body;

        const updatedUserInfo = await UserInformation.findByIdAndUpdate(req.params.id, { name, whatsappNumber, email }, { new: true, runValidators: true });

        if (!updatedUserInfo) {
            return res.status(404).json({
                success: false,
                message: 'User information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User information updated successfully',
            data: updatedUserInfo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating user information',
            error: error.message
        });
    }
};

// Delete user information
export const deleteUserInformation = async (req, res) => {
    try {
        const deletedUserInfo = await UserInformation.findByIdAndDelete(req.params.id);

        if (!deletedUserInfo) {
            return res.status(404).json({
                success: false,
                message: 'User information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User information deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user information',
            error: error.message
        });
    }
};