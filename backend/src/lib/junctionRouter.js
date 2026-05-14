import { Router } from "express";
import { prisma } from "../prisma.js";
import { asyncHandler } from "./asyncHandler.js";

// Builds a CRUD router for a junction table with a composite primary key.
//   model: Prisma client property name (e.g. "apprenticeshipQualification")
//   keys:  the two PK field names, in the order declared by @@id (e.g. ["apprenticeship_id", "qualification_id"])
//
// URLs:
//   GET    /
//   POST   /                       (body has both keys + any extra columns)
//   PATCH  /:k1Value/:k2Value      (body has just the columns to change)
//   DELETE /:k1Value/:k2Value
export function createJunctionRouter({ model, keys }) {
  const [k1, k2] = keys;
  const compositeKey = `${k1}_${k2}`;
  const whereFor = (req) => ({
    [compositeKey]: { [k1]: req.params[k1], [k2]: req.params[k2] },
  });

  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json(await prisma[model].findMany());
    }),
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const created = await prisma[model].create({ data: req.body });
      res.status(201).json(created);
    }),
  );

  router.patch(
    `/:${k1}/:${k2}`,
    asyncHandler(async (req, res) => {
      const { [k1]: _a, [k2]: _b, ...data } = req.body;
      const updated = await prisma[model].update({
        where: whereFor(req),
        data,
      });
      res.json(updated);
    }),
  );

  router.delete(
    `/:${k1}/:${k2}`,
    asyncHandler(async (req, res) => {
      await prisma[model].delete({ where: whereFor(req) });
      res.status(204).end();
    }),
  );

  return router;
}
