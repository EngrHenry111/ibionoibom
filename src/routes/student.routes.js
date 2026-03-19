import { forgotPassword, resetPassword } from "../controllers/student.controller";
// import { resetPassword } from "../controllers/student.controller";

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);