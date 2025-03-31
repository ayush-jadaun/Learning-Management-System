import express from "express"

import { checkHealth } from "../controllers/heatlh.controller"

const router= express.Router()

router.get("/",checkHealth)

export default router;
