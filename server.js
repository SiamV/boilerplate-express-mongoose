const express = require('express');
const mongoose = require('mongoose');

const app = express();

//constants mongoDB. Use your real url or mongodb://127.0.0.1/nameDB to connect to DB
const url = 'your url to connect'
//connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    app.listen(8090, () => {
        console.log('server is working http://localhost:8090')
    });
})

const userSchema = new mongoose.Schema(
    {
        "name": String,
    }
)

const User = mongoose.model('number1', userSchema);

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
	await user.save()
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


// router.post("/posts", async (req, res) => {
// 	const post = new Post({
// 		title: req.body.title,
// 		content: req.body.content,
// 	})
// 	await post.save()
// 	res.send(post)
// })