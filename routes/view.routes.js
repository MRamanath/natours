const express = require('express')
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')
// const bookingController = require('../controllers/bookingController')

const router = express.Router()

// Check if any alert query param is there in the url and show alerts
router.use(viewController.alerts)

router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour)
router.get('/login', authController.isLoggedIn, viewController.getLoginForm)

router.get('/me', authController.protect, viewController.getAccount)
router.get(
	'/my-tours',
	// bookingController.createBookingCheckout,
	authController.protect,
	viewController.getMyTours
)

// Without API
// router.post('/update-user-profile', authController.protect, viewController.updateUserProfile)

module.exports = router
