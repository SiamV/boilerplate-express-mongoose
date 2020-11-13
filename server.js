import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from "./config.js";

const app = express();

const middleware = [
    cors(),
    // express.static(path.resolve(__dirname, './assets')),
    bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
    bodyParser.json({ limit: '50mb', extended: true }),
  ]
  
  middleware.forEach((it) => app.use(it))

//constants mongoDB. Use your real url or mongodb://127.0.0.1/nameDB to connect to DB
const url = config.url;
//connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    app.listen(config.port, () => {
        console.log(`server is working http://localhost:${config.port}`)
    });
})

const userSchema = new mongoose.Schema(
    {
        "id" : Number,
        "first_name" : String,
        "last_name" : String,
        "avatar" : String,
        "email" : String,
        "occupation" : String,
        "city" : String
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
		first_name: req.body.first_name
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