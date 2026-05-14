import { Router } from "express";
import { prisma } from "../prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.learningPlan.findMany();
    res.json(items);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.learningPlan.findUnique({
      where: { id: req.params.id },
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const created = await prisma.learningPlan.create({ data: req.body });
    res.status(201).json(created);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id: _ignored, ...data } = req.body;
    const updated = await prisma.learningPlan.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.learningPlan.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);

export default router;
