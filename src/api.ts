import express from 'express';
import cors from 'cors';
import { MongoClient, Db, Collection } from 'mongodb';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
	res.status(200).send({ status: 'ok' });
});

const api = express.Router();

// Connection URI
const uri = 'mongodb://mongo:SXo216P8OZjWL3ERi3Pq@containers-us-west-60.railway.app:6502';

// Database and collection names
const dbName = 'test';
const resultsCollectionName = 'results';
const feedbackCollectionName = 'feedback';


// Create a new MongoClient
const client = new MongoClient(uri);
let db: Db;
let resultsCollection: Collection;
let feedbackCollection: Collection;

// Connect to the MongoDB server
try {
	await client.connect();
	console.log('Connected to the database');
	db = client.db(dbName);
	resultsCollection = db.collection(resultsCollectionName);
	feedbackCollection = db.collection(feedbackCollectionName);
} catch (err) {
	console.error('Failed to connect to the database:', err);
	process.exit(1);
}

// Handle POST request for test results
app.post('/results', (req, res) => {
	const { topic, username, score } = req.body;

	// Insert the results into the collection
	resultsCollection.insertOne({ topic, username, score })
	.then(() => {
		res.sendStatus(200);
	})
	.catch((err) => {
		console.error('Failed to insert test results:', err);
		res.sendStatus(500);
	});
});

// Handle POST request for feedback
app.post('/feedback', (req, res) => {
	const { firstName, lastName, phoneNumber, message } = req.body;

	// Insert the feedback into the collection
	feedbackCollection.insertOne({ firstName, lastName, phoneNumber, message })
	.then(() => {
		res.sendStatus(200);
	})
	.catch((err) => {
		console.error('Failed to insert feedback:', err);
		res.sendStatus(500);
	});
});

// Version the api
app.use('/api/v1', api);