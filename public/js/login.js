import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
	try {
		const result = await axios({
			method: 'POST',
			// url: `${process.env.APP_URl}/api/v1/users/login`,
			url: '/api/v1/users/login',
			data: {
				email: email,
				password: password
			}
		})

		if (result.data.status === 'success') {
			showAlert('success', 'Logged in successfully!')
			window.setTimeout(() => {
				window.location.assign('/')
			}, 1500)
		}
	} catch (err) {
		showAlert('error', err.response.data.message)
	}
}

export const logout = async () => {
	try {
		const result = await axios({
			method: 'GET',
			// url: `${process.env.APP_URl}/api/v1/users/logout`
			url: '/api/v1/users/logout'
		})

		if (result.data.status === 'success') {
			showAlert('success', 'Logged out successfully!')
			window.location.assign('/')
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
