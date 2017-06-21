var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var https = require('https');
var imgImport = require('../img.model');

var apiKey = process.env.API_KEY;
var cxKey = process.env.CX_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/imagesearch/:searchTerm*', function(req, res, next) {
  var searchTerm = req.params.searchTerm;
  var offsetVal = req.query.offset;
  var APIUrlEndPnt = "https://www.googleapis.com/customsearch/v1?key="+apiKey+"&cx="+cxKey+"&q="+searchTerm+"&num=10&filter=1&searchType=image&start="+offsetVal+"&alt=json&fields=items(link,snippet,image/thumbnailLink,image/contextLink)"
  var x=[];
  var img_data ={
    searchentry: searchTerm,
    searchdate: new Date()
  };
  https.get(APIUrlEndPnt,function(res1){
        res1.on('error', function(e){
          console.log(e);  
        });
        res1.on('data', function(d){
          x.push(d);   
        });
        res1.on('end', function(){
          x=x.join("");
          res.end(x); /*can't seem to JSON.parse this! wth*/
        });
  });

  var imgx = new imgImport(img_data);
  imgx.save(function(err,data){
    if(err){
      res.json(error);
    } else {
      console.log("logged");
    }
  });
  
});

router.get('/api/recent', function(req,res,next){
  imgImport.find({}).select('-_id -__v -searchdate').limit(5).sort({'searchdate':-1}).exec(function(err, data){ 
    if(err){
      res.json(error);
    } else {
      res.json({data});  
    }
  });
});

module.exports = router;

/* https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10 
  ^ like in this case the search term being 'lolcats funny' and req.query of 'offset' having value of 10 
 */