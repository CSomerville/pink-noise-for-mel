var fs = require('fs');
var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use('/static', express.static('dist'));

app.get('/', function(req, res) {
  fs.createReadStream('dist/index.html', 'utf-8')
    .pipe(res);
});

app.listen(3000, function() {
  console.log('server is on');
});
