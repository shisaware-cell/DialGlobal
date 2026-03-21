import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import numbersRouter from "./numbers";
import messagesRouter from "./messages";
import callsRouter from "./calls";
import webhooksRouter from "./webhooks";
import esimRouter from "./esim";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(numbersRouter);
router.use(messagesRouter);
router.use(callsRouter);
router.use(webhooksRouter);
router.use(esimRouter);

export default router;
