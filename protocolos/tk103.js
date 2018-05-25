const Ping = require('../modelos/pings')

function parce_data (data){
    data = data.toString('utf8')
    var running = data.indexOf("B")
    if(running > 13) throw "ID Es mayor a 12 Caracteres"
    var parts = {
        b_identifier : data.substr(0,1),
        device_id    : data.substr(1,12),
        cmd          : data.substr(13,4),
        data         : data.substring(17,data.length-1),
        f_identifier : data.substr(data.length-1,1)
    }
    return parts
}

function get_gps_data (gps_data){
    var str = gps_data
    var data = {
        date		 : str.substr(0,6),
        availability : str.substr(6,1),
        latitude	 : minute_to_decimal(parseFloat(str.substr(7,9)),str.substr(16,1)),
        longitude	 : minute_to_decimal(parseFloat(str.substr(17,9)),str.substr(27,1)),
        speed	     : parseFloat(str.substr(28,5)),
        time		 : str.substr(33,6),
        orientation	 : str.substr(39,6),
        io_state     : str.substr(45,8),
        mile_post	 : str.substr(53,1),
        mile_data	 : parseInt(str.substr(54,8),16)
    };
    return data;    
}

function minute_to_decimal(pos, pos_i) {
    if (typeof(pos_i) === 'undefined') pos_i = 'N';
    var dg = parseInt(pos / 100);
    var minutes = pos - (dg * 100);
    var res = (minutes / 60) + dg;
    return (pos_i.toUpperCase() === 'S' || pos_i.toUpperCase() === 'W') ? res * -1 : res;
};

function save_gps_data(device_id,gps_data){
    let ping = new Ping()
    ping.uid = device_id
    ping.date = gps_data.date
    ping.availability = gps_data.availability
    ping.latitude = gps_data.latitude
    ping.longitude = gps_data.longitude
    ping.speed = gps_data.speed
    ping.time = gps_data.time
    ping.orientation = gps_data.orientation
    ping.io_state = gps_data.io_state
    ping.mile_post = gps_data.mile_post
    ping.mile_data = gps_data.mile_data
    ping.save((err, pingSave) => {
        if(err){
            console.log("ERROR Al GUARDAR EN BD : ".err)
        }
        console.log("PING GUARDADO") 
    }) 
    return ping
}

function find_gps_data(fn){
    Ping.find().sort({$natural:-1}).limit(1).exec( (err, res) => {
        if (err) throw err
        fn(res)
    })  
}

module.exports = {
    parce_data,
    get_gps_data,
    save_gps_data,
    find_gps_data
}