const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')

const Tour = require('../../models/tourModel')
const Review = require('../../models/reviewModel')
const User = require('../../models/userModel')

dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE_CLOUD.replace(
	'<PASSWORD>',
	encodeURIComponent(process.env.DATABASE_PASSWORD)
)

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('DB Connection successfull')
	})

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'))

// import data into database
const importData = async () => {
	try {
		await Tour.create(tours)
		await User.create(users, { validateBeforeSave: false })
		await Review.create(reviews)
		console.log('Data successfully loaded')
		process.exit()
	} catch (error) {
		console.log(error)
	}
}

// Delete all data from DB
const deleteData = async () => {
	try {
		await Tour.deleteMany()
		await User.deleteMany()
		await Review.deleteMany()
		console.log('Data successfully deleted')
		process.exit()
	} catch (error) {
		console.log(error)
	}
}

// console.log(process.argv)

if (process.argv[2] === '--import') {
	importData()
} else if (process.argv[2] === '--delete') {
	deleteData()
}

// to tun use
// node .\dev-data\data\import-dev-data.js --delete
// users password - test1234
