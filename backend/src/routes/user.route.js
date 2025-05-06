import express from 'express';
import { getMyFriends, getRecommededUsers,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs } from '../controller/user.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.use(protectedRoute)
router.get("/",getRecommededUsers)
router.get("/friends",getMyFriends)
router.post("/friends-request/:id",sendFriendRequest)
router.post("/friends-request/:id/accept",acceptFriendRequest)
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);


export default router;