//version 5.0 (level included)
var express    = require('express');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var exec = require('child_process').exec;
var pm2 = require('pm2');

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
  
    console.log(req.body);
connection.query('UPDATE clubs SET ? WHERE club_ID = ?',[req.body, req.params.clubid], function(err,result) {
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


/*COMMAND SCRIPT API's*/

app.post("/commands/createdb",function(req,res){
  //res.end(JSON.stringify("webhook successfull"));
  console.log("Creating new DB ...");
  var dbname = req.body.dbname;

  exec("sh /app/nodeprojects/github/footcalMaster/createdb.sh " + dbname, function(error, stdout, stderr) {
                    // Log success in some manner
    if (error !== null) {
      console.log(error);
      res.end(JSON.stringify("error"));

    } else {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.end(JSON.stringify('success'));
    }                  
  });
});

app.post("/commands/createapi",function(req,res){
  //res.end(JSON.stringify("webhook successfull"));
  console.log("Creating new API ...");

var clubid = req.body.clubid;
var clubname = '"' + req.body.clubname + '"';
var clubbasenr = req.body.clubbasenr;
var clubbasenr = req.body.clubbasenr;
var dbname = req.body.dbname;
var serverdir = req.body.serverdir;
var apiport = req.body.apiport;


  
  exec('sh /app/nodeprojects/github/footcalMaster/apisetup.sh ' + clubid + ' ' + clubname + ' ' + clubbasenr + ' ' + dbname + ' ' + serverdir + ' '  + apiport, function(error, stdout, stderr) {
                    // Log success in some manner
    if (error !== null) {
      console.log(error);
      res.end(JSON.stringify("error"));

    } else {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.end(JSON.stringify('success'));
    }                  
  });
  
});

app.get("/commands/testrun/:clubname",function(req,res){
  //res.end(JSON.stringify("webhook successfull"));
  console.log("Creating new API ...");


var clubname = '"' + req.params.clubname + '"';

  
  exec("sh /app/nodeprojects/github/test.sh " + clubname, function(error, stdout, stderr) {
                    // Log success in some manner
    if (error !== null) {
      console.log(error);
      res.end(JSON.stringify("error"));

    } else {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.end(JSON.stringify('success'));
    }                  
  });
  
});


/*PM2 API*/

app.get("/pm2/list/all",function(req,res){

pm2.connect(function(err){
  if (err) {
    console.log(err);

  } else {

    console.log("connected");
    
    pm2.list((err, processDescriptionList) => {
        console.log(processDescriptionList[0]);
        res.end(JSON.stringify(processDescriptionList[0]));
        pm2.disconnect();
    });
  } 

});

});

/*HTTP server setup*/
//*************************************************************************
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
//*************************************************************************

/*HTTP server setup*/
//*************************************************************************

https.createServer({
            key: fs.readFileSync("/etc/letsencrypt/live/footcal.be/privkey.pem"),
            cert: fs.readFileSync("/etc/letsencrypt/live/footcal.be/fullchain.pem"),
            ca: fs.readFileSync("/etc/letsencrypt/live/footcal.be/chain.pem")
     }, app).listen(app.get('porthttps'), function(){
  console.log("Express SSL server listening on port " + app.get('porthttps'));
});

//*************************************************************************
