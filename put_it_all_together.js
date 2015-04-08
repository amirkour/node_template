var express = require('express'),
    app = express(),
    fs = require('fs'),
    stylus = require('stylus'),
    port = process.argv[2],
    absolutePathToJSONFile = process.argv[3],

    // this has to be the fully-qualified path to a folder,
    // typically "/public"
    absolutePathToPublicAssets = process.argv[4],

    // as should this - typicall "/templates"
    absolutePathToTemplateFolder = process.argv[5];

// To parse x-www-form-urlencoded request bodies Express.js can use urlencoded()
// middleware from the body-parser module.
var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended: false}))

// note that express is defaulting to the index.html file located
// at the given path - and the given path is expected to be a folder.
console.log("html and css should be located here: " + absolutePathToPublicAssets);
app.use(express.static(absolutePathToPublicAssets));


// and enable the 'stylus' compiler.
// note that normally your public assets are located at
// <root folder>/public
//
// files located in your public/ subfolder can be referenced
// in html from the root.  ie: if foo.css is at public/foo.css,
// you'd reference it like this in html:
// <link href="/foo.css" ... />
//
// see!?  exclude the 'public' folder ...
app.use(stylus.middleware(absolutePathToPublicAssets));


// enable jade templates
app.set('views', absolutePathToTemplateFolder);
app.set('view engine', 'jade');


// parse query params and kick it back as json
app.get("/search", function(req,res){
    console.log("Search ...");
    console.log(req.query || "no query to log");

    if(!req.query){
        res.send({});   //  note: using res.send kicks back json!?!
        return;
    }

    var toRet = {};
    for(var key in req.query) toRet[key] = req.query[key];

    res.send(toRet); //  note: using res.send kicks back json!?!
});

// read json from a file and pipe it back
app.get("/books", function(req,res){
    console.log("A request for books!");

    json = fs.readFileSync(absolutePathToJSONFile);
    json = JSON.parse(json);

    res.json(json);
});

// test out a template!
app.get('/home', function(req,res){
    console.log("/home");
    res.render('index', {date: new Date().toDateString()});
});

// parse/barf form params!
app.post('/form', function(req,res){
    console.log("Post to /form");
    if(!req.body){
        console.log('no body, returning!');
        res.end("nothing to say!");
        return;
    }
    if(!req.body.str){
        console.log("user did not input anything in the form");
        res.end("Nothing to show!");
        return;
    }
    
    var strReversed = req.body.str.split('').reverse().join('');
    res.end(strReversed);
});

console.log('listening on port ' + port);
console.log('serving back file at path ' + absolutePathToJSONFile);
app.listen(port);