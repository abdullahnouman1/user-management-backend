import { Router } from "express";
import { getProj, getMultipleProj, deleteProj, updateProj, createProj } from "../controllers/project";
import { requireRole } from "../middleware/auth";

const router = Router();

router.post('/', createProj);
router.get('/', getMultipleProj);
router.get('/:id', getProj);
router.put('/:id', updateProj);
router.delete('/:id', requireRole('admin'), deleteProj);

export default router;