// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/timugoClientApp';
} else {
    urlDB = "mongodb+srv://admin:y8Rf@y8Rf@bnjiYKEk8_@timugo-d2l1g.mongodb.net/test"
    //urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;