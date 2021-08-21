import '@babel/polyfill'
import { login, logout } from './login'
import updateSettings from './settings'
import displayMap from './mapbox'
import bookTour from './stripe'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.getElementById('login')
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-settings')
const bookTourBtn = document.getElementById('book-tour')

// DELEGATION
if (mapBox) {
	const { locations } = mapBox.dataset
	const locationArray = JSON.parse(locations)
	displayMap(locationArray)
}

if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault()
		login(
			loginForm.querySelector('#email').value,
			loginForm.querySelector('#password').value
		)
	})
}

if (logoutBtn) {
	logoutBtn.addEventListener('click', logout)
}

if (userDataForm) {
	userDataForm.addEventListener('submit', (e) => {
		e.preventDefault()
		const name = userDataForm.querySelector('#name').value
		const email = userDataForm.querySelector('#email').value
		const photo = userDataForm.querySelector('#photo').files[0]

		const form = new FormData()
		form.append('name', name)
		form.append('email', email)
		form.append('photo', photo)

		updateSettings(form, 'profile')
	})
}

if (userPasswordForm) {
	userPasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault()
		document.querySelector('.btn--save-password').textContent = 'Updating...'
		const passwordCurrent =
			userPasswordForm.querySelector('#password-current').value
		const password = userPasswordForm.querySelector('#password').value
		const passwordConfirm =
			userPasswordForm.querySelector('#password-confirm').value
		await updateSettings(
			{ passwordCurrent, password, passwordConfirm },
			'password'
		)

		document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD'
		userPasswordForm.querySelectorAll('input').forEach((el) => {
			el.value = ''
		})
	})
}

if (bookTourBtn) {
	bookTourBtn.addEventListener('click', async (e) => {
		e.target.textContent = 'Processing...'
		const { tourId } = e.target.dataset
		await bookTour(tourId)
	})
}
