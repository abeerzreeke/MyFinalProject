const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const app = express();
const expressLayouts = require('express-ejs-layouts');

var glob = require("glob");
var fs = require("fs");
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;

var storage_create = multer.diskStorage({
  	destination: function (req, file, callback) {
		console.log("storage_create ***********************************************************")
		console.log(req.method)
		console.log("destination req = ")
		console.log(req.body)
		callback(null, `views/uploads/${ file.fieldname }`);
  	}, 
  	filename: function (req, file, callback) {
		console.log("storage_create ***********************************************************")
		console.log(req.method)
		console.log("filename req = ")
		console.log(req.body)
		callback(null, req.body.id + '-' + req.body.name + '.' + ([ "png", "jpg", "gif", "svg" ].includes(file.originalname.split('.')[1]) ? "png": "mp3"));
  	}
});


var storage_update = multer.diskStorage({
  	destination: function (req, file, callback) {
		setTimeout(() => {
			callback(null, `views/uploads/${ file.fieldname }`);
		}, 500);
  	}, 
  	filename: function (req, file, callback) {
		setTimeout(() => {
			callback(null, req.body.id + '-' + req.body.name + '.' + ([ "png", "jpg", "gif", "svg" ].includes(file.originalname.split('.')[1]) ? "png": "mp3"));
		}, 500);
  	}
});

var uploads_create = multer({ storage: storage_create }).any();
var uploads_update = multer({ storage: storage_update }).any();

var db_zoo;

//Connect to mongodb to detect if there is an error, raise an exception
MongoClient.connect("mongodb://localhost:27017/", { native_parser: true }, (err, databases) => {
	if (err) throw err;
	db_zoo = databases.db("zoo");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
	res.render(path.join(__dirname + '/views/index'));
});

router.get('/admin', (req, res) => {
	res.render(path.join(__dirname + '/views/admin'));
});

router.get('/games', (req, res) => {
	res.render(path.join(__dirname + '/views/games'));
});

router.get('/tables', (req, res) => {
	res.render(path.join(__dirname + '/views/tables'));
});

/* METHODS */

router.post('/admin', (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		if (username && password) {
			db_zoo.collection("admins").find({ "name": username, "password": password }).toArray((err, admins) => {
				if (err) throw err;
				res.json({ result: admins.length });
				res.end();
			});
		} else {
			res.json({ result: "0" });
			res.end();
		}
	}
	catch(e) {
        res.json({ error: e });
        res.end();
	}
});

router.post('/admin/create/', uploads_create, (req, res) => {
	try {
		
		var element = { "id": req.body.id, "name": req.body.name };
		var table = req.body.table;

		if(table == "profiles") { element["points"] = 0 }

		db_zoo.collection(table).insertOne(element, err => {
			if (err) throw err;
			res.json({ result: "File is uploaded" });
			res.end();
		});
	}
	catch(e) {
		res.json({ error: e });
		res.end();
	}
});

router.post('/admin/update/', uploads_update, (req, res) => {
	try {

		var query = { "id": req.body.id }
		var element = { $set: { "id": req.body.id, "name": req.body.name } };

		db_zoo.collection(req.body.table).updateOne(query, element, err => {
			if (err) throw err;
			res.json({ result: "Element updated and files been changes" });
			res.end();
		});
	}
	catch(e) {
		res.json({ error: e });
		res.end();
	}
});

router.get('/profiles', (req, res) => {
	try {
		db_zoo.collection("profiles").find({}).toArray((err, profiles) => {
			if (err) throw err;
			res.json({ result: profiles });
			res.end();
		});
    }
    catch(e) {
        res.json({ error: e });
        res.end();
    }
});

router.post('/profiles', uploads_create, (req, res) => {
	try {
		db_zoo.collection("profiles").insertOne({ "id": req.body.profile_id, "name": req.body.profile_name, "points": 0 }, function(err) {
			if (err) throw err;
			res.json({ result: "Profile setup done successfully" });
			res.end();
		});
	}
	catch(e) {
		res.json({ error: e });
		res.end();
	}
});

router.post('/profiles_points/:id/:points', (req, res) => {
	try {
		var query = { "id": req.params.id }

		var element = { $set: { "points": req.params.points, "games": req.body.games } };

		db_zoo.collection("profiles").updateOne(query, element, err => {
			if (err) throw err;
			res.json({ result: "points been updated for " + query.id + " and now has " + req.params.points + " points" });
			res.end();
		});
	}
	catch(e) {
		res.json({ error: e });
		res.end();
	}
});

router.put('/profiles/:gamePoints', (req, res) => {
	try {
		// db_zoo.collection("profiles").insertOne({ "id": req.body.id, "name": req.body.name }, function(err) {
		// 	if (err) throw err;
		// 	res.json({ result: "Profile setup done successfully" });
		// 	res.end();
		// });
	}
	catch(e) {
		res.json({ error: e });
		res.end();
	}
});

router.get('/table/:tableName', (req, res) => {
	db_zoo.collection(req.params.tableName).find({}).toArray((err, animals) => {
		if (err) throw err;
		res.json({ result: animals });
		res.end();
	});
});

router.delete('/table/:tableName/:animalID', (req, res) => {

	// משיכת הפרמטר שמזהה את המספר של החיה שאותה מוחקים
	var animal_id = req.params.animalID;
	var table_name = req.params.tableName;

	// מחיקת החיה לפני המספר מזהה
	db_zoo.collection(table_name).deleteOne({ "id": animal_id }, function(err, results) {
		// בעת שגיאה בנתון או בהתחברות למסד הנתונים
		if (err) throw err;

        files = glob.sync(`server/views/uploads/*/${ animal_id }-*`);

        files.map(function(file) {
            fs.unlinkSync(file);
        }); 
        
		res.json({ "result": "DELETED " + animal_id, "asd": results });
		res.end();
    });
});

app.use(express.static(__dirname + '/views'));

app.use('/', router);
app.listen(process.env.port || 8888);

console.log('Running at Port 8888');