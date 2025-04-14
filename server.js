const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/Users');

dotenv.config();
app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGOURL)
.then(()=>console.log("Connected to mongoDb"))
.catch((err)=>console.log(err));

app.listen(process.env.PORT || 3000  , () => console.log(`Connect to server at ${process.env.PORT}!`))

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/users', userRoutes);
