import express from 'express';
import { createStory, getStories ,updateStory,getStoryById,deleteStory} from '../controllers/storyController.js';

const router = express.Router();

router.post('/', createStory);
router.get('/', getStories);
//
router.get('/:id', getStoryById);
router.put('/:id', updateStory);
router.delete('/:id', deleteStory);
export default router;
