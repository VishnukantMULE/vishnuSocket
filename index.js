const express = require('express');
const http = require('http');
const connectDB = require('./db/database');
const initializeWebSocket = require('./socket/socket'); 
// const initializeWebSocket = require('./socket/socketTest'); 

const register = require('./routes/auth/register');
const login = require('./routes/auth/login');
const activeUser=require('./routes/chat/active_user');
const deleteAllUsers=require('./routes/admin/deleteAll');

const app = express();
const server = http.createServer(app); 

app.use(express.json());

connectDB(); 

app.use('/auth', login);
app.use('/auth', register);
app.use('/chat',activeUser);


app.use('/admin', deleteAllUsers);

const PORT = process.env.PORT || 9000;

initializeWebSocket(server);


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

