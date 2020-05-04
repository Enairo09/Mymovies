var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true
  }
  mongoose.connect('mongodb+srv://enairo:enairo@cluster0-pte8o.mongodb.net/mymoviz',
    options,
    function(error) {
        if (error) { 
          console.log('je suis le probleme !!!',error);
       } else {
         console.log("**** PERFECT CONNECT ****");
       }
       }
);
  
  module.exports = mongoose ;