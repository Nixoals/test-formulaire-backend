const express = require('express');
const cors = require('cors');
require('dotenv').config();

const API_KEY = process.env.API_MAILGUN;
const DOMAIN = process.env.DOMAIN_MAILGUN;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

const app = express();
app.use(express.json());
app.use(cors());

app.post('/submit-form', async (req, res) => {
	try {
		const data = req.body;

		const messageData = {
			from: `${data.firstname}: ${data.lastname}, <${data.email}>`,
			to: 'nicolasgodeau1@gmail.com',
			subject: data.subject,
			text: data.message,
		};
		console.log(data);
		const result = await client.messages.create(DOMAIN, messageData);

		res.status(200).json('successfully send message');
	} catch (error) {
		res.status(400).json(error.message);
	}
});

app.all('/', (req, res) => {
	try {
		res.json('this route does not exist');
	} catch (error) {
		res.status(400).json(error.message);
	}
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server has started on port ${port}`);
});
