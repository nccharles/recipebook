var express=require("express"),
    path= require('path'),
    bodyParser = require('body-parser'),
    cons = require("consolidate"),
    dust = require("dustjs-helpers"),
    pg = require("pg"),
    app = express();
    // DB connect String
    var connectionString = "postgres://charles:ncpass@localhost:5432/recipebookdb";

    // Assign Dust Engine To .dust Files
    app.engine('dust', cons.dust);

    //Set default Ext .dust 
    app.set('view engine', 'dust');
    app.set('views', __dirname + '/views');

    // Set Public Folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Body parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));
    
    app.get('/', function (req, res, next) {
            pg.connect(connectionString,function(err,client,done) {
               if(err){
                   console.log("not able to get connection "+ err);
               } 
               client.query('SELECT * FROM recipes',function(err,result) {
                   if(err){
                       console.log(err);
                   }
                   res.render('index', {recipes: result.rows});
                   done(); // closing the connection;
                
               });
            });
    });
    app.post("/add", function(req, res){
        pg.connect(connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
            } 
            client.query("INSERT INTO recipes(name,ingredients,directions) VALUES($1,$2,$3)",
            [req.body.name, req.body.ingredients, req.body.directions]);
            done();
            res.redirect('/');
         });  
    });
    app.delete("/delete/:id", function(req,res){
      pg.connect(connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
            } 
            client.query("DELETE FROM recipes WHERE id= $1",
            [req.params.id]);
            done();
            res.send(200);
         });
    });
    app.post("/edit", function(req, res){
        pg.connect(connectionString,function(err,client,done) {
            if(err){
                console.log("not able to get connection "+ err);
            } 
            client.query("UPDATE recipes SET name=$1,ingredients=$2,directions=$3 WHERE id=$4",
            [req.body.name, req.body.ingredients, req.body.directions,req.body.id]);
            done();
            res.redirect('/');
         });  
    });
    app.listen(3000, function () {
        console.log('Server is running.. on Port 3000');
    });
