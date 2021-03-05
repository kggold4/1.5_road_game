let redCounterSteps = 0;
let redBallOp = false;

function getDOM(id) {
    return document.getElementById(id);
}

function play() {
    let redBall = document.createElement('span');
    redBall.id = "redBall";
    redBall.innerHTML = "a1";
    getDOM("a1").appendChild(redBall);
    getKey();
}

function getKey() {
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                move("stay", "red");
                // move("stay", "blue");
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

function move(to, flag) {
    var valid = false;
    if(flag == "red") {

        console.log(to + " key is pressed.");
        if(redBall.innerHTML == "a8") end();
        if(to == "stay") {
            valid = true;
        } else if(to == "up") {
            if(redBall.innerHTML[0] == 'a') {
                console.log("can't go up");
            } else moveUp();

        } else if(to == "right") {

            if(redBall.innerHTML[0] == "b") {
                console.log("can't go right");
            } else moveRight();

        } else {

            if(redBall.innerHTML[0] == "b") {
                console.log("can't go down");
            } else moveDown();

        }

        if(redBall.innerHTML == "a1") console.log("on start");
        

    }
    
    if(valid) {
        
    }

    
}

function moveRight(flag) {

    if(flag == "red") {

        var id = redBall.innerHTML;
        var ballElement = redBall;
        getDOM(id).innerHTML = "";
        var num = parseInt(id[1]);
        num++;
        var newId =  "a" + num;
        getDOM(newId).appendChild(ballElement);
        ballElement.innerHTML = newId;
        write("redBall", "move right");

    } else {

    }

    
}

function moveUp(flag) {


    if(flag == "red") {

        var id = redBall.innerHTML;
        var ballElement = redBall;
        getDOM(id).innerHTML = "";
        var num = parseInt(id[1]);
        var newId =  "a" + num;
        getDOM(newId).appendChild(ballElement);
        ballElement.innerHTML = newId;
        write("redBall", "move up");

    } else {
        
    }

    
    
}

function moveDown(flag) {

    if(flag == "red") {

        var id = redBall.innerHTML;
        var ballElement = redBall;
        getDOM(id).innerHTML = "";
        var num = parseInt(id[1]);
        var newId =  "b" + num;
        getDOM(newId).appendChild(ballElement);
        ballElement.innerHTML = newId;
        write("redBall", "move down");

    } else {

    }

    

}

function end() {
    getDOM("panel").innerHTML += "end game";
}

function write(id, command) {
    console.log(redBall.innerHTML);
    redCounterSteps++;
    getDOM("panel").innerHTML += redCounterSteps + ". " + id + " move to: " + redBall.innerHTML + " command: " + command + "<br>";
}
