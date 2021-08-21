const express = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')

const router = express.Router({ mergeParams: true })

// since middleware run in sequence order we can do this
router.use(authController.protect)

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(
		authController.restrictTo('user'),
		reviewController.setTourAndUserIds,
		bookingController.checkIfBooked,
		reviewController.createReview
	)

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(
		authController.restrictTo('user', 'admin'),
		reviewController.updateReview
	)
	.delete(
		authController.restrictTo('user', 'admin'),
		reviewController.deleteReview
	)
module.exports = router
