import express from 'express';
import { subMitPraposal, getMyPraposal, withdrawPraposal, getJobPraposals, getPraposalById, updatePraposalStatus, adminGetAllPraposals, deletePraposal } from "../controllers/praposal.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.route("/subMitPraposal").post(secure, subMitPraposal);
router.route("/getMyPraposal").get(secure, getMyPraposal);
router.route("/withdrawPraposal/:id").put(secure, withdrawPraposal);
router.route("/getJobPraposals/:id").get(secure, getJobPraposals);
router.route("/getPraposalById/:id").get(secure, getPraposalById);
router.route("/updatePraposalStatus/:id").put(secure, updatePraposalStatus);
router.route("/adminGetAllPraposals").get(secure, adminGetAllPraposals);
router.route("/deletePraposal/:id").delete(secure, deletePraposal);


export default router;