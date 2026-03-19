import { generateLetter, verifyBursary } from "../controllers/bursary.controller.js";
import { protectStudent } from "../middlewares/studentAuth.js";
import { getMyApplications } from "../controllers/bursary.controller.js";

router.get("/my", protectStudent, getMyApplications);
router.get("/letter/:id", generateLetter);

router.get("/verify/:code", verifyBursary)

