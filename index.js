const express = require('express');
const res = require('express/lib/response');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'dancers';
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = 3000
app.use(express.static('frontend'));
app.get('/getusers', (req, res) =>{
	client.connect();
	const db = client.db(dbName);
	userCollection.find().toArray().then((users)=>{
		res.json(users);
	})
})

app.post('/regform', (req, res) => {
	if(!req.body) return res.status(400).send('Bad Request');
	client.connect();
	const db = client.db(dbName);
	const userCollection = db.collection('user'); 
	const newUser = req.body;
	userCollection.countDocuments({})
	.then((value)=> {
		if (value > 2) {
			userCollection.find({}).limit(2)
			return res.json({message: `Превышен лимит записи, всего записей ${value}`}).end();
		}
	}).catch(()=> {
		console.log('Limit error')
		res.status(403).send('Limit')
		client.close()
		return
	})
	// async function lim() {
	// 	const value = await userCollection.countDocuments({})
	// 	if (value > 2) return res.status(403).json({message: 'Количество пользователей больше количества мест'}).end();
	// 	client.close();
	// }
	// lim()
	userCollection.findOne(
		{email: newUser.email,
		 phone: newUser.phone})
		.then((user) => {
				if(user == null){
				userCollection.insertOne(newUser)
				.then(()=>{
					res.json({error: false, message: `Пользователь записан!`}).end();
					return
				})
				.catch((err)=> {
					console.log('Insert data to Db', err)
					client.close();
					return
				})	  
				} else
					res.json({error: true , message: 'Пользователь уже существует'}).end();
				}).catch((err)=>{
					console.log('error in DB');
					res.status(500).send('server side error');
					client.close();
				})
						return;
				})
app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})