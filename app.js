const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const csp = require('express-csp')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tour.routes')
const userRouter = require('./routes/user.routes')
const reviewRouter = require('./routes/review.routes')
const bookingRouter = require('./routes/booking.routes')
const bookingController = require('./controllers/bookingController')
const viewRouter = require('./routes/view.routes')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(cors())
// Access-Control-Allow-Origin '*'
// Subdomain - api.natours.com, frontend - natours.com
// app.use(
// 	cors({
// 		origin: 'https://www.natours.com'
// 	})
// )

// Instead of a specific route, enabling for all route for different kind of requests like PUT, PATCH, DELETE
// app.options('/api/v1/tours/:id', cors())
app.options('*', cors())

app.use(express.static(path.join(__dirname, 'public')))
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'", 'https://*.mapbox.com', 'https://*.stripe.com'],
				baseUri: ["'self'"],
				fontSrc: ["'self'", 'https:', 'data:'],
				imgSrc: ["'self'", 'https://www.gstatic.com'],
				scriptSrc: [
					"'self'",
					'https://*.stripe.com',
					'https://cdnjs.cloudflare.com',
					'https://api.mapbox.com',
					'https://js.stripe.com',
					"'blob'"
				],
				frameSrc: ["'self'", 'https://*.stripe.com'],
				objectSrc: ["'none'"],
				upgradeInsecureRequests: []
			}
		}
	})
)

csp.extend(app, {
	policy: {
		directives: {
			'default-src': ['self'],
			'style-src': ['self', 'unsafe-inline', 'https:'],
			'font-src': ['self', 'https://fonts.gstatic.com'],
			'script-src': [
				'self',
				'unsafe-inline',
				'data',
				'blob',
				'https://js.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:8828',
				'ws://localhost:56558/'
			],
			'worker-src': [
				'self',
				'unsafe-inline',
				'data:',
				'blob:',
				'https://*.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:*',
				'ws://localhost:*/'
			],
			'frame-src': [
				'self',
				'unsafe-inline',
				'data:',
				'blob:',
				'https://*.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:*',
				'ws://localhost:*/'
			],
			'img-src': [
				'self',
				'unsafe-inline',
				'data:',
				'blob:',
				'https://*.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:*',
				'ws://localhost:*/'
			],
			'connect-src': [
				'self',
				'unsafe-inline',
				'data:',
				'blob:',
				// 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
				'https://*.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:*',
				'ws://localhost:*/'
			]
		}
	}
})

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this ip. Please try again in an hour!'
})

app.use('/api', limiter)

// Stripe Webhook Checkout
app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	bookingController.webhookCheckout
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

app.use(mongoSanitize())

app.use(xss())

app.use(
	hpp({
		whitelist: [
			'duration',
			'maxGroupSize',
			'difficulty',
			'ratingsAverage',
			'ratingsQuantity',
			'price'
		]
	})
)

app.use(compression())

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()
	next()
})

// Router Mounting
app.use('/', viewRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

// Server Start
module.exports = app
