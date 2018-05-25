const net = require('net')
const netserver = net.createServer()
const express = require('express')
const app = express()
const webserver = require('http').createServer(app)
const io = require('socket.io')(webserver)
const config = require('./config')
const mongoose = require('mongoose')

app.use(express.static('./app/'))

mongoose.connect(config.urldb, (err,db) => {
    if (err) throw err
    console.log("CONEXION MONGODB")

    netserver.listen(config.netport, () => {
        console.log("Servidor TCP escuchando puerto ".config.netport)
    })
    
    webserver.listen(config.webport, () => {
        console.log('Servidor web escuchando puerto ',config.webport);
    })
})

require('./sockets')(io,netserver)

