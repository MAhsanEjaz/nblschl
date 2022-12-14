const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    email: ({
        type: String,
        required: true
    }),

    password: ({
        type: String,
        required: true
    }),
    role: ({
        type: String,
        required: true
    }),
    address: ({
        type: String,
        required: true
    })
})


module.exports = mongoose.model('user', userSchema)