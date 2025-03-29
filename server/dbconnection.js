const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://dbUserHp:HariMongoDBUser@cluster-hp.folsp.mongodb.net/rock-paper-scissor?retryWrites=true&w=majority&appName=Cluster-HP";

mongoose.connect(MONGO_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB Connection Error:", err));

module.exports = mongoose;