const WebSocket = require('ws');
const connectDB = require('./db/database');
const express = require('express');
const http = require('http');


const register=require('./routes/auth/register');
const login=require('./routes/auth/login');


const app = express();
const server = http.createServer(app);
app.use(express.json());


connectDB();




app.use('/auth',login);
app.use('/auth',register);


const port = process.env.PORT || 9000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
  });

