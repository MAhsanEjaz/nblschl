const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;


const dataScheme = mongoose.Schema({

    WorkloadI: ({
        type: String,
        required: true
    }),

    CPUUtilization: ({
        type: String,
        required: true
    }),

    Networking_Average: ({
        type: String,
        required: true
    }),

    MemoryUtilization_Average: ({
        type: String,
        required:true
    })


})

module.exports = mongoose.model('data',dataScheme)