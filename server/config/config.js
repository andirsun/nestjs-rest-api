// ============================
//  Port BY Default
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Enviroment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
//  Database
// ============================
let urlDB;
/*
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/timugoClientApp';
} else {
    urlDB = "mongodb+srv://admin:y8Rf@y8Rf@bnjiYKEk8_@timugo-d2l1g.mongodb.net/test"
    //urlDB = process.env.MONGO_URI;
}*/



//urlDB = 'mongodb://localhost:27017/timugoClientApp';
urlDB ="mongodb+srv://admin:y8Rf@bnjiYKEk8_@timugo-d2l1g.mongodb.net/timugoBackend";

process.env.URLDB = urlDB;
// ============================
//  Token Expiration
// ============================
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

// ============================
//  seed of the token
// ============================

process.env.TOKEN_SEED = process.env.TOKEN_SEED || "tokenSeed";
