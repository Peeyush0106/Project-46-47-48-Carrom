function draw() {
    background(255, 250, 220);
    getPlayerData();
    rectMode(CENTER);
    checkConnection();
    gameControls();
    loginStatus();

    if (strikerShoot) {
        console.log("Angle: " + striker.rotation + " and speed: " + striker.getSpeed());
    } else if(otherPlrShooting) {
        console.log("Opp Angle: " + oppStriker.rotation + " and Opp speed: " + oppStriker.getSpeed());

    }

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
    inGameOptions();

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

    /* guestModeBtn: 
    if (!checkedAnEnterStatement && !gameStarted && keyDown("enter")) {
        if (!loggedInWithName) {
            console.log("loggedInWithName");
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
    */
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
        if (startButtons[0].elt.style.display !== "none" && !signupBtn.elt.hidden) {
            push();
            rectMode(CORNER);
            fill("black");
            noStroke();
            // guestModeBtn - rect(137.5, 290, 310, 255);
            rect(137.5, 290, 310, 155);
            fill("white");
            textSize(30);
            // guestModeBtn - text("Start Gaming Options", 150, 535);
            text("Start Gaming Options", 150, 435);
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
    setOpponentStrikerPostion();
    imitateOpponentsShot();
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

    startButtons[0].elt.style.display = "none";
    startButtons[1].elt.style.display = "none";
    signoutBtn.elt.style.display = "none";

    striker.visible = isMyTurn();
    oppStriker.visible = !isMyTurn();

    if (isMyTurn() && showChancePopup) {
        document.getElementById("chance-popup").hidden = false;
        document.getElementById("your-turn-txt").innerHTML = "Your Turn <br> " + Math.ceil(popupTimer);
        popupTimer -= 1 / 2 / 2 / 2 / 2;
        if (Math.ceil(popupTimer) === 0) {
            showChancePopup = false;
            popupTimer = 3;
            document.getElementById("chance-popup").hidden = true;
        }
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
        if (striker.x === 496 && keyDown("left")) striker.x = 464;
        if (striker.x === 104 && keyDown("right")) striker.x = 136;

        if (keyDown("a")) striker.rotation -= 4;
        if (keyDown("d")) striker.rotation += 4;

        if (keyDown("up")) speedSlider.elt.value = speedSlider.value() + 1;
        if (keyDown("down")) speedSlider.elt.value = speedSlider.value() - 1;

        if (keyDown("enter") && !(checkedAnEnterStatement && mouseDown())) shoot();
        if (strikerState === "moving") striker.x = mouseX;

        if (striker.x > 464 && !keyDown("left")) striker.x = 500;
        if (striker.x < 136 && !keyDown("right")) striker.x = 100;

        if (striker.x > 100 && keyDown("left")) striker.x = striker.x - 4;
        if (striker.x < 500 && keyDown("right")) striker.x = striker.x + 4;
    }
    //if (!strikerReady) striker2.pointTo(striker.x, striker.y);

    if (Math.round(Math.abs(striker.velocity.x)) <= 0.65
        && Math.round(Math.abs(striker.velocity.y)) <= 0.65
        && striker.x !== 300
        && striker.y !== 530) {
        setStriker();
        database.ref("Playing/" + plrName).update({
            chance: false
        });
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
        database.ref("Playing/" + plrName).update({
            chance: false
        });
        striker.setVelocity(0, 0);
        switchTurn();
    }

    drawSprites();

    if (gameState === 1 && signupBtn.elt.style.display !== "none") {
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
    if (plrIndex === 0) {
        while (otherPlrName === undefined) {
            await new Promise(r => setTimeout(r, 100));
        }
        var firstPlayerIndex = Math.round(Math.random());
        var firstPlrName, secondPlrName;
        if (firstPlayerIndex === 1) {
            firstPlrName = otherPlrName;
            secondPlrName = plrName;
        }
        else {
            firstPlrName = plrName;
            secondPlrName = otherPlrName;
            showChancePopup = true;
        }

        database.ref("Playing/" + firstPlrName).update({
            chance: true
        });
        database.ref("Playing/" + secondPlrName).update({
            chance: false
        });
    }
}

function isMyTurn() {
    if (allPlrData && allPlrData[plrName]) {
        myTurn = allPlrData[plrName].chance;
        return myTurn;
    }
}

function switchTurn() {
    strikerShoot = false;
    database.ref("Playing/" + plrName).update({
        shooting: false
    });
}
