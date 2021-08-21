const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/sign-up', authController.signUp)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/password/forgot', authController.forgotPassword)
router.patch('/password/reset/:token', authController.resetPassword)

// since middleware run in sequence order we can do this
router.use(authController.protect)

router.patch('/password/update', authController.updatePassword)
router.get('/self', userController.getMe, userController.getUser)
router.patch(
	'/update/self',
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe
)
router.delete('/delete/self', userController.deleteMe)

// since middleware run in sequence order we can do this
router.use(authController.restrictTo('admin'))

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser)

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = router
