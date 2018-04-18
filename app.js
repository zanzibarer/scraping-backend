let app = require('express')();
let http = require('http').Server(app);

app.get('/test', function(req, res){
	res.send('this is my test');
});

http.listen(5000, () =>{
	console.log('started on port 5000');
});