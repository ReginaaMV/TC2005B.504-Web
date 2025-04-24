import { Router} from "express";
import { saludo, ping, marco, abc } from "../controllers/indexController.js";


const router=Router();

router.get("/saludo", saldo);
router.get("/ping", ping);
router.get("/marco", marco);
router.get("/a/b/c", abc);

export default router;