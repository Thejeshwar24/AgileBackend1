import Story from '../models/story.js';

export const createStory = async (req, res) => {
    try {
        const story = new Story(req.body);
        await story.save();
        res.status(201).send(story);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getStories = async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).send(stories);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
//
export const getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('epicId');
        if (!story) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching story', error });
    }
};

// Update a Story by ID
export const updateStory = async (req, res) => {
    try {
        const updatedStory = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStory) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json(updatedStory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating story', error });
    }
};

// Delete a Story by ID
export const deleteStory = async (req, res) => {
    try {
        const deletedStory = await Story.findByIdAndDelete(req.params.id);
        if (!deletedStory) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting story', error });
    }
};

// user name search 

// Get stories by assigned user name using query parameter
export const getStoriesByAssignedUserName = async (req, res) => {
    try {
        const { userName } = req.query;
        if (!userName) return res.status(400).json({ message: 'User name query parameter is required' });

        const stories = await Story.find({ assignedUser: userName });
        if (!stories.length) return res.status(404).json({ message: 'No stories found for this user' });

        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stories by user name', error });
    }
};
