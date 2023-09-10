const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'db1',
  password: '12345678',
});

app.get("/",(req,res)=>{
  let q = 'SELECT count(*) FROM user';
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render('home.ejs',{ count: count });
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in DB");
  }
  
});

app.get("/user",(req,res)=>{
  let q = "SELECT * FROM user";
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
      
      res.render('show.ejs',{users});
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in DB");
  }

});

app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = "SELECT * FROM user WHERE ID = ?";
  try{
    connection.query(q,[id],(err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render('edit.ejs',{ user });
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in DB");
  }
});

app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = "SELECT * FROM user WHERE ID = ?";
  try{
    connection.query(q,[id],(err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(formPass!=user.password){
        res.send("Wrong password");
      }else{
        let q2 = "UPDATE user SET username = ? WHERE id = ?";;
        connection.query(q2,[newUsername,id],(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in DB");
  }
})

app.listen("8080",()=>{
  console.log("server is listening to port 8080");
});