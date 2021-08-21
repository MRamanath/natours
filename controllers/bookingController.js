const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	const { tourId } = req.params
	const { protocol } = req
	const host = req.get('host')
	// const userId = req.user.id

	const tour = await Tour.findById(tourId)

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		// success_url: `${protocol}://${host}/my-tours/?tour=${tourId}&user=${userId}&price=${tour.price}`,
		success_url: `${protocol}://${host}/my-tours`,
		cancel_url: `${protocol}://${host}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: tourId,
		line_items: [
			{
				name: `${tour.name} Tour`,
				description: tour.summary,
				images: [`${protocol}://${host}/img/tours/${tour.imageCover}`],
				amount: tour.price * 100,
				currency: 'usd',
				quantity: 1
			}
		],
		mode: 'payment'
	})

	res.status(200).json({ status: 'success', session })
})

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
// 	// Temporary solution
// 	const { tour, user, price } = req.query
// 	if (!user && !tour && !price) {
// 		return next()
// 	}

// 	await Booking.create({ tour, user, price })
// 	res.redirect(req.originalUrl.split('?')[0])
// })

exports.checkIfBooked = catchAsync(async (req, res, next) => {
	// To check if tour was bought by user who wants to review it
	const booking = await Booking.find({ user: req.user.id, tour: req.body.tour })
	if (booking.length === 0)
		return next(new AppError('You must buy this tour to review it', 401))
	next()
})

const createBookingCheckout = async (session) => {
	const tour = session.client_reference_id
	const user = (await User.findOne({ email: session.customer_email })).id
	const price = session.line_items[0].amount / 100
	await Booking.create({ tour, user, price })
}

exports.webhookCheckout = (req, res, next) => {
	const signature = req.headers['stripe-signature']
	let event
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		)
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`)
	}

	if (event.type === 'checkout.session.completed') {
		createBookingCheckout(event.data.object)
	}

	res.status(200).json({ received: true })
}

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBookings = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)
