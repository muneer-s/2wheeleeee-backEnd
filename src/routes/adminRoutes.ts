import express from 'express';
import { AdminController } from '../controllers/adminController';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';
import AdminServices from '../services/adminServices';
import AdminRepository from '../repositories/adminRepository';


const repository = new AdminRepository()
const adminServices = new AdminServices(repository);
const adminController = new AdminController(adminServices);

const adminRouter = express.Router();


adminRouter
  .post('/login', (req, res) => {adminController.login(req, res)})
  .get('/logout', (req, res) => adminController.logout(req, res))
  .get('/getAllUsers', adminAuthMiddleware, (req, res) => adminController.getAllUsers(req, res))
  .get('/getSingleUser/:id', adminAuthMiddleware, (req, res) => adminController.getSingleUser(req, res))
  .put('/userVerify/:id', adminAuthMiddleware, (req, res) => adminController.userVerify(req, res))
  .put('/userBlockUnBlock/:id', adminAuthMiddleware, (req, res) => adminController.userBlockUnBlock(req, res))
  .post('/checkBlockedStatus', (req, res) => {adminController.checkBlockedStatus(req, res)})
  .get('/getAllBikeDetails', adminAuthMiddleware, (req, res) => adminController.getAllBikeDetails(req, res))
  .put('/verifyHost/:id', adminAuthMiddleware, (req, res) => adminController.verifyHost(req, res))
  .put('/isEditOn/:id', adminAuthMiddleware, (req, res) => adminController.isEditOn(req, res));






// adminRouter
//   .post('/login', (req, res) =>  adminController.login(req, res));

// adminRouter.get('/logout', (req, res) => {
//         adminController.logout(req, res);
// });

// adminRouter.get('/getAllUsers', adminAuthMiddleware, (req, res) => {        
//         adminController.getAllUsers(req, res)
// })

// adminRouter.get('/getSingleUser/:id', adminAuthMiddleware, (req, res) => {
//         adminController.getSingleUser(req, res)
// })

// adminRouter.put('/userVerify/:id', adminAuthMiddleware, (req, res) => {
//         adminController.userVerify(req, res)
// })


// adminRouter.put('/userBlockUnBlock/:id', adminAuthMiddleware, (req, res) => {
//         adminController.userBlockUnBlock(req, res)
// })

// adminRouter.post('/checkBlockedStatus', (req, res) => {
//         adminController.checkBlockedStatus(req, res)
// })

// adminRouter.get('/getAllBikeDetails', adminAuthMiddleware, (req, res) => {
//         adminController.getAllBikeDetails(req, res)
// })

// adminRouter.put('/verifyHost/:id', adminAuthMiddleware, (req, res) => {
//         adminController.verifyHost(req, res)
// })

// adminRouter.put('/isEditOn/:id', adminAuthMiddleware, (req, res) => {
//         adminController.isEditOn(req, res);
// });





export default adminRouter;
