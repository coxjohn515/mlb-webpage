/* Name: John Cox
 * Date: March 14, 2017
 * File: script.js
 */

/*
 * This function is used to pull JSON data for the current date.
 * Returns a string with the proper date format for the URL.
 */
function getGameDate (){
  
  var d = new Date();
    var year = d.getFullYear();
    if (d.getMonth() > 9) {
      var month = d.getMonth()+1;
    }
    else {
      var month = "0"+(d.getMonth()+1);
    }
    if(d.getDate() > 9) {
      var day = d.getDate();
    }
    else {
      var day = "0"+d.getDate();
    }
  return 'http://gdx.mlb.com/components/game/mlb/year_'+year+'/month_'+month+
          '/day_'+day+'/master_scoreboard.json'
}
/*
 * Function fetches JSON data, using XMLHttpRequest. We check if the request
 * received a status of 200 or HTTP OK. If this is true, then we consume the 
 * responseText into our data variable and check if we have callback function to
 * send our data to. In this case, our callback function is an 
 * anonymous function, that loops through the JSON object.
 */
function fetchJSONFile(path, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(req.readyState === 4) {
        if(req.status === 200) {
          var data = JSON.parse(req.responseText);
          console.log(callback)
          if(callback) callback(data);
        }
      }
    };
    req.open('GET', path);
    req.send();
}
/*
 * Function creates a canvas with the supplied MLB image for the background.
 * The image is drawn onload. img-canvas has a z-index of -1 so cards appear
 * ahead of canvas.
 */
function makeCanvas () {
    var img = new Image();
    var img_canvas = document.getElementById("img-canvas"),
    c = img_canvas.getContext("2d");
    img.onload = function() {
      c.drawImage(img, 0, 0);
    }
    img.src = "http://mlb.mlb.com/mlb/images/devices/ballpark/1920x1080/1.jpg";
    var canvas = document.getElementById("img-canvas"),
    ctx = canvas.getContext("2d");
}
/*
 * This function sets the image for the current indexed card. If the thumbnails
 * field is undefined or absent from the JSON we apply the no-thumbnail image
 * to the card.
 */
function setImage (gameIndex,index, json) {
  console.log(json.data.games.game[gameIndex].away_team_name + " @ " + 
          json.data.games.game[gameIndex].home_team_name);
  var pic = document.getElementById("pic"+index);
  if (json.data.games.game[gameIndex].video_thumbnails === undefined) {
    pic.src = "no-thumbnail.jpg";
  }
  else {
    pic.src = json.data.games.game[gameIndex].video_thumbnails.thumbnail["0"].content;
  }

}
/*
 * This function sets the Text fields of the current indexed card. The only thing
 * we check is if the game is still in Preview status, if this is the case
 * we do not show scores, balls, strikes, outs only the start time of the game.
 * If the game has already started, we show the two teams playing on the header
 * and show the inning, balls, strikes, outs and score below the thumbnail.
 */
function setText (gameIndex,index,json) {
  var game = json.data.games.game[gameIndex];
  console.log("Entered into setText");
  console.log(gameIndex);
  if(game.status.status === "Preview") {
    document.getElementById("head"+index).innerHTML = game.away_team_name +
            " @ " + game.home_team_name;
    document.getElementById("para1-"+index).innerHTML = "Game Start Time: " +
            game.time + game.ampm;
    document.getElementById("para2-"+index).innerHTML = "";
  }
  else {
    document.getElementById("head"+index).innerHTML = game.away_team_name + 
            " @ " + game.home_team_name;
    document.getElementById("para1-"+index).innerHTML = game.away_name_abbrev +
            " " + game.linescore.r.away + " - " + game.home_name_abbrev + " " +
            game.linescore.r.home;
    document.getElementById("para2-"+index).innerHTML = getStatus(gameIndex,index,json);
  }
}
/*
 * Helper function for setText, this function checks the current game status. If
 * the game is Final, the information below the thumbnail will only be the scores.
 * If the game is not final, then more information is shown like Top or Bottom of
 * inning.
 */
function getStatus(gameIndex,index,json) {
  var game = json.data.games.game[gameIndex];
  if (game.status.status === "Final") {
    return "Final";
  }
  if(game.status.top_inning === "Y") {
    return "Top " + game.status.inning +" B:" + game.status.b + 
            " S:" + game.status.s + " O:" + game.status.o;
  }
  else {
    return "Bot " + game.status.inning + " B:" + game.status.b + 
            " S:" + game.status.s + " O:" + game.status.o;
  }
}
/*
 * The two functions, focusedDiv and checkKey combined, create transitions and
 * movement between each card. When a card is focused the width,height,top, 
 * opacity, and transition values are changed. We keep track of previous div
 * and next div because when we tap the arrow keys we want to change the looks
 * of the focused div of the next one and restore the ones for the previous card.
 * for checkKey we only check for 3 key presses. We check left and right arrows,
 * and we check if the the "N" key is pressed to show the next set of games.
 */
divArray = ["first", "second", "third", "fourth"];
divIndex = 0;
function focusedDiv(next, prev) {
        document.getElementById(next).style.width = '18%';
        document.getElementById(next).style.height = '15%';
        document.getElementById(next).style.top = '48%';
        document.getElementById(next).style.opacity = '0.9';
        document.getElementById(next).style.transition = 'width 0.5s';

        document.getElementById(prev).style.width = '15%';
        document.getElementById(prev).style.height = '10%';
        document.getElementById(prev).style.top = '50%';
        document.getElementById(prev).style.opacity = '0.4';
}
/*
 * divArray and divIndex are used to keep track of which div is currently focused.
 * If divIndex is 0 or 3 we do nothing if the user tries to right or left out of
 * bounds. If the user presses the left key, the previous will be divIndex + 1.
 * The opposite is true for right key press, the divIndex will be divIndex - 1
 * for previous.
 */
function checkKey (e) {
    if (e.keyCode === 37) {
        console.log("left key pressed");
        if (divIndex === 0) {
            // do nothing
        }
        else {
            divIndex--;
            console.log(divIndex);
            focusedDiv(divArray[divIndex], divArray[divIndex+1]);
        }
    }
    else if (e.keyCode === 39 ) {
        console.log("right key pressed");
        if (divIndex === 3) {
            // do nothing
        }
        else {
            divIndex++;
            console.log(divIndex);
            focusedDiv(divArray[divIndex], divArray[divIndex-1]);
        }
    }
    else if (e.keyCode === 78) {
        window.onload();
    }
}

