const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp=require('hpp');
const cors = require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

//Rate Limiting
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000, // in 10mins, api can only be accessed up to 100 times
    max: 200
});

const app=express();
//add body parser
app.use(express.json());
//Cookie parser
app.use(cookieParser());
//Sanitize data
app.use(mongoSanitize());
//security header
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//rate limiter
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());


//router files
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');

//Mount routers
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);

const PORT=process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(()=>process.exit(1));
});