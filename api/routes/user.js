// NPM Packages
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');



router.post('/signup', UserController.user_signup);

router.post('/loginSoial', UserController.loginSoial);

router.get('/', UserController.findAll);

router.get('/searchdoctors', UserController.searchdoctors);

router.get('/:userId', UserController.user_get_id);

router.get('/findByUsername/:username', UserController.user_get_by_username);

router.get('/findByUsername_update_view_count/:username', UserController.user_update_view_count);

router.post('/signin', UserController.user_login);

router.post('/create_doctor/', UserController.users_create_doctor);

router.patch('/:userId', UserController.users_update_user);

router.post('/updatePassword/:userId',checkAuth, UserController.users_update_user_password);

router.delete('/:userId',checkAuth, UserController.user_delete_user);

router.post('/req-reset-password/', UserController.passwordResetRequest);
router.post('/addToFavouriteList/', UserController.addToFavouriteList);

router.post('/valid-password-token/', UserController.validpasswordtoken);
router.post('/new-password', UserController.NewPassword);


module.exports = router;