import express from "express"
import { addTask, getTask, removeTask, completeTask} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask",requireAuth, getTask)
router.get("/completeTask/:id",requireAuth, completeTask)
router.post("/removeTask",requireAuth, removeTask)

export default router;