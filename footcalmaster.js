//version 4.1 (level included)
var express    = require('express');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var path = require('path');

//Database connection config
//*************************************************************************
var connection = mysql.createConnection({
  host     : '127.0.0.1', 
  //host     : '192.168.25.7',
  user     : 'root',
  password : 'Hoegaarden',
  database : 'FootCal_master'
});
//*************************************************************************

//Express route setup
//*************************************************************************
var app = express();

  app.set('port', 3000);
  app.set('porthttps', 4000);
  app.use(bodyParser.urlencoded({ extended: false}));
  app.use(bodyParser.json());
//*************************************************************************


/*CLUBS*/
//************************************************************************************************************************************************************************
app.get("/clubs/all",function(req,res){
connection.query('SELECT * from clubs', function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.get("/clubs/active",function(req,res){
connection.query('SELECT * from clubs WHERE active = 1 ORDER BY club_name ASC', function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.get("/clubs/notcurrent/:clubid",function(req,res){
connection.query('SELECT * from clubs where club_ID <> ?',req.params.clubid, function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.get("/clubs/favorites/:favorites",function(req,res){
var connquery ="SELECT * from clubs WHERE club_ID in " + req.params.favorites + " ORDER BY club_name ASC"
connection.query(connquery, function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.get("/clubs/nonfavorites/:favorites",function(req,res){
var connquery ="SELECT * from clubs WHERE club_ID NOT in " + req.params.favorites + " ORDER BY club_name ASC"
connection.query(connquery, function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});


app.get("/club/api/:clubid",function(req,res){
connection.query('SELECT CONCAT(server_address, ":", api_port) as api, server_address, level FROM clubs WHERE club_ID = ?', req.params.clubid ,function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
    console.log(err);
  }
  });
});

app.get("/club/password/:clubid",function(req,res){
connection.query('SELECT password, passprotect FROM clubs WHERE club_ID = ?', req.params.clubid ,function(err, rows, fields) {
/*connection.end();*/
  if (!err){
    console.log('The solution is: ', rows);
    res.end(JSON.stringify(rows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.post("/clubs/new",function(req,res){
  var post = {
        club_name: req.body.clubname,
        password: req.body.password,
        api_url: req.body.apiurl
    };
    console.log(post);
connection.query('INSERT INTO clubs SET ?', post, function(err,result) {
/*connection.end();*/
  if (!err){
    console.log(result);
    res.end(JSON.stringify(result.insertId));
  }else{
    console.log('Error while performing Query.');
  }
  });
});


app.put("/clubs/:clubid",function(req,res){
  var put = {
        club_name: req.body.clubname,
        password: req.body.password,
        api_url: req.body.apiurl,
        active: req.body.active
    };
    console.log(put);
connection.query('UPDATE clubs SET ? WHERE club_ID = ?',[put, req.params.clubid], function(err,result) {
  if (!err){
    console.log(result);
    res.end(JSON.stringify(result.changedRows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.put("/clubs/password/:clubid",function(req,res){
  var put = {
        password: req.body.password,
        passprotect: req.body.passprotect
    };
    console.log(put);
connection.query('UPDATE clubs SET ? WHERE club_ID = ?',[put, req.params.clubid], function(err,result) {
  if (!err){
    console.log(result);
    res.end(JSON.stringify(result.changedRows));
  }else{
    console.log('Error while performing Query.');
  }
  });
});

app.delete("/clubs/:clubid",function(req,res){
  var data = {
        clubid: req.params.clubid
    };
    console.log(data.id);
connection.query('DELETE FROM clubs WHERE club_ID = ?', data.teamid, function(err,result) {
/*connection.end();*/
  if (!err){
    console.log(result);
    res.end(JSON.stringify(result));
  }else{
    console.log('Error while performing Query.');
  }
  });
});
//************************************************************************************************************************************************************************


/*HTTP server setup*/
//*************************************************************************
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
//*************************************************************************

/*HTTP server setup*/
//*************************************************************************
/*
https.createServer({
            key: fs.readFileSync("/etc/letsencrypt/live/footcal.be/privkey.pem"),
            cert: fs.readFileSync("/etc/letsencrypt/live/footcal.be/fullchain.pem"),
            ca: fs.readFileSync("/etc/letsencrypt/live/footcal.be/chain.pem")
     }, app).listen(app.get('porthttps'), function(){
  console.log("Express SSL server listening on port " + app.get('porthttps'));
});
*/
//*************************************************************************
