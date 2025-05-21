import {Router} from "express";    
import { saludo, ping, marco, abc } from "../controllers/indexcontrollers.js";



const router=Router();

router.get("/saludo", saludo);
router.get("/ping", ping);
router.get("/marco", marco);
router.get("/a/b/c", abc);

export default router;