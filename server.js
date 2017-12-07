l = console.log;
process.stdout.write('\033c');
l('Running');

let express = require('express');
let _ 	    = require('lodash');
let fs      = require('fs-extra');
let path    = require('path');

let app    = express();
let server = require('http').createServer(app);
let bodyParser = require('body-parser');

let data = [];

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/list', (req, res, next) => {
    fs.readdir('data', (err, files) => {
        res.send(JSON.stringify(files))
    })
});

app.post('/store/:name/:field', (req, res, next) => {
    l("Incoming store! Name: " + req.params.name + ", Field: " + req.params.field);
    storeData(req.params.name, req.params.field, req.body)
    .then(() => {
        l("Success!");
        res.send({
            "error" : false
        })
    }).catch((e) => {
        l("Error!");
        res.send({
            "error" : true
        })
    })

});


server.listen(3000);

function storeData(name, field, data){
    l("Storing data for " + name + " -> " + field);

    let dataString = _.map(data, v => v).join(',') + "\r\n";
    let filepath = path.join('./', 'data', name, field + ".csv");

    return new Promise((resolve, reject) => {
        fs.ensureFile(filepath)
        .then(fs.appendFile(filepath, dataString))
        .then(resolve)
    })
}

