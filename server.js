const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//constants mongoDB. Use your real url or mongodb://127.0.0.1/nameDB to connect to DB
const url = 'mongodb+srv://adminDB:GJ7HncFNIHNkN6yQ@test1.wwbas.mongodb.net/test1'
//connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    app.listen(8090, () => {
        console.log('server is working http://localhost:8090')
    });
})

const userSchema = new mongoose.Schema(
    {
        "name": String
    },{versionKey: false}
)

const User = mongoose.model('users', userSchema);

app.get('/', (req, res) => {
    res.send('Hello server')
})

app.get("/v1/users", async (req, res) => {
	const users = await User.find({})
	res.send(users)
})

app.get("/v1/users/:id", async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	res.send(user)
})

app.post("/v1/add/user", async (req, res) => {
	const user = new User({
		name: req.body.name
	})
	user.save()
	res.send(user)
})

app.delete("/v1/users/delete/:id", async (req, res) => {
	try {
		await User.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "User doesn't exist!" })
	}
})