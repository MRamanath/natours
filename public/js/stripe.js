/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

const bookTour = async (tourId) => {
	const stripe = Stripe(
		'pk_test_51JPPo2SCcdcCAqayobAXcfW1xfYM4mS7clfw3HaeFtNqKhSbBavbU6O0CHz9zMliYp9VT2rMVW0xCFVu64rpJRFt002oIMx8hA'
	)

	try {
		const session = await axios(
			`${process.env.APP_URl}/api/v1/bookings/checkout-session/${tourId}`
		)

		await stripe.redirectToCheckout({
			sessionId: session.data.session.id
		})
	} catch (error) {
		console.log(error)
		showAlert('error', error)
	}
}

export default bookTour
