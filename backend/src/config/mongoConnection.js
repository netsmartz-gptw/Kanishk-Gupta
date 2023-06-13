require('dotenv').config()
const mongoose = require('mongoose')

const atlasBaseUrl = process.env.MONGO_ATLAS_URL
const finalUrl = `${atlasBaseUrl}/${process.env.MONGO_DATABASE_LIVE}?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`

const connectionUrl = process.env.NODE_ENV === "production" ? encodeURI(finalUrl) : `mongodb://localhost:27017/${process.env.MONGO_DATABASE_DEV}`;
mongoose.connect(connectionUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsCAFile: __dirname + `/rds-combined-ca-bundle.pem`
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = db;