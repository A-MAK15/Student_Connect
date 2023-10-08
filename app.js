// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const getUserMedia = require("getusermedia");
const {Navigator} = require("node-navigator");
const navigator = new Navigator();
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM("");
const window = dom.window;
const $ = require('jquery')(window)
const fs = require('fs');
const path = require('path');
var multer = require('multer');
const saltRounds = 10;

// Before changing text
// const beforejQuery = window.document.querySelector('h1').textContent
// console.log('before: ', beforejQuery)

// after modifying the text
// $("h1").text('How to use jQuery with NodeJS');
// const afterjQuery = window.document.querySelector('h1').textContent
// console.log('after: ', afterjQuery)


// $(".connect").click(function(){
//   console.log("Hello World");
//   });

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(bodyParser.json())

var onlineUsers = [];
var friendshipCategory = ["Castila","Bonus","Gaffer"];
var relationshipsCategory = ["John Doe", "Angela Yu", "Khafu"];
var businessMarketCategory = ["Rick", "Mort", "Curf"];
var invitationCategory = ["Mongo", "Sassy", "Ozil"];
var randomCategory = ["Twilo", "Cash", "Spino", "Messi"];


let countfriendship = 0;
let countrelationship = 0;
let countbusinessMarket = 0;
let countinvitation = 0;
let countrandom = 0;

mongoose.connect("mongodb://localhost:27017/StudentConnectDB");

const userSchema = new mongoose.Schema({
  fName : String,
  lName : String,
  studentEmail : String,
  userPassword : String,
  userName : String
});

const reportSchema = new mongoose.Schema({
  reportUserName : String,
  reportedUser : String,
  reasonReport : String
});

const friendshipSchema = new mongoose.Schema({
  userFriend : userSchema
});

const relationshipSchema = new mongoose.Schema({
  userRelationship : userSchema
});

const businessMarketSchema = new mongoose.Schema({
  userbusinessMarket : userSchema
});

const invitationSchema = new mongoose.Schema({
  userInvitation : userSchema
});

const randomChatSchema = new mongoose.Schema({
  userRandom : userSchema
});

const reviewsSchema = new mongoose.Schema({
  userImage : {
    data : Buffer,
    contentType : String
  },
  username : String,
  userReview : String
});

const analyticschema = new mongoose.Schema({
  friendship : Number,
  relationship : Number,
  business : Number,
  invitation : Number,
  random : Number
});

const connectionSchema = new mongoose.Schema({
  onlineUser : String,
  randomPairedUser : String,
  connectionDate : String
});

const bannedSchema = new mongoose.Schema({
  bannedUser : String
});


//Models

const user = mongoose.model("User", userSchema);
const friendshipConnect = mongoose.model("Friendship", friendshipSchema);
const relationshipConnect = mongoose.model("Relationship", relationshipSchema);
const report = mongoose.model("Report", reportSchema);
const businessMarketConnect = mongoose.model("business", businessMarketSchema);
const invitationConnect = mongoose.model("invitation", invitationSchema);
const randomChatConnect = mongoose.model("Random", randomChatSchema);
const analytics = mongoose.model("Analytic", analyticschema);
const connections = mongoose.model("Connection", connectionSchema);
const banned = mongoose.model("ban", bannedSchema);
// const reviews = mongoose.model("Reviews", reviewsSchema);

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage });

app.get("/create-account", function(req, res){
  res.render("createAccount");
  });

app.post("/create-account", function(req, res){
  const userFName = req.body.FName;
  const userLName = req.body.LName;
  const userEmail = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.cpassword;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    const newUser = new user ({
      fName : userFName,
      lName : userLName,
      studentEmail : userEmail,
      userPassword : hash,
      userName : userEmail,
    });
    user.findOne({fName : userFName, lName : userLName, studentEmail : userEmail}, function(err, foundUser){ //check if the account is available before creating account
      if((foundUser) || (userFName.length === 0) || (userLName.length === 0) || (userEmail.length === 0) || (password.length === 0) || (confirmPassword.length === 0)){
        res.render("createAccountExistJumbo");
      } else{
        if(password === confirmPassword){
          res.render("createAccountSuccessJumbotron");
        }else{
          res.render("createAccountPasswordJumbotron");
        }
        if((password === confirmPassword) && (userFName.length != 0) && (userLName.length != 0) && (userEmail.length != 0) && (password.length != 0) && (confirmPassword.length != 0)){
          newUser.save(function(err){
            if(err){
              console.log(err);//render error handling error
            }else{
              //pass
            }
          });
        }
      }
    });

});

});

app.post("/login", function(req, res){
  const username = req.body.userName;
  const password = req.body.password;

  user.findOne({userName : username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else {
      if((username === "adminWatcher@gmail.com") && (password === "ForzaJuv")){
        res.render("theWatcher");
      }else{
        //pass
      }
      if(foundUser){
        bcrypt.compare(password, foundUser.userPassword, function(err, result){

          banned.findOne({bannedUser : username}, function(err, banned){
            if(err){
              console.log(err);
            }else{
              if(banned){
                res.render("loginBannedJumbo");
              }else{
                //pass
                if((result === true) && (foundUser.userName === username) && (password.length != 0) && (username.length != 0)){
                  res.render("landing");
                  if(username != "adminWatcher@gmail.com"){
                    onlineUsers.push(foundUser);
                  }
                }else {
                  res.render("loginErrorJumbotron");
                }
              }
            }
          });

        });

      }else{
        if((password.length === 0) || (username.length != 0)){
          res.render("loginErrorJumbotron");
        }
      }
    }
  });

});

app.post("/friendship", function(request, response){

  if(request.body.friendshipConnectbtn === "friendship"){

    const friendshipAnalytic = new analytics({
      friendship : ++countfriendship,
      relationship : countrelationship,
      business : countbusinessMarket,
      invitation : countinvitation,
      random : countrandom
    });

    analytics.updateOne({friendship : friendshipAnalytic.friendship}, {friendship : friendshipAnalytic.friendship}, function(err, foundValue){
      if(err){
        console.log(err);
      }else{
        if(foundValue){
          console.log("Successfully found user");
          // friendshipAnalytic.save();
          analytics.findOne({_id : "63690b3b16ed20b8b1505073"}, function(err, foundUser){
            if(err){
              console.log(err);
            }else{
              console.log(foundUser);
              console.log(foundUser._id);
              console.log(foundUser.friendship);
              console.log(friendshipAnalytic.friendship);
              if(foundUser){
                analytics.updateOne({friendship : foundUser.friendship}, {friendship : friendshipAnalytic.friendship}, function(err, found){
                  if(err){
                    console.log(err);
                  }else{
                    if(found){
                      console.log("Successfully updated field");
                    }
                  }
                });

              }else{
                //
              }

            }
          });
        }
      }
    });


    const friendshipUser = new friendshipConnect({
      userFriend : onlineUsers[onlineUsers.length-1]
    });

    console.log("userFriend from onlineUser " + friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName); //prints current online user

    friendshipConnect.findOne({userFriend : friendshipUser.userFriend}, function(err, foundUser){ //Checks if the user is in the friendship database
      if(foundUser){
        console.log(friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName + " is already in the database");
      } else {
        if(err){
          console.log(err);
        } else {
          friendshipUser.save(function(err){ //save users to the friendship database
             if(err){
               console.log(err);
             } else {console.log("Successfully saved to the friendship collection");}
           });
        }
      }

  });


    if(!friendshipCategory.includes(friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName)){ // Check if user is in the friendshipCategory array
          friendshipCategory.push(friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName); //push the userFriend in the array

      } else {
          console.log("User already in this pool");
        }
        console.log(friendshipCategory);

         var randomFriendshipConnection = friendshipCategory[Math.floor(Math.random() * friendshipCategory.length)];
        if(randomFriendshipConnection != friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName){// condition to make the user to not connect with themselves
          export {randomFriendshipConnection};


          const connectionUser = new connections({
            onlineUser : friendshipUser.userFriend.fName + " " + friendshipUser.userFriend.lName,
            randomPairedUser : randomFriendshipConnection,
            connectionDate : new Date()
          });

          connectionUser.save();
          console.log(connectionUser.onlineUser + " connected with " + connectionUser.randomPairedUser + " at " + connectionUser.connectionDate);
        }
        console.log("Randomly generated user " + randomFriendshipConnection);

    }else {
      if(request.body.friendshipDisConnectbtn === "Disfriendship"){
        friendshipConnect.deleteOne({}, function(err, foundUser){
          if(err){
            console.log(err);
          } else{
            console.log(friendshipCategory[friendshipCategory.length-1] + " was Successfully deleted from the friendship database");
            let indexUser = friendshipCategory.indexOf(friendshipCategory[friendshipCategory.length-1]);
            if(indexUser > -1){ //check if indexUser number exists
              friendshipCategory.splice(indexUser, 1); //removes user from the friendship array
            }
            console.log(friendshipCategory[friendshipCategory.length-1]);
            console.log(friendshipCategory);
          }

        });
        response.redirect("/friendship");
      }

      if(request.body.reportbtn){
        response.render("report");

        app.post("/report", function(req, res){

            var username = req.body.reportUsername;
            var namePerpetrator = req.body.reportPerpetrator;
            var reportUser = req.body.reportReason;

            const newReport = new report ({
              reportUserName : username,
              reportedUser : namePerpetrator,
              reasonReport : reportUser
            });

            report.findOne({reasonReport : newReport.reasonReport}, function(err, foundReport){
              if(err){
                console.log(err);
              }else{
                if((foundReport) || (username.length === 0) || (namePerpetrator.length === 0) || (reportUser.length === 0)){
                  res.render("reportExistJumbo");
                }else{
                  if((username.length != 0) && (namePerpetrator.length != 0) && (reportUser.length != 0)){
                    newReport.save(function(err){ //find a way to check if something exists in the database, will check the string of reason report
                      if(err){
                        console.log(err);
                      }else{
                        res.render("reportSuccessJumbotron");
                      }
                    });
                  }

                }
              }

            });

        });
      }

    }

      });

app.post("/relationships", function(req, res){

  if(req.body.relationshipConnectbtn === "relationship"){

    const relationshipAnalytic = new analytics({
      friendship : countfriendship,
      relationship : ++countrelationship,
      business : countbusinessMarket,
      invitation : countinvitation,
      random : countrandom
    });

    analytics.updateOne({_id : "63690b3b16ed20b8b1505073"}, {relationship : relationshipAnalytic.relationship}, function(err, foundValue){
      if(err){
        console.log(err);
      }else{
        if(foundValue){
          console.log("Successfully found user");
        }
      }
    });

    // analytics.deleteOne({_id : "63694b63510e18bb66ca75f5"}, function(err){
    //   if(err){
    //     console.log(err);
    //   }else{
    //     console.log("Successfully deleted document");
    //   }
    // });

    const relationshipUser = new relationshipConnect({
      userRelationship : onlineUsers[onlineUsers.length-1]
    });

    console.log("userRelationship from onlineUser " + relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName); //prints current online user

    relationshipConnect.findOne({userRelationship : relationshipUser.userRelationship}, function(err, foundUser){ //Checks if the user is in the relationship database
      if(foundUser){
        console.log(relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName + " is already in the database");
      } else {
        if(err){
          console.log(err);
        } else {
          relationshipUser.save(function(err){ //save users to the relationship database
             if(err){
               console.log(err);
             } else {console.log("Successfully saved to the relationship collection");}
           });
        }
      }

  });

  if(!relationshipsCategory.includes(relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName)){ // Check if user is in the relationshipCategory array
        relationshipsCategory.push(relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName); //push the userRelationship in the array

    } else {
        console.log("User already in this pool");
      }
      console.log(relationshipsCategory);

      var randomRelationshipConnection = relationshipsCategory[Math.floor(Math.random() * relationshipsCategory.length)]; //generates random user
      if(randomRelationshipConnection != relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName){// condition to make the user to not connect with themselves
        console.log("Tap into the users web camera and the connected users camera");

        const connectionUser = new connections({
          onlineUser : relationshipUser.userRelationship.fName + " " + relationshipUser.userRelationship.lName,
          randomPairedUser : randomRelationshipConnection,
          connectionDate : new Date()
        });

        connectionUser.save();
        console.log(connectionUser.onlineUser + " connected with " + connectionUser.randomPairedUser + " at " + connectionUser.connectionDate);
      }
      console.log("Randomly generated user " + randomRelationshipConnection);

  }else {

    if(req.body.relationshipDisConnectbtn === "Disrelationship"){
      relationshipConnect.deleteOne({}, function(err, foundUser){
        if(err){
          console.log(err);
        } else{
          console.log(relationshipsCategory[relationshipsCategory.length-1] + " was Successfully deleted from the friendship database");
          let indexUser = relationshipsCategory.indexOf(relationshipsCategory[relationshipsCategory.length-1]);
          if(indexUser > -1){ //check if indexUser number exists
            relationshipsCategory.splice(indexUser, 1); //removes user from the relationship array
          }
          console.log(relationshipsCategory[relationshipsCategory.length-1]);
          console.log(relationshipsCategory);
        }

      });
      res.redirect("/relationships");
    }
  }

  if(req.body.reportbtn){
    res.render("report");

    app.post("/report", function(req, res){

        var username = req.body.reportUsername;
        var namePerpetrator = req.body.reportPerpetrator;
        var reportUser = req.body.reportReason;

        const newReport = new report ({
          reportUserName : username,
          reportedUser : namePerpetrator,
          reasonReport : reportUser
        });

        report.findOne({reasonReport : newReport.reasonReport}, function(err, foundReport){
          if(err){
            console.log(err);
          }else{
            if((foundReport) || (username.length === 0) || (namePerpetrator.length === 0) || (reportUser.length === 0)){
              res.render("reportExistJumbo");
            }else{
              if((username.length != 0) && (namePerpetrator.length != 0) && (reportUser.length != 0)){
                newReport.save(function(err){ //find a way to check if something exists in the database, will check the string of reason report
                  if(err){
                    console.log(err);
                  }else{
                    res.render("reportSuccessJumbotron");
                  }
                });
              }

            }
          }

        });

    });
  }

});

app.post("/businessMarket", function(req, res){

  if(req.body.businessMarketConnectbtn === "businessMarket"){

    const businessMarketAnalytic = new analytics({
      friendship : countfriendship,
      relationship : countrelationship,
      business : ++countbusinessMarket,
      invitation : countinvitation,
      random : countrandom
    });

    analytics.updateOne({_id : "63690b3b16ed20b8b1505073"}, {business : businessMarketAnalytic.business}, function(err, foundValue){
      if(err){
        console.log(err);
      }else{
        if(foundValue){
          console.log("Successfully found user");
        }
      }
    });

    const businessMarketUser = new businessMarketConnect({
      userbusinessMarket : onlineUsers[onlineUsers.length-1]
    });

    console.log("userbusinessMarket from onlineUser " + businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName); //prints current online user

    businessMarketConnect.findOne({userbusinessMarket : businessMarketUser.userbusinessMarket}, function(err, foundUser){ //Checks if the user is in the businessMarket database
      if(foundUser){
        console.log(businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName + " is already in the database");
      } else {
        if(err){
          console.log(err);
        } else {
          businessMarketUser.save(function(err){ //save users to the businessMarket database
             if(err){
               console.log(err);
             } else {console.log("Successfully saved to the businessMarket collection");}
           });
        }
      }

  });

  if(!businessMarketCategory.includes(businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName)){ // Check if user is in the businessMarket array
        businessMarketCategory.push(businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName); //push the userbusinessMarket in the array

    } else {
        console.log("User already in this pool");
      }
      console.log(businessMarketCategory);

      var randomBusinessConnection = businessMarketCategory[Math.floor(Math.random() * businessMarketCategory.length)]; //generates random user
      if(randomBusinessConnection != businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName){// condition to make the user to not connect with themselves
        console.log("Tap into the users web camera and the connected users camera");

        const connectionUser = new connections({
          onlineUser : businessMarketUser.userbusinessMarket.fName + " " + businessMarketUser.userbusinessMarket.lName,
          randomPairedUser : randomBusinessConnection,
          connectionDate : new Date()
        });

        connectionUser.save();
        console.log(connectionUser.onlineUser + " connected with " + connectionUser.randomPairedUser + " at " + connectionUser.connectionDate);
      }
      console.log("Randomly generated user " + randomBusinessConnection);

  }else {

    if(req.body.businessMarketDisConnectbtn === "DisbusinessMarket"){
      businessMarketConnect.deleteOne({}, function(err, foundUser){
        if(err){
          console.log(err);
        } else{
          console.log(businessMarketCategory[businessMarketCategory.length-1] + " was Successfully deleted from the friendship database");
          let indexUser = businessMarketCategory.indexOf(businessMarketCategory[businessMarketCategory.length-1]);
          if(indexUser > -1){ //check if indexUser number exists
            relationshipsCategory.splice(indexUser, 1); //removes user from the businesMarket array
          }
          console.log(businessMarketCategory[businessMarketCategory.length-1]);
          console.log(businessMarketCategory);
        }

      });
      res.redirect("/businesMarket");
    }
  }

  if(req.body.reportbtn){
    res.render("report");

    app.post("/report", function(req, res){

        var username = req.body.reportUsername;
        var namePerpetrator = req.body.reportPerpetrator;
        var reportUser = req.body.reportReason;

        const newReport = new report ({
          reportUserName : username,
          reportedUser : namePerpetrator,
          reasonReport : reportUser
        });

        report.findOne({reasonReport : newReport.reasonReport}, function(err, foundReport){
          if(err){
            console.log(err);
          }else{
            if((foundReport) || (username.length === 0) || (namePerpetrator.length === 0) || (reportUser.length === 0)){
              res.render("reportExistJumbo");
            }else{
              if((username.length != 0) && (namePerpetrator.length != 0) && (reportUser.length != 0)){
                newReport.save(function(err){ //find a way to check if something exists in the database, will check the string of reason report
                  if(err){
                    console.log(err);
                  }else{
                    res.render("reportSuccessJumbotron");
                  }
                });
              }

            }
          }

        });

    });
  }

});

app.post("/invitation", function(req, res){

  const invitationAnalytic = new analytics({
    friendship : countfriendship,
    relationship : countrelationship,
    business : countbusinessMarket,
    invitation : ++countinvitation,
    random : countrandom
  });

  analytics.updateOne({_id : "63690b3b16ed20b8b1505073"}, {invitation : invitationAnalytic.invitation}, function(err, foundValue){
    if(err){
      console.log(err);
    }else{
      if(foundValue){
        console.log("Successfully found user");
      }
    }
  });

  if(req.body.invitationConnectbtn === "Coninvitation"){

    const invitationUser = new invitationConnect({
      userInvitation : onlineUsers[onlineUsers.length-1]
    });

    console.log("userInvitation from onlineUser " + invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName); //prints current online user

    invitationConnect.findOne({userInvitation : invitationUser.userInvitation}, function(err, foundUser){ //Checks if the user is in the invitation database
      if(foundUser){
        console.log(invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName + " is already in the database");
      } else {
        if(err){
          console.log(err);
        } else {
          invitationUser.save(function(err){ //save users to the invitation database
             if(err){
               console.log(err);
             } else {console.log("Successfully saved to the invitation collection");}
           });
        }
      }

  });

  if(!invitationCategory.includes(invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName)){ // Check if user is in the invitation array
        invitationCategory.push(invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName); //push the userInvitation in the array

    } else {
        console.log("User already in this pool");
      }
      console.log(invitationCategory);

      var randomInvitationConnection = invitationCategory[Math.floor(Math.random() * invitationCategory.length)]; //generates random user
      if(randomInvitationConnection != invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName){// condition to make the user to not connect with themselves
        console.log("Tap into the users web camera and the connected users camera");

        const connectionUser = new connections({
          onlineUser : invitationUser.userInvitation.fName + " " + invitationUser.userInvitation.lName,
          randomPairedUser : randomInvitationConnection,
          connectionDate : new Date()
        });

        connectionUser.save();
        console.log(connectionUser.onlineUser + " connected with " + connectionUser.randomPairedUser + " at " + connectionUser.connectionDate);
      }
      console.log("Randomly generated user " + randomInvitationConnection);

  }else {

    if(req.body.invitationDisConnectbtn === "Disinvitation"){
      invitationConnect.deleteOne({}, function(err, foundUser){
        if(err){
          console.log(err);
        } else{
          console.log(invitationCategory[invitationCategory.length-1] + " was Successfully deleted from the invitation database");
          let indexUser = invitationCategory.indexOf(invitationCategory[invitationCategory.length-1]);
          if(indexUser > -1){ //check if indexUser number exists
            invitationCategory.splice(indexUser, 1); //removes user from the invitation array
          }
          console.log(invitationCategory[invitationCategory.length-1]);
          console.log(invitationCategory);
        }

      });
        res.redirect("/invitation");
    }
  }

  if(req.body.reportbtn){
    res.render("report");

    app.post("/report", function(req, res){

        var username = req.body.reportUsername;
        var namePerpetrator = req.body.reportPerpetrator;
        var reportUser = req.body.reportReason;

        const newReport = new report ({
          reportUserName : username,
          reportedUser : namePerpetrator,
          reasonReport : reportUser
        });

        report.findOne({reasonReport : newReport.reasonReport}, function(err, foundReport){
          if(err){
            console.log(err);
          }else{
            if((foundReport) || (username.length === 0) || (namePerpetrator.length === 0) || (reportUser.length === 0)){
              res.render("reportExistJumbo");
            }else{
              if((username.length != 0) && (namePerpetrator.length != 0) && (reportUser.length != 0)){
                newReport.save(function(err){ //find a way to check if something exists in the database, will check the string of reason report
                  if(err){
                    console.log(err);
                  }else{
                    res.render("reportSuccessJumbotron");
                  }
                });
              }

            }
          }

        });

    });
  }

});

app.post("/randomChat", function(req, res){

  const randomAnalytic = new analytics({
    friendship : countfriendship,
    relationship : countrelationship,
    business : countbusinessMarket,
    invitation : countinvitation,
    random : ++countrandom
  });

  analytics.updateOne({_id : "63690b3b16ed20b8b1505073"}, {random : randomAnalytic.random}, function(err, foundValue){
    if(err){
      console.log(err);
    }else{
      if(foundValue){
        console.log("Successfully found user");
      }
    }
  });

  if(req.body.randomChatConnectbtn === "ConrandomChat"){

    const randomUser = new randomChatConnect({
      userRandom : onlineUsers[onlineUsers.length-1]
    });

    console.log("userRandom from onlineUser " + randomUser.userRandom.fName + " " + randomUser.userRandom.lName); //prints current online user

    randomChatConnect.findOne({userRandom : randomUser.userRandom}, function(err, foundUser){ //Checks if the user is in the randomChat database
      if(foundUser){
        console.log(randomUser.userRandom.fName + " " + randomUser.userRandom.lName + " is already in the database");
      } else {
        if(err){
          console.log(err);
        } else {
          randomUser.save(function(err){ //save users to the random database
             if(err){
               console.log(err);
             } else {console.log("Successfully saved to the random collection");}
           });
        }
      }

  });

  if(!randomCategory.includes(randomUser.userRandom.fName + " " + randomUser.userRandom.lName)){ // Check if user is in the randomCategory array
        randomCategory.push(randomUser.userRandom.fName + " " + randomUser.userRandom.lName); //push the userInvitation in the array

    } else {
        console.log("User already in this pool");
      }
      console.log(randomCategory);

      var randomRandomConnection = randomCategory[Math.floor(Math.random() * randomCategory.length)]; //generates random user
      if(randomRandomConnection != randomUser.userRandom.fName + " " + randomUser.userRandom.lName){// condition to make the user to not connect with themselves
        console.log("Tap into the users web camera and the connected users camera");

        const connectionUser = new connections({
          onlineUser : randomUser.userRandom.fName + " " + randomUser.userRandom.lName,
          randomPairedUser : randomRandomConnection,
          connectionDate : new Date()
        });

        connectionUser.save();
        console.log(connectionUser.onlineUser + " connected with " + connectionUser.randomPairedUser + " at " + connectionUser.connectionDate);
      }
      console.log("Randomly generated user " + randomRandomConnection);

  }else {

    if(req.body.randomChatDisConnectbtn === "DisrandomChat"){
      randomChatConnect.deleteOne({}, function(err, foundUser){
        if(err){
          console.log(err);
        } else{
          console.log(randomCategory[randomCategory.length-1] + " was Successfully deleted from the invitation database");
          let indexUser = randomCategory.indexOf(randomCategory[randomCategory.length-1]);
          if(indexUser > -1){ //check if indexUser number exists
            randomCategory.splice(indexUser, 1); //removes user from the invitation array
          }
          console.log(randomCategory[randomCategory.length-1]);
          console.log(randomCategory);
        }

      });
      res.redirect("/randomChat");
    }
  }

  if(req.body.reportbtn){
    res.render("report");

    app.post("/report", function(req, res){

        var username = req.body.reportUsername;
        var namePerpetrator = req.body.reportPerpetrator;
        var reportUser = req.body.reportReason;

        const newReport = new report ({
          reportUserName : username,
          reportedUser : namePerpetrator,
          reasonReport : reportUser
        });

        report.findOne({reasonReport : newReport.reasonReport}, function(err, foundReport){
          if(err){
            console.log(err);
          }else{
            if((foundReport) || (username.length === 0) || (namePerpetrator.length === 0) || (reportUser.length === 0)){
              res.render("reportExistJumbo");
            }else{
              if((username.length != 0) && (namePerpetrator.length != 0) && (reportUser.length != 0)){
                newReport.save(function(err){ //find a way to check if something exists in the database, will check the string of reason report
                  if(err){
                    console.log(err);
                  }else{
                    res.render("reportSuccessJumbotron");
                  }
                });
              }

            }
          }

        });

    });
  }

});

app.post("/ban", function(req, res){

  let username = req.body.userToBan;

  if(req.body.banbtn === "submitBan"){
    user.findOne({userName : username}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if((foundUser) && (username.length != 0)){
          const sanction = new banned({
            bannedUser : foundUser.userName
          });
          banned.findOne({bannedUser : sanction.bannedUser}, function(err, foundbannedUser){
            if(err){
              console.log("User not found");
            }else{
              if(foundbannedUser){
                res.render("bannedAlreadyExistsJumbo");
              }else{
                sanction.save();
                res.render("banJumbotron");
              }
            }
          });
        }
        else{
          res.render("banJumbotronFail");
        }
      }
    });
  }

});

app.post("/banJumbotron", function(req, res){
  if(req){
    res.render("ban");
  }
});

app.post("/banJumbotronFail", function(req, res){
  if(req){
    res.render("ban");
  }
});

app.post("/createAccountExistJumbo", function(req, res){
  if(req){
    res.render("createAccount");
  }
});

app.post("/createAccountSuccessJumbotron", function(req, res){
  if(req){
    res.render("login");
  }
});

app.post("/createAccountPasswordJumbotron", function(req, res){
  if(req){
    res.render("createAccount");
  }
});

app.post("/loginErrorJumbotron", function(req, res){
  if(req){
    res.render("login");
  }
});

app.post("/reportSuccessJumbotron", function(req, res){
  if(req){
    res.render("report");
  }
});

app.post("/reportExistJumbo", function(req, res){
  if(req){
    res.render("report");
  }
});

app.post("/bannedAlreadyExistsJumbo", function(req, res){
  if(req){
    res.render("ban");
  }
});

app.post("/loginBannedJumbo", function(req, res){
  if(req){
    res.render("login");
  }
});

app.get("/banJumbotron", function(req, res){
  res.render("banJumbotron");
});

app.get("/banJumbotronFail", function(req, res){
  res.render("banJumbotronFail");
});

app.get("/createAccountExistJumbo", function(req, res){
  res.render("createAccountExistJumbo");
});

app.get("/createAccountSuccessJumbotron", function(req, res){
  res.render("createAccountSuccessJumbotron");
});

app.get("/createAccountPasswordJumbotron", function(req, res){
  res.render("createAccountPasswordJumbotron");
});

app.get("/loginErrorJumbotron", function(req, res){
  res.render("loginErrorJumbotron");
});

app.get("/reportSuccessJumbotron", function(req, res){
  res.render("reportSuccessJumbotron");
});

app.get("/reportExistJumbo", function(req, res){
  res.render("reportExistJumbo");
});

app.get("/bannedAlreadyExistsJumbo", function(req, res){
  res.render("bannedAlreadyExistsJumbo");
});

app.get("/loginBannedJumbo", function(req, res){
  res.render("loginBannedJumbo");
});

app.get("/landing", function(req, res){
  res.render("landing")
});

app.get("/", function(req, res){
  res.render("login");
});

app.get("/landing", function(req, res){

  reviews.find({}, function(err, foundReviews){
    if(err){
      console.log(err);
    }else{
      if(foundReviews){
      }
        res.render("landing", {
          foundReviews : foundReviews
        });
    }
  });
  console.log(reviews);

});

app.get("/friendship", function(req, res){

  friendshipConnect.find({}, function(err, foundfriends){
    if(err){
      console.log(err);
    }else{
      if(foundfriends){
        res.render("friendship", {
          friendshipCategory : friendshipCategory,
          onlineUsers : onlineUsers,
          foundfriends : [foundfriends]
        });
      }
    }
  });

});

app.get("/relationships", function(req, res){
  res.render("relationships");
});

app.get("/businesMarket", function(req, res){
  res.render("businessMarket");
});

app.get("/theWatcher", function(req, res){
  res.render("theWatcher");
});

app.get("/invitation", function(req, res){
  res.render("invitation");
});

app.get("/randomChat", function(req, res){

  res.render("randomChat");
});

app.get("/analytics", function(req, res){

  analytics.find({_id : "63690b3b16ed20b8b1505073"}, function(err, foundDoc){
    if(err){
      console.log(err);
    }else{
      if(foundDoc){
        res.render("analytics", {
          foundDoc : foundDoc
        });
      }
    }
  });

});

app.get("/report", function(req, res){
  res.render("report");
});

app.get("/reviews", function(req, res){
  reviews.find({}, function(err, foundImages){
    if(err){
      console.log(err);
    }else{
      res.render("reviews", {foundImages : foundImages});
    }
  });
});

// app.post("/reviews", upload.single("image") ,function(req, res, next){
//
//   let username = req.body.username;
//   let userReview = req.body.review;
//
//   var obj = new reviews({
//     userImage : {
//         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//         contentType: 'image/png'
//       },
//     username : username,
//     userReview : userReview
//   });
//
//   reviews.findOne({userReview : obj.userReview}, function(err, review){
//     if(err){
//       console.log(err);
//     }else{
//       if(review){
//         console.log("This review already exists"); // show in jumbotron
//       }else{
//         obj.save(function(err){
//           if(err){
//             console.log(err);
//           }else{
//             console.log("Successfully uploaded the review"); // show in jumbotron
//           }
//         });
//       }
//
//     }
//   });
//
// });

app.get("/analytics", function(req, res){
  res.render("analytics");
});

app.get("/connectionsData", function(req, res){

  connections.find({}, function(err, foundConnections){
    res.render("connectionsData", {
      foundConnections : foundConnections
    });
  });

});

app.get("/reportsData", function(req, res){

  report.find({}, function(err, foundReports){
        res.render("reportsData", {
          foundReports : foundReports
        });
  });

});

app.get("/ban", function(req, res){
  res.render("ban");
});

app.listen(3000, function(){
  console.log("Listening to port 3000");
});
