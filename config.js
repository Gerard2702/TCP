module.exports = {
    webport : "8080",
    netport : "5002",
    urldb : process.env.MONGODB || 'mongodb://localhost:27017/mi-tcp'
}