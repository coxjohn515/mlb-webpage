
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
  return 'http://gdx.mlb.com/components/game/mlb/year_'+year+'/month_'+month+'/day_'+day+'/master_scoreboard.json'
}

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

function setImage (gameIndex,index, json) {
  console.log(json.data.games.game[gameIndex].away_team_name + " @ " + json.data.games.game[gameIndex].home_team_name);
  var pic = document.getElementById("pic"+index);
  if (json.data.games.game[gameIndex].video_thumbnails === undefined) {
    pic.src = "no-thumbnail.jpg";
  }
  else {
    //pic.src = json.data.games.game[gameIndex].video_thumbnails.thumbnail["0"].content;
    pic.src = urlExist(json.data.games.game[gameIndex].video_thumbnails.thumbnail["0"].content);
  }

}

function setText (gameIndex,index,json) {
  var game = json.data.games.game[gameIndex];
  console.log("Entered into setText");
  console.log(gameIndex);
  if(game.status.status === "Preview") {
    document.getElementById("head"+index).innerHTML = game.away_team_name + " @ " + game.home_team_name;
    document.getElementById("para1-"+index).innerHTML = "Game Start Time: " + game.time + game.ampm;
    document.getElementById("para2-"+index).innerHTML = "";
  }
  else {
    document.getElementById("head"+index).innerHTML = game.away_team_name + " @ " + game.home_team_name;
    document.getElementById("para1-"+index).innerHTML = game.away_name_abbrev + " " + game.linescore.r.away + " - " + game.home_name_abbrev + " " + game.linescore.r.home;
    document.getElementById("para2-"+index).innerHTML = getStatus(gameIndex,index,json);
  }
}

function getStatus(gameIndex,index,json) {
  var game = json.data.games.game[gameIndex];
  if (game.status.status === "Final") {
    return "Final";
  }
  if(game.status.top_inning === "Y") {
    return "Top " + game.status.inning +" B:" + game.status.b + " S:" + game.status.s + " O:" + game.status.o;
  }
  else {
    return "Bot " + game.status.inning + " B:" + game.status.b + " S:" + game.status.s + " O:" + game.status.o;
  }
}


function urlExist (picUrl) {
    var http = new XMLHttpRequest();
    http.open('GET', picUrl);
    http.send();
    console.log("HTTP status: "+http.status)
    if (http.status !== 404) {
        console.log(picUrl);
        return picUrl;
    }
    else {
        console.log("no-thumbnail.jpg");
        return "no-thumbnail.jpg";
    }
}
divArray = ["first", "second", "third", "fourth"];
divIndex = 0;
function onFocus(next, prev) {
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

function checkKey (e) {
    if (e.keyCode === 37) {
        console.log("left key pressed");
        if (divIndex === 0) {
            // do nothing
        }
        else {
            divIndex--;
            console.log(divIndex);
            onFocus(divArray[divIndex], divArray[divIndex+1]);
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
            onFocus(divArray[divIndex], divArray[divIndex-1]);
        }
    }
    else if (e.keyCode === 78) {
        window.onload();
    }
}

