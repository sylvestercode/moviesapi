const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const mongoose = require('mongoose')
app.use(bodyParser.json());

const dotenv = require('dotenv');



//calling the environmental variable
dotenv.config();



const { MONGODB_URL } = process.env;




// connecting to mongodb database
mongoose.connect(MONGODB_URL || 'mongodb://localhost/movieapi')
  .then(() => console.log('Connected to database..'))
  .catch(err => console.log('Could not connect to the database', err));





// import route to index.js

const authRouter = require('./src/server');  // import auth router to index

const moviesRouter = require('./router/movies'); // import movies router to index
const res = require("express/lib/response");



//set api router 


app.use('/auth', authRouter); // user authentication router

app.use('/movies', moviesRouter) // movies api router

















const PORT = 3000;
app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});