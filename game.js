function draw() {
    background(255, 250, 220);
    getPlayerData();
    rectMode(CENTER);
    checkConnection();
    gameControls();
    loginStatus();

    // if (frameCount % 20 === 0) {
    //     compareDatabaseData(prev_data)
    // }

    if (playerCount === 2 && playClicked) {
        startPlaying();
        startGame();
        setOtherPlayerInfo();
        selectPlayerForShot();
        checkedAnEnterStatement = true;
        oppStriker.x = 300;
        oppStriker.y = 65;
        playClicked = false;
        waitingForPlr = false;
        cancelPlayRequest.hide();
        unnotify();
    }
    if (playerCount >= 2 && !shownDisableMsg && !gameStarted && loggedIn) {
        disablePlayBtn();
        shownDisableMsg = true;
        shownReadyMessage = false;
    }

    if (gameState === 0) queenTxt.hide();
    if (gameState === 1) gamePlay();

    continueQueenTimerUntilOver();
}

function gameControls() {
    if (leftArrowPressed) {
        if (striker.x === 500) striker.x = 464;
        if (striker.x > 464) striker.x = 500;
        if (striker.x > 100) striker.x -= 4;
    }

    if (rightArrowPressed) {
        if (striker.x === 100) striker.x = 136;
        if (striker.x < 136) striker.x = 100;
        if (striker.x < 500) striker.x += 4;
    }

    if (!checkedAnEnterStatement && !gameStarted && keyDown("enter")) {
        if (!loggedInWithName) {
            guestContinue();
            checkedAnEnterStatement = true;
        } else if (loggedInWithName && !loggedIn) {
            continueGame();
            checkedAnEnterStatement = true;
        } else if (loggedIn) {
            playClicked = true;
            playerCount += 1;
            updatePlrCount();
            plrIndex = playerCount - 1;
            checkedAnEnterStatement = true;
        }
    }
    if (keyWentUp("enter")) {
        checkedAnEnterStatement = false;
    }
}

function motivationalTxts() {
    if (playerCount === 2 && !shownReadyMessage && !gameStarted && loggedIn) {
        document.getElementById("play-btn").disabled = false;
        startButtons[1].style("background-color", "blue");
        shownReadyMessage = true;
    }
    if (loggedIn && gameStarted && !addedMeInGame) {
        addedMeInGame = true;
    }
    if (!gameStarted && !waitingForPlr && !otherMsgShouldTakeOver) {
        notify(saluteMsg, "yellow", "green", false);
    }
    if (hour() >= 5 && hour() <= 12) {
        periodOfDay = "Morning";
    }
    else if (hour() >= 13 && hour() <= 16) {
        periodOfDay = "After Noon";
    }
    else {
        periodOfDay = "Evening";
    }
    if (plrName) {
        saluteMsg = "Good " + periodOfDay + ", " + plrName;
    }
    else {
        saluteMsg = "Good " + periodOfDay;
    }
    if (points != "not-initialized") mouse_pos.innerText = "Turns: " + turns + " || Score: " + points + " || MouseX: " + mouseX + " || MouseY: " + mouseY;

    if (notifyTimeStarted) {
        notifyCountDownContinue();
    }
    if (notificationTime === 0) {
        unnotify();
        notifyTimeStarted = false;
    }
}

function loginStatus() {
    if (inGamingMode) {
        signoutBtn.hide();
    }
    if (loggedIn) {
        updateStatus();
        if ((playClicked && playerCount === 1) || waitingForPlr) {
            notify("Waiting for another player...", "yellow", "black", false);
            cancelPlayRequest.show();
            disablePlayBtn();
            waitingForPlr = true;
            showLoadingAnim();
        }
        else {
            cancelPlayRequest.hide();
            enablePlayBtn();
            unnotify();
            waitingForPlr = false;
        }
        if (startButtons[0].elt.style.display !== "none" && startButtons[1].elt.style.display !== "none") {
            signoutBtn.show();
        }
    }
    else {
        if (startButtons[0].elt.style.display !== "none") {
            push();
            rectMode(CORNER);
            fill("black");
            noStroke();
            rect(137.5, 290, 310, 255);
            fill("white");
            textSize(30);
            text("Start Gaming Options", 150, 535);
            pop();
        }
    }
}

function inGameOptions() {
    if (showOptions.currentOpt === 1) {
        startButtons[4].show();
        startButtons[5].show();
        startButtons[6].show();
        startButtons[7].show();
        showOptions.goNeutral();
    }
    if (showOptions.currentOpt === -1) {
        startButtons[4].hide();
        startButtons[5].hide();
        startButtons[6].hide();
        startButtons[7].hide();
        showOptions.goNeutral();
    }
}

function win() {
    push();
    fill("black");
    rect(300, 300, 300, 200);
    fill("yellow");
    textSize(30);
    text("You win!!! Great job...", 150, 225);
    textSize(15);
    text("You", 150, 350);
    text(plrName, 150, 360);
    text("Opponent", 340, 350);
    text(otherPlrName, 340, 360);
    pop();
}

function checkifGameStartedAndOtherPlrDataNotAvail() {
    database.ref("/Playing").get().then(function (data) {
        if (data.exists()) {
            otherPlrNameCounted = false;
            for (var i in data.val()) {
                if (data.val()[i].name !== plrName) {
                    otherPlrNameCounted = true;
                }
            }
            if (!otherPlrNameCounted) {
                otherPlrExists = false;
            }
        }
    });
}

function gamePlay() {
    //getOpponentsAngle();
    //getOppsShoot();
    // checkifGameStatedAndOtherPlrDataNotAvail();
    // if (!otherPlrExists) {
    //     setTimeout(function () {
    //         text("The other player is not yet live", 125, 275);
    //         if (!alertForOtherPlrNotLiveShown) {
    //             alert("The other player has joined but might have switched his/her window or has poor network connection.");
    //             alertForOtherPlrNotLiveShown = true;
    //         }
    //     }, 1000);
    // }

    if(isMyTurn()) {
        striker.visible = true;
        oppStriker.visible = false;
    } else {
        oppStriker.visible = true;
        striker.visible = false;
    }


    if (opposAngle) {
        oppStriker.rotation = opposAngle + 180;
    }
    for (let j = 0; j < strip_pos.x.length; j++) {
        push();
        fill("black");
        rect(strip_pos.x[j], strip_pos.y[j], strip_pos.width[j], strip_pos.height[j]);
        pop();
    }
    drawShapesAndPatternsOnBoard();

    // Bouncing
    bounceObjects();

    if (strikerReady) {
        //striker.x = striker2.x;
        //striker.pointTo(mouseX, mouseY);
        if (mouseDown() && mouseY < 600) {
            striker.pointTo(mouseX, mouseY);
        }
        else {
            if (striker.x === 496 && keyDown("left")) striker.x = 464;
            if (striker.x === 104 && keyDown("right")) striker.x = 136;

            if (keyDown("a")) striker.rotation -= 4;
            if (keyDown("d")) striker.rotation += 4;

            if (keyDown("enter") && !(checkedAnEnterStatement && mouseDown())) shoot();
            if (strikerState === "moving") striker.x = mouseX;

            if (striker.x > 464 && !keyDown("left")) striker.x = 500;
            if (striker.x < 136 && !keyDown("right")) striker.x = 100;

            if (striker.x > 100 && keyDown("left")) striker.x = striker.x - 4;
            if (striker.x < 500 && keyDown("right")) striker.x = striker.x + 4;
        }
    }
    //if (!strikerReady) striker2.pointTo(striker.x, striker.y);

    if (Math.round(Math.abs(striker.velocity.x)) <= 0.65
        && Math.round(Math.abs(striker.velocity.y)) <= 0.65
        && striker.x !== 300
        && striker.y !== 530) {
        setStriker();
        switchTurn();
    }
    if (striker.y === 530 && Math.round(Math.abs(striker.velocity.x)) <= 0.65 && Math.round(Math.abs(striker.velocity.y)) <= 0.65) {
        strikerReady = true;
    }
    else {
        strikerReady = false;
    }

    // Destroying coins
    destroyCoins();
    // Reset striker
    if (striker.isTouching(pockets)) {
        setStriker();
        striker.setVelocity(0, 0);
        switchTurn();
    }

    drawSprites();

    if (gameState === 1) {
        push();
        noFill();
        stroke("black");
        strokeWeight(3);
        rect(235, 705, 357.5 - 115, 735 - 675);
        pop();
    }

    if (queenInPocket) {
        queen.x = 20;
        queen.y = 690;
        queen.setVelocity(0, 0);
        for (var n in coins.length - 1) {
            coins[n].bounceOff(boardEdge);
        }
        waitForQueenCover = true;
    }
    else {
        coins.bounceOff(boardEdge);
    }
    if (waitForQueenCover) {
        pointsAfterQueenCaptured = points;
        if (recentQueenCapturedTurnNo === turnStarts - 2) {
            if (pointsAfterQueenCaptured > 0) {
                points += queen.points;
                notify("Yeah, you captured the queen!!! You're amazing...", "black", "yellow");
                queenInPocket = false;
            }
            else {
                notify("Ohh, don't be sad, try again to capture it! You'll be a master soon..", "red", "white");
                queenInPocket = false;
                queen.x = 300;
                queen.y = 300;
            }
            waitForQueenCover = false;
        }
    }
}

async function setOtherPlayerInfo() {
    while (allPlrData === undefined) {
        await new Promise(r => setTimeout(r, 100));
    }
    if (allPlrData && !otherPlrName) {
        //set master info
        otherPlrIndex = plrIndex === 0 ? 1 : 0;
        for (const i in allPlrData) {
            const plr = allPlrData[i];
            if (parseInt(plr.index) === otherPlrIndex) {
                otherPlrName = plr.name;                
                break;
            }
        }
    }
}

async function selectPlayerForShot() {
    while (otherPlrName === undefined) {
        await new Promise(r => setTimeout(r, 100));
    }
    if (plrIndex === 0) {        
        var firstPlayerIndex = Math.round(Math.random());
        if (firstPlayerIndex === 1) {
            database.ref("Playing/" + otherPlrName).update({
                chance: true
            });
            database.ref("Playing/" + plrName).update({
                chance: false
            });
        }
        else {
            database.ref("Playing/" + plrName).update({
                chance: true
            });
            database.ref("Playing/" + otherPlrName).update({
                chance: false
            });
        }        
    }
}

function isMyTurn() {
    if(allPlrData && allPlrData[plrName]) {
        myTurn = allPlrData[plrName].chance;
        return myTurn;
    }
}

function switchTurn() {

}
