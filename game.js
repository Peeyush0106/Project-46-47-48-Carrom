function draw() {
    background(255, 250, 220);
    getPlayerData();
    rectMode(CENTER);
    checkConnection();
    gameControls();
    loginStatus();

    if (frameCount % 20 === 0) {
        compareDatabaseData(prev_data)
    }

    if (playerCount === 2 && playClicked) {
        startPlaying();
        startGame();
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
    if (gameState === 1) gameStart();

    continueQueenTimerUntilOver();
}

function gameControls() {
    if (leftArrowPressed) {
        if (striker2.x === 500) striker2.x = 464;
        if (striker2.x > 464) striker2.x = 500;
        if (striker2.x > 100) striker2.x -= 4;
    }

    if (rightArrowPressed) {
        if (striker2.x === 100) striker2.x = 136;
        if (striker2.x < 136) striker2.x = 100;
        if (striker2.x < 500) striker2.x += 4;
    }

    if (!checkedAnEnterStatement) {
        if (!gameStarted && !loggedInWithName && keyDown("enter")) {
            guestContinue();
            checkedAnEnterStatement = true;
        }
    }
    if (!checkedAnEnterStatement) {
        if (!gameStarted && loggedInWithName && !loggedIn && keyDown("enter")) {
            continueGame();
            checkedAnEnterStatement = true;
        }
    }
    if (!checkedAnEnterStatement) {
        if (!gameStarted && loggedIn && keyDown("enter")) {
            playClicked = true;
            playerCount += 1;
            updatePlrCount();
            plrIndex = playerCount - 1;
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

function compareDatabaseData(dataToCompare) {
    //console.log(dataToCompare);
    database.ref("/").get().then(function (data) {
        if (data.exists()) {
            var dataReceived = data.val();
            if (JSON.stringify(dataToCompare) !== JSON.stringify(dataReceived)) {
                console.log(dataReceived);
                // console.log(prev_data);
                prev_data = data.val();
            }
            return data.val();
        }
    });
}

function checkifGameStatedAndOtherPlrDataNotAvail() {
    database.ref("/Playing").get().then(function (data) {
        if (data.exists()) {
            otherPlrNameCounted = false;
            for (var i in data.val()) if (data.val()[i].name !== plrName) otherPlrNameCounted = true;
            if (!otherPlrNameCounted) otherPlrExists = false;
        }
    });
}

function gameStart() {
    getOpponentsAngle();
    getOppsShoot();
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
    if (allPlrData) {
        getOtherPlrName();
    }
    if (plrIndex === 0 && !firstTurnDecisionDone) {
        var firstPlayerIndex = Math.round(Math.random());
        if (firstPlayerIndex === 1) {
            database.ref("Playing/" + otherPlrName).update({
                isFirstPlayer: true
            });
        }
        else {
            database.ref("Playing/" + plrName).update({
                isFirstPlayer: true
            });
            IamFirst = true;
        }
        console.log(firstPlayerIndex, "plays first");
        firstTurnDecisionDone = true;
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
        striker.x = striker2.x;
        striker2.pointTo(mouseX, mouseY);
        if (mouseDown() && mouseY < 600) {
            striker.pointTo(mouseX, mouseY);
        }
        else {
            if (striker2.x === 496 && keyDown("left")) striker2.x = 464;
            if (striker2.x === 104 && keyDown("right")) striker2.x = 136;

            if (keyDown("a")) striker.rotation -= 4;
            if (keyDown("d")) striker.rotation += 4;

            if (keyDown("enter") && !(checkedAnEnterStatement && mouseDown())) shoot();
            if (strikerState === "moving") striker2.x = mouseX;

            if (striker2.x > 464 && !keyDown("left")) striker2.x = 500;
            if (striker2.x < 136 && !keyDown("right")) striker2.x = 100;

            if (striker2.x > 100 && keyDown("left")) striker2.x = striker2.x - 4;
            if (striker2.x < 500 && keyDown("right")) striker2.x = striker2.x + 4;
        }
    }
    if (!strikerReady) striker2.pointTo(striker.x, striker.y);

    if (Math.round(Math.abs(striker.velocity.x)) <= 0.65
        && Math.round(Math.abs(striker.velocity.y)) <= 0.65
        && striker.x !== 300
        && striker.y !== 530) {
        setStriker();
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
    }

    if (haveToSetStriker) {
        setStrikerToInitPos();
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