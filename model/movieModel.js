const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({



    users: {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },

    },

    movieInfo: {

        Title: { type: String, required: true },
        Released: { type: String, required: true },
        Genre: { type: String, required: true },
        Director: { type: String, required: true }

    },

    dateposted: { type: String, requierd: true },


},
    {
        timestamps: true,
    }

);


const Movies = mongoose.model('Movies', movieSchema);

module.exports = Movies;