import { NextFunction, Request, Response, Router } from "express";

import { createVendor, getVendorById, getVendors } from "@/controllers";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from admin router" });
});

router.post("/vendor", createVendor);
router.get("/vendors", getVendors);
router.get("/vendor/:id", getVendorById);

export { router as adminRouter };
