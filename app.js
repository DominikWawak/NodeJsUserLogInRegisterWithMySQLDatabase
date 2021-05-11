const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path:'./.env'});

const cookieParser = require('cookie-parser')
const app = express();
const mysql  = require('mysql');

const db = mysql.createConnection({
    host :process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
  });
  db.connect((err)=>{
    if(err){
      throw err;
      console.log("connection error")
    }
    console.log("mySQL connected")
  })


  // Create table

//   app.get('/createusertable',(req,res) =>{
//     let sql = 'CREATE TABLE users( id VARCHAR(255) , name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), wallet VARCHAR(255),PRIMARY KEY(id))';
//     db.query(sql,(err,result) =>{
//       if (err) throw err;
//       console.log(result)
//       res.send('user table created')
//     })
//   })

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(cookieParser());


// DEFINE ROUTES
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));





app.listen(3000)

