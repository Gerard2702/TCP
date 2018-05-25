const mongoose = require('mongoose')
const schema = mongoose.Schema

const pingsSchema = new schema({
    uid : String,
    date :  String,
    availability : String,
    latitude : Number,
    longitude : Number,
    speed : Number,
    time : String,
    orientation : String,
    io_state : String,
    mile_post : String,
    mile_data : String
})

module.exports = mongoose.model('pings',pingsSchema)