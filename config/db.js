const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true); //to suppress deprecated warning
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function connectDB() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// connectDB().catch(console.dir);

module.exports = connectDB;