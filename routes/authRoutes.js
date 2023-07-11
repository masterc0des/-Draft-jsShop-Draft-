const { Router }        = require('express');
const authController    = require('../controllers/authController');

const router = Router();

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/register', authController.signup_get);
router.post('/register', authController.signup_post);
router.get('/logout', authController.logout_get);
router.post('/updateacc_post', authController.updateacc_post);

module.exports = router;