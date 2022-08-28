import {Router} from "express";

const router = Router();

//@route    GET /api/helper/1.0/healthcheck
//@desc     checks if server is running
//@access   Public
router.get("/healthcheck", (req, res, next) => {
    res.sendStatus(200)
})


export default router;