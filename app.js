var express = require('express');
var sqlite = require('sqlite3');

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
var db = new sqlite.Database('db.sqlite');

app.get('/', function(request, response){
    db.all('select * from videos', function(err, data){
        response.render('index.ejs', {data: data});
    });
});

// Add page & action
app.get('/add', function(request, response){
    response.render('add_video.ejs');
});
app.post('/add', function(request, response){
    console.log('request on add');
    var statement = 'insert into videos (name, link, pic_link) values(?, ?, ?)';
    db.run(statement, request.query.video_name, request.query.video_link, request.query.video_pic, function () {
        response.send('added');
    });
});

app.delete('/delete', function (request, response) {
    var statement = 'delete from videos where id = ?';
    db.run(statement, request.query.id, function(){
        response.send('deleted');
    });
});

app.listen('11337', function () {
   console.log('App is listening on 11337');
});