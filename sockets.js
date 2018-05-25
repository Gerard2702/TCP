const GPS = require('./protocolos/tk103')

module.exports = function(io,netserver){

    io.on("connection", websocket => {
        console.log("Cliente WEB Conectado")
        GPS.find_gps_data( init_data => {
            console.log(init_data)
            websocket.emit('initData', init_data)
        }) 
    })

    netserver.on("connection", netsocket => {
        console.log("Nuevo Cliente TCP Conectado")

        netsocket.on("data", data => {
            var dataparce = GPS.parce_data(data)
            console.log(dataparce)
            switch (dataparce.cmd){
                case "BP05":
                    netsocket.write("AP05")
                    console.log("Dispositivo Aceptado")
                break
                case "BR00":
                var gps_data = GPS.get_gps_data(dataparce.data)
                var ping = GPS.save_gps_data(dataparce.device_id, gps_data)
                console.log(ping)
                io.emit('pings',ping)
                break
                default:
            }
        })

        netsocket.on("close", () => {
            console.log("Cliente TCP Desconectado")
        })

        netsocket.on("error", error => {
            console.log("Error: ".error)
        })
    })
}