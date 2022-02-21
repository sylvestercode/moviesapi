const express = require("express");

const jwt = require("jsonwebtoken");

const axios = require("axios");

const Movies = require("../model/movieModel")
const moviesRouter = express.Router();


// destructuring the .env file

const { JWT_SECRET, omdbapiurl } = process.env;







// post route for fetching and adding new movies to the database

moviesRouter.post("/", async (req, res) => {






    // assigning headers to a constant
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    //destructure the response from the request body
    const { title } = req.body;


    try {


        // validating token

        if (!token) {


            // if token does not exist send out a message ith token is not available
            res.send({
                auth: false,
                message: "Token not available",
            });



        } else {


            // if token exist we would take of the inital string and space beofre the token string
            if (token.startsWith("Bearer ")) {

                // Removing bearer and space 
                tokenformated = token.slice(7, token.length);
            }




            //verify the token if it matched what we have  and also decode the token
            jwt.verify(tokenformated, JWT_SECRET, (err, decoded) => {



                //checking if there is an error
                if (err) {

                    // if token is mismatched you we would  send a  message saying token is invalid 
                    return res.json({
                        success: false,
                        message: "Token is not valid",
                    });
                } else {



                    // if token is correct  we would move ahead to fecth title from our external api


                    if (title) {  // if title is available in the body request the below  will be rendered



                        //  making an async call to the external api in to fetch user movie info base on the title provided
                        const movies = async () => {

                            const response = await axios.get(`${omdbapiurl}${title}`) // making the pai reuest
                                .then(// returning a promise 
                                    async (response) => {


                                        const month = new Date().getMonth() + 1;     // 10 (Month is 0-based, so 10 means 11th Month)
                                        const year = new Date().getFullYear();   // 2020

                                        const datandmonth = month + '/' + year;
                                        // assigning data gotten to a constant 
                                        const movieInfo = {


                                            "Title": response.data.Title,
                                            "Released": response.data.Year,
                                            "Genre": response.data.Genre,
                                            "Director": response.data.Director

                                        }

                                        //assigning user info to constant

                                        const users = {

                                            "userId": decoded.userId,
                                            "name": decoded.name,
                                            "role": decoded.role,


                                        }


                                        //assigning current month and date to constant


                                        const dateposted = datandmonth;

                                        //   console.log(movieInfo)


                                        if (movieInfo.Title != undefined) {  // if movie title is available the blow operation takes place 

                                            if (decoded.role == 'basic') { // if user role is = basic the below function will run


                                                // checking if usersid and date exist 

                                                const votes = await Movies.find(

                                                    {
                                                        "users.userId": users.userId,
                                                        "dateposted": dateposted

                                                    })


                                                // checking if the user entry for this month is greater or = 5 
                                                if (votes.length >= 5) {


                                                    // sending back an error if the user has made up to 5 movie post for the particular month
                                                    res.send({
                                                        ErrorMessage: 'You have exceeded your monthly quaota of 5 post a month as a basic user'
                                                    })

                                                } else { // if the user has not reach the maximum of five post for this month run the below operation



                                                    //instantiate the movie

                                                    const movie = new Movies({

                                                        users: users,
                                                        movieInfo: movieInfo,
                                                        dateposted: dateposted,

                                                    });

                                                    // save the movie to the database
                                                    const movieAdded = await movie.save();


                                                    // if the movie is added successfuly run the below query

                                                    if (movieAdded) {

                                                        // send back a message with success message and addedd information
                                                        res.send({

                                                            message: 'Movie Added Successfully',
                                                            addedPost: movieAdded


                                                        })


                                                    }
                                                }



                                            } else {// if the user is a premium user run the code below

                                                // instantiate the movie 

                                                const movie = new Movies({

                                                    users: users,
                                                    movieInfo: movieInfo,
                                                    dateposted: dateposted,

                                                });


                                                // save movie to database
                                                const movieAdded = await movie.save();

                                                // if saved successfully, run the below operation
                                                if (movieAdded) {

                                                    // send a success message back to the use 
                                                    res.send({

                                                        message: 'Movie Added Successfully',
                                                        addedPost: movieAdded


                                                    })


                                                }



                                            }











                                        } else {// if movie title is not available the below operation will be carried out 



                                            res.send({

                                                Error: 'That movie does not exist in our database! Try another movie'

                                            })
                                        }


                                    }
                                )
                                .catch((error) => [
                                    console.log('Err', error)
                                ]);





                            return response




                        }

                        return movies();

                    } else {


                        res.send({
                            ErrorMessage: 'Title is required'

                        })
                    }









                }
            });
        }
    } catch (err) {

        res.send({

            FatalError: 'Unknown Error occoured'
        })

    }
});




// getting list of movies added by a verified user using their ids as params


moviesRouter.get('/:id', async (req, res) => {


    //getting a single user base on user identity
    const movies = await Movies.find({

        "users.userId": req.params.id
    })


    //if movies added by this user is available 
    if (movies) {


        //send back all the info about the added movie
        res.send({ movies: movies })

    } else {


        res.send({ ErrorMessage: 'MOvies added by user with this id is not available' })


    }


})








module.exports = moviesRouter;
