import axios from 'axios'
import { showAlert } from './alerts'

const updateSettings = async (data, type) => {
	try {
		const url =
			type === 'password'
				? `${process.env.APP_URl}/api/v1/users/password/update`
				: `${process.env.APP_URl}/api/v1/users/update/self`

		const result = await axios({ method: 'PATCH', url, data })

		if (result.data.status === 'success') {
			showAlert('success', `User ${type} updated successfully!`)
		}
	} catch (err) {
		showAlert('error', err.response.data.message)
	}
}

export default updateSettings
