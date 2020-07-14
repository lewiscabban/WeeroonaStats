
//Setting up the server and it's dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/weeroonaStats", {useNewUrlParser: true});




//Constructing the database
const playerGameStatSchema = new mongoose.Schema ({
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
  games: Number,
  goals: Number,
  gamesPlayed: [playerGameStatSchema],
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

const Game = mongoose.model("Game", gameSchema);

const Player = mongoose.model("Player", playerSchema);

const Highlight = mongoose.model("Highlight", highlightSchema);

const PlayerGameStat = mongoose.model("PlayerGamesStat", playerGameStatSchema);

const playergame1 = new PlayerGameStat ({
  goals: 4,
  behinds: 3
});
const playergame2 = new PlayerGameStat ({
  goals: 2,
  behinds: 1
});

const player1 = new Player ({
  firstName: "Lewis",
  lastName: "Cabban",
  goals: 6,
  games: 2, 
  highlights: [{
    type: "Debute",
    description: "debute agasinst South Whyalla, Win",
  },{
    type: "50 games",
    description: "50th game against West Whyalla, Win",
  }],
  gamesPlayed: [playergame1,playergame2]
});
const player2 = new Player ({
  firstName: "Tom",
  lastName: "Fischer",
  goals: 4,
  games: 1,
  highlights: [{
    type: "50 games",
    description: "50th game against West Whyalla, Win",
  }],
  gamesPlayed: [{
    goals: 4,
    behinds: 3
  }]
});

const defaultPlayers = [player1, player2];

const game1 = new Game ({
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
})

//handling requests made to the server
app.get("/players", function(req, res) {

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
      res.redirect("/players");
    } else {
      found.forEach(function(foundPlayer){
        Highlight.find({_id: foundPlayer.highlights}, function(err, foundHighlights) {
          foundPlayer.highlights.forEach(function(foundPlayerHighlight) {
            console.log(foundPlayerHighlight);
          });
        });
      });
      
    res.render("players", {allPlayers: found});
    }
    console.log(found);
  })
});

//handling requests made to the server
app.get("/highlights", function(req, res) {

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
      res.redirect("/players");
    } else {
      found.forEach(function(foundPlayer){
        Highlight.find({_id: foundPlayer.highlights}, function(err, foundHighlights) {
          foundPlayer.highlights.forEach(function(foundPlayerHighlight) {
            console.log(foundPlayerHighlight);
          });
        });
      });
      
    res.render("highlights", {allPlayers: found});
    }
    console.log(found);
  })
});

app.get("/players/:id", function(req,res){
  const id = _.capitalize(req.params.id);
  
  Player.findOne({_id: id}, function(err, foundPlayer){
    if(!err){
      if(!foundPlayer){
        //player not found
        console.log("requested player not in database");
      } else {
        //show the existing players stats
        res.render("player", {player: foundPlayer});
      }
    }
  })
});

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
