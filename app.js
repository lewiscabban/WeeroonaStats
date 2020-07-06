
//Setting up the server and it's dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/weeroonaStats", {useNewUrlParser: true});




//Constructing the database
const playerGameStatsSchema = new mongoose.Schema ({
  playerID: String,
  gameID: String,
  goals: Number,
  behinds: Number
});

const highlightSchema = new mongoose.Schema ({
  playerID: String,
  gameID: String,
  type: String,
  description: String
});

const playerSchema = new mongoose.Schema ({
  firstName: String,
  lastName: String,
  gamesPlayed: [playerGameStatsSchema],
  address: String,
  suburb: String,
  state: String,
  postcode: String,
  homeNumber: String,
  moblieNumber: String,
  fax: String,
  highlights: [highlightSchema]
});

const gameSchema = new mongoose.Schema ({
  result: String,
  grade: String,
  date: Date,
  opponent: String,
  year: Number,
  round: Number,
  forGoals: Number,
  forBehinds: Number,
  againstGoals: Number,
  againstBehinds: Number,
  coach: String,
  assistant: String,
  Captian: String,
  vice: String,
  players: [playerSchema]
});

const Player = mongoose.model("Player", playerSchema);

const Highlight = mongoose.model("Highlight", highlightSchema);

const highlight1 = new Player ({
  type: "Debute",
  description: "debute agasinst South Whyalla, Win",
});
const highlight2 = new Player ({
  type: "50 games",
  description: "50th game against West Whyalla, Win",
});

const player1 = new Player ({
  firstName: "Lewis",
  lastName: "Cabban",
  highlights: [{
    type: "Debute",
    description: "debute agasinst South Whyalla, Win",
  },{
    type: "50 games",
    description: "50th game against West Whyalla, Win",
  }]
});
const player2 = new Player ({
  firstName: "Tom",
  lastName: "Fischer",
  highlights: [{
    type: "50 games",
    description: "50th game against West Whyalla, Win",
  }]
});

const defaultPlayers = [player1, player2];

//handling requests made to the server
app.get("/", function(req, res) {

  Player.find({}, function(err, found){

    if(found.length == 0){
      Player.insertMany(defaultPlayers, function(err){
        if (err){
          console.log(err);
        }
        else {
          console.log("successfully saved items into the DB");
        }
      });
      res.redirect("/");
    } else {
      found.forEach(function(foundPlayer){
        Highlight.find({_id: foundPlayer.highlights}, function(err, foundHighlights) {
          foundPlayer.highlights.forEach(function(foundPlayerHighlight) {
            console.log(foundPlayerHighlight);
          });
        });
      });
      
    res.render("players", {listTitle: "Today", allPlayers: found});
    }
    console.log(found);
  })
});

// app.get("/:customListName", function(req,res){
//   const customListName = _.capitalize(req.params.customListName);

//   List.findOne({name: customListName}, function(err, foundList){
//     if(!err){
//       if(!foundList){
//         //create a new list
//         const list = new List({
//           name: customListName,
//           items: defaultItems
//         });
//         list.save();
//         res.redirect("/" + customListName);
//       } else {
//         //show the existing list
//         res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//       }
//     }
//   })

  
// })

// app.post("/", function(req, res){

//   const itemName = req.body.newItem;
//   const listName = req.body.list;

//   const item = new Item({
//     name: itemName
//   });

//   if (listName === "Today"){
//     item.save();
//     res.redirect("/");
//   } else {
//     List.findOne({name: listName}, function(err, foundList){
//       foundList.items.push(item);
//       foundList.save();
//       res.redirect("/" + listName);
//     })
//   }

// });

// app.post("/delete", function(req,res){
//   const checkedItemId = req.body.deleteBox;
//   const listName = req.body.listName;

//   if (listName === "Today"){
//     Item.findByIdAndRemove(checkedItemId, function(err){
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("the item was successfully deleted");
//           res.redirect("/");
//         }
//       });
//   } else {
//     List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
//       if (!err){
//         res.redirect("/" + listName);
//       }
//     });
//   }
  
// });

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
