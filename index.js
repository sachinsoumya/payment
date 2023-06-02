const app = require('express')()
// const path = require('path')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_802ODDmhsfzkk1',
	key_secret: 'zaldjQMXgUwZ5eVDno0sJddB'
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = 'zaldjQMXgUwZ5eVDno0sJddB'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
    // console.log("Create orderId request" , req.body)
    // console.log(JSON.stringify(req.body))
    const payment_capture = 1
	const amount = req.body.cost
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: "order_rcptid_11",
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		// console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
		res.json({
			id:""
		})
	}


})

app.listen(4200, () => {
	console.log('Listening on 4200')
})