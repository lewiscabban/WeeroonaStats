
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


const Player = mongoose.model("Player", playerSchema);
const PlayerGameStats = mongoose.model("PlayerGameStats", playerGameStatSchema);
const Game = mongoose.model("Game", gameSchema);
const Highlight = mongoose.model("Highlight", highlightSchema);

const highlight1 = new Highlight ({
  goals: 1,
  behinds: 2
});
const highlight2 = new Highlight ({
  goals: 1,
  behinds: 2
});

const playerGameStats1 = new PlayerGameStats ({
  type: "Debute",
  description: "debute agasinst South Whyalla, Win"
});
const playerGameStats2 = new PlayerGameStats ({
  type: "50 games",
  description: "50th game against West Whyalla, Win"
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
  gamesPlayed: [playerGameStats1,playerGameStats2],
  address: "12 Barter Street",
  suburb: "Whyalla Playford",
  state: "SA",
  postcode: "5600",
  homeNumber: "NA",
  moblieNumber: "0428451950",
  fax: "NA"
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
  }],
  address: "3 Raws Street",
  suburb: "Whyalla Playford",
  state: "SA",
  postcode: "5600",
  homeNumber: "NA",
  moblieNumber: "NA",
  fax: "NA"
});

const game1 = new Game ({
  result: "Win",
  grade: "A",
  date: new Date("2020-07-01"),
  opponent: "West Whyalla",
  round: 1,
  forGoals: 15,
  forBehinds: 12,
  againstGoals: 8,
  againstBehinds: 19,
  coach: "Craig Inglas",
  assistant: "Jason Reece",
  Captian: "Owen Yendell",
  vice: "Dylan slkjfjkld",
  players: [player1, player2]
});
const game2 = new Game ({
  result: "Win",
  grade: "A",
  date: new Date("2020-07-08"),
  opponent: "North Whyalla",
  round: 2,
  forGoals: 34,
  forBehinds: 23,
  againstGoals: 1,
  againstBehinds: 3,
  coach: "Craig Inglas",
  assistant: "Jason Reece",
  Captian: "Owen Yendell",
  vice: "Dylan slkjfjkld",
  players: [player1, player2]
});

const defaultPlayers = [player1, player2];

//handling requests made to the server
app.get("/", function(req, res) {
  res.render("index");
})

app.get("/index", function(req, res) {
  res.render("index");
})

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
app.get("/games", function(req, res) {

  Game.find({}, function(err, found){

    if(found.length == 0){
      Game.insertMany([game1, game2], function(err){
        if (err){
          console.log(err);
        }
        else {
          console.log("successfully saved items into the DB");
        }
      });
      res.redirect("/games");
    } else {
      console.log(found);
      res.render("games", {allGames: found});
    }
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
