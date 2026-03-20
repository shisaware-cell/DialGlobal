import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import numbersRouter from "./numbers";
import messagesRouter from "./messages";
import callsRouter from "./calls";
import webhooksRouter from "./webhooks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(numbersRouter);
router.use(messagesRouter);
router.use(callsRouter);
router.use(webhooksRouter);

export default router;
