import { Router } from 'express';

import { createVendor, getVendorById, getVendors } from '@/controllers';

const router = Router();

// Create vendor
router.post('/vendor', createVendor);

// Get all vendors
router.get('/vendors', getVendors);

// Get vendor by their id
router.get('/vendor/:id', getVendorById);

export { router as adminRouter };
