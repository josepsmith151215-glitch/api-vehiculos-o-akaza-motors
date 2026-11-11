import { Router } from 'express';
import { 
  getVehiculos, 
  getVehiculoById, 
  createVehiculo, 
  updateVehiculo, 
  deleteVehiculo 
} from '../controllers/vehiculo.controller.js';

const router = Router();

router.get('/vehiculos', getVehiculos);
router.get('/vehiculos/:id', getVehiculoById);
router.post('/vehiculos', createVehiculo);
router.put('/vehiculos/:id', updateVehiculo);
router.delete('/vehiculos/:id', deleteVehiculo);

export default router;