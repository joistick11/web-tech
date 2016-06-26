var express         = require('express');
var expressSession  = require('express-session');
var sqlite          = require('sqlite3');
var passport        = require('passport');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var LocalStrategy   = require('passport-local').Strategy;

var app = express();
var db = new sqlite.Database('db.sqlite');

// Static resources (css, images, js)
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Auth initialize
app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({ secret: 'SECRET' }));

app.use(passport.initialize());
app.use(passport.session());


// Authentication
passport.use(new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password'
    },
    function(login, password, done) {
    db.get('SELECT id, login FROM users WHERE login = ? AND password = ?', login, password, function(err, row) {
        console.log("111!!");
        if (!row) return done(null, false);
        return done(null, row);
    });
}));
passport.serializeUser(function(user, done) {
    return done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    db.get('SELECT id, login FROM users WHERE id = ?', id, function(err, row) {
        if (!row) return done(null, false);
        return done(null, row);
    });
});
app.get('/login', function(request, response){
    if (request.isAuthenticated()) {
        response.redirect('/');
    }
    response.render('login.ejs');
});
app.post('/login', passport.authenticate('local',
    {session: true, successRedirect: '/', failureRedirect: '/login' }
));
app.all('/*', function(request, response, next) {
    if (!request.isAuthenticated()) {
        response.redirect('/login');
    }
    next();  // call next() here to move on to next middleware/router
});
app.get('/logout', function (request, response) {
    request.logout();
    response.redirect('/');
});
// Authentication end

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

app.get('/news', function(request, response){
    response.render('news.ejs');
});
app.listen(process.env.PORT || 1337, function () {
   console.log('App is listening on 1337 local');
});