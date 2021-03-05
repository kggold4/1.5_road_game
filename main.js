let redCounterSteps = 0;

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
                move("stay", "red");
                break;
            case 38:
                move("up", "red");
                break;
            case 39:
                move("right", "red");
                break;
            case 40:
                move("down", "red");
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
function move(to, ballColor) {
    if(redState == "a6") end();
    var validMove = checkAction(to, ballColor); //if operation is valid
    var redState = redBall.innerHTML; // Get red ball state
    if(validMove) {
        switch (to) {
            case "stay":
                break;
            case "up":
                moveUp(ballColor);
                break;
            case "right":
                if(ballColor == "red") {
                    moveRight();
                }
                break;
            case "down":
                moveDown(ballColor);
                break;
            case "left":
                if(ballColor == "blue") {
                    moveDown();
                }
                break;
        }
        if(ballColor == "red") {
            blueAction();
        }
    }
}

function blueAction() {
    var redState = redBall.innerHTML;
    var blueState = blueBall.innerHTML;

    actionsArray = [];
    if(blueState != "a1") {
        //check where blue ball can move
        if(blueState[0] == 'a') {
            // actionsArray = ["stay", "down", "left"];
            actionsArray = ["down", "left"];
        }
        if(blueState[0] == "b") {
            // actionsArray = ["stay","up"];
            actionsArray = ["up"];
        }
        randomAction = actionsArray[actionsArray.length * Math.random() | 0];
        makeAction = move(randomAction, "blue");
        // while(!makeAction) {
        //     randomAction = actionsArray[actionsArray.length * Math.random() | 0];
        //     makeAction = move(randomAction, "blue");
        // }
    }
}

function moveRight() { //must be red ball (blue ball can't go right)
    var redState = redBall.innerHTML;
    var ballElement = redBall;
    getDOM(redState).innerHTML = "";
    var num = parseInt(redState[1]);
    num++;
    var newRedState =  "a" + num;
    getDOM(newRedState).appendChild(ballElement);
    ballElement.innerHTML = newRedState;
    write("redBall", "move right");
}

function moveLeft() { //must be blue ball (red ball can't go right)
    var blueState = blueBall.innerHTML;
    var ballElement = blueBall;
    getDOM(blueState).innerHTML = "";
    var num = parseInt(blueState[1]);
    num++;
    var newBlueState =  "a" + num;
    getDOM(newBlueState).appendChild(ballElement);
    ballElement.innerHTML = newBlueState;
    write("blueBall", "move left");
}

function moveUp(ballColor) {
    if(ballColor == "red") {
        var redState = redBall.innerHTML;
        var ballElement = redBall;
        getDOM(redState).innerHTML = "";
        var num = parseInt(redState[1]);
        var newRedState =  "a" + num;
        getDOM(newRedState).appendChild(ballElement);
        ballElement.innerHTML = newRedState;
        write("redBall", "move up");
    } else {
        var blueState = redBall.innerHTML;
        var ballElement = blueBall;
        getDOM(blueState).innerHTML = "";
        var num = parseInt(blueState[1]);
        var newBlueState =  "a" + num;
        getDOM(newBlueState).appendChild(ballElement);
        ballElement.innerHTML = newBlueState;
        write("blueBall", "move up");
    }
}

function moveDown(ballColor) {
    if(ballColor == "red") {
        var redState = redBall.innerHTML;
        var ballElement = redBall;
        getDOM(redState).innerHTML = "";
        var num = parseInt(redState[1]);
        var newRedState =  "b" + num;
        getDOM(newRedState).appendChild(ballElement);
        ballElement.innerHTML = newRedState;
        write("redBall", "move down");
    } else {
        var blueState = blueBall.innerHTML;
        var ballElement = blueBall;
        getDOM(blueState).innerHTML = "";
        var num = parseInt(blueState[1]);
        var newBlueState =  "b" + num;
        getDOM(newBlueState).appendChild(ballElement);
        ballElement.innerHTML = newBlueState;
        write("blueBall", "move down");
    }
}

function end() {
    getDOM("panel").innerHTML += "end game";
}

function write(redState, command) {
    console.log(redBall.innerHTML);
    redCounterSteps++;
    getDOM("panel").innerHTML += redCounterSteps + ". " + redState + " move to: " + redBall.innerHTML + " command: " + command + "<br>";
}
