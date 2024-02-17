const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllCat, getFilledData, FormSubmistion } = require('../controllers/noDuesController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, userController.getUserByEmail);
router.get('/single_fee_amounts', verifyToken, userController.getSingleFeeHeadsAmount);
router.post('/initiate_payment', userController.getPaymentDetails);
router.post('/userId', verifyToken, userController.getUserId);
router.post('/emailCheck', authController.isAlreadyPresent);
router.get('/fetchAllCategory', getAllCat);
router.post('/getAlumniData', verifyToken, getFilledData);
router.post('/FormSubmistion', verifyToken, FormSubmistion);


module.exports = router;