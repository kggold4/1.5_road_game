let redCounterSteps = 0;
let blueCounterSteps = 0;
let postID;
let win = true;

let redLastCommand;
let blueLastCommand;

function getDOM(id) {
    return document.getElementById(id);
} 

function play() {
    //Init red ball on the board
    let redBall = document.createElement('span');
    redBall.id = "redBall";
    redBall.innerHTML = "a1";
    getDOM("a1").appendChild(redBall);

    //Init blue ball on the board
    let blueBall = document.createElement('span');
    blueBall.id = "blueBall";
    blueBall.innerHTML = "a6";
    getDOM("a6").appendChild(blueBall);

    // call key listener function
    getKey();
}

function getKey() {
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                redMove("stay", "red");
                break;
            case 38:
                redMove("up", "red");
                break;
            case 39:
                redMove("right", "red");
                break;
            case 40:
                redMove("down", "red");
                break;
        }
     };
}

function checkAction(action, ballColor) {
    var state;
    if(ballColor == "red") {
        state = redBall.innerHTML; // Get red ball state
    }
    else {
        state = blueBall.innerHTML; // Get blue ball state
    }
    console.log("ball: " + ballColor + " is in: " + state)

    switch (action) {
        case "stay":
            return true;
        case "up":
            if(state[0] == 'b') {
                return true;
            }
            else {
                console.log("can't go up");
            }
            break;
        case "right":
            if(ballColor == "red") {
                if(state[0] == "a") {
                    return true;
                } else {
                    console.log("can't go right");
                }
            }
            break;
        case "down":
            if(state[0] == "a") {
                return true;
            } else {
                console.log("can't go down");
            }
            break;
        case "left":
            if(ballColor == "blue") {
                if(state[0] == "a") {
                    return true;
                } else {
                    console.log("can't go left");
                }
            }
            break;
    }
    return false;
}
function redMove(to) {
    var redState = redBall.innerHTML; // Get red ball state
    if(redState == "a6") {
        alert("you won! \nYou can do another try.");
        win = true;
        finishGame();
    }
    var validMove = checkAction(to, "red"); //if operation is valid
    if(validMove) {
        switch (to) {
            case "stay":
                saveActionToFirebase("stay", "red");
                break;
            case "up":
                moveUp("red");
                break;
            case "right":
                moveRight();
                break;
            case "down":
                moveDown("red");
                break;
        }
        blueMove();
    }
    if(cheackIfLoss()) {
        alert("you loss! \nYou collided with the blue ball.\ntry again.");
        win = false;
        finishGame();
    }
}

function blueMove() { //make random action
    var blueState = blueBall.innerHTML; // Get blue ball state
    var redState = redBall.innerHTML; // Get blue ball state
    
    var actionsArray;
    if(parseInt(redState[1]) == parseInt(blueState[1])) {
        actionsArray = ["left"];
    } else if(blueState == "a1") {
        actionsArray = ["stay"]; //blueBall has reached to destination
    } else {
        actionsArray = ["stay", "down", "up", "left"];
    }
    var randomAction = actionsArray[actionsArray.length * Math.random() | 0];
    while(!checkAction(randomAction, "blue")) { //find valid action 
        randomAction = actionsArray[actionsArray.length * Math.random() | 0];
    }
    switch (randomAction) {
        case "stay":
            saveActionToFirebase("stay", "blue");
            break;
        case "up":
            moveUp("blue");
            break;
        case "down":
            moveDown("blue");
            break;
        case "left":
            moveLeft();
            break;
    }
}

function moveOnboard(currentPosition, newPosition, color) {
    var ballElement;
    if(color == "red") {
        ballElement = redBall;
    }
    else { //color == "blue"
        ballElement = blueBall;
    }
    ballElement.innerHTML = newPosition;
    getDOM(currentPosition).removeChild(getDOM(currentPosition).childNodes[0]);
    getDOM(newPosition).appendChild(ballElement);
}

function moveRight() { //must be red ball (blue ball can't go right)
    var redState = redBall.innerHTML;
    var num = parseInt(redState[1]);
    num++;
    var newRedState =  "a" + num;
    moveOnboard(redState, newRedState, "red");
    saveActionToFirebase("right", "red");
}

function moveLeft() { //must be blue ball (red ball can't go right)
    var blueState = blueBall.innerHTML;
    var num = parseInt(blueState[1]);
    num--;
    var newBlueState =  "a" + num;
    moveOnboard(blueState, newBlueState, "blue");
    saveActionToFirebase("left", "blue");
}

function moveUp(ballColor) {
    var currentPosition;
    var newPosition;
    if(ballColor == "red") {
        currentPosition = redBall.innerHTML;
        saveActionToFirebase("up", "red");
    } else { //color == "blue"
        currentPosition = blueBall.innerHTML;
        saveActionToFirebase("up", "blue");
    }
    newPosition =  "a" + parseInt(currentPosition[1]);
    moveOnboard(currentPosition, newPosition, ballColor);
}

function moveDown(ballColor) {
    var currentPosition;
    var newPosition;
    if(ballColor == "red") {
        currentPosition = redBall.innerHTML;
        saveActionToFirebase("down", "red");
    } else { //color == "blue"
        currentPosition = blueBall.innerHTML;
        saveActionToFirebase("down", "blue");
    }
    newPosition =  "b" + parseInt(currentPosition[1]);
    moveOnboard(currentPosition, newPosition, ballColor);
}

function cheackIfLoss() { //if red and blue ball in the same position
    redState = redBall.innerHTML; // Get red ball state
    blueState = blueBall.innerHTML; // Get red ball state

    console.log("redLastCommand: "+ redLastCommand + ",blueLastCommand: "+ blueLastCommand);
    console.log("redState[1]: "+ redState[1] +",blueState[1]: "+ redState[1]);
    console.log((redLastCommand == "right") && (blueLastCommand == "left") &&
    (parseInt(redState[1])+1 == parseInt(blueState[1])) && (redState == blueState));

    return ((redLastCommand == "right") && (blueLastCommand == "left") &&
    (parseInt(redState[1])-1 == parseInt(blueState[1])) || (redState == blueState)); 
}

function finishGame() { //update database
    getDOM("panel").innerHTML += "<br> end game <br>";

    redCounterSteps = 0;
    blueCounterSteps = 0;

    firebase.database().ref("games/"+postID+"/win").set(win);
    firebase.database().ref("games/"+postID+"/title").remove();

    postID = null;
    redBall = null;
    blueBall = null;

    //clear the board
    var cells = ["a1", "a2", "a3", "a4", "a5", "a6",
                "b1", "b2", "b3", "b4", "b5", "b6"];
    
    for(var i =0; i<cells.length; i++){
        cell = getDOM(cells[i]);
        while (cell.hasChildNodes()) {  
            cell.removeChild(cell.firstChild);
        }
    }
    
  //  play(); //start over
}

function saveActionToFirebase(command, color) {
    if(color == "red") {
        redCounterSteps++;
        redLastCommand = command;
        getDOM("panel").innerHTML += redCounterSteps + ". " + redBall.id + " move to: " + redBall.innerHTML + " command: " + command + "<br>";
    }
    else {
        blueCounterSteps++;
        blueLastCommand = command
        getDOM("panel").innerHTML += blueCounterSteps + ". " + blueBall.id + " move to: " + blueBall.innerHTML + " command: " + command + "<br>";
        firebase.database().ref("games/"+postID+"/"+blueCounterSteps).set({
            "blue": blueBall.id + " move to: " + blueBall.innerHTML+", command: " + blueLastCommand,
            "red": redBall.id + " move to: " + redBall.innerHTML +", command: " + redLastCommand
        })
    }
}

function initializeFirebase() {
    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDROtt5r3t5VL_iPabcgVgsWmUZHMw7Pv8",
        authDomain: "road-game.firebaseapp.com",
        projectId: "road-game",
        storageBucket: "road-game.appspot.com",
        messagingSenderId: "14363967441",
        appId: "1:14363967441:web:c422a8a462e6352f2ceaf0"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
     // Generate a reference to a new location and add some data using push()
     var newPostRef = firebase.database().ref("games").push({
        title: "Game not finished yet"
    });
    // Get the unique ID generated by push() by accessing its key
    postID = newPostRef.key;
    console.log("postID"+postID);
}
