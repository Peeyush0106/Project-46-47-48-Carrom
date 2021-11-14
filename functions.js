function startQueenTxtTimer() {
    queenTxtTimerStart = true;
}

function continueQueenTimerUntilOver() {
    if (queenTxtTimerStart && queenTxtTimer > 0) {
        queenTxtTimer -= 1;
    }
    if (queenTxtTimer <= 0) {
        queenInPocket = false;
        queenTxt.hide();
        queenTxtTimer = 3 * 30;
        queenTxtTimerStart = false;
    }
}

function destroyCoins() {
    for (let m = 0; m < coins.length; m++) {
        const spr = coins[m];
        if (spr.isTouching(pockets)) {
            if (spr.name !== "queen") {
                points += spr.points;
                spr.destroy();
                coins.remove(spr);
            }
            else {
                queenInPocket = true;
                notify("Come on, you just need a cover for the queen to be safe!!!", "black", "yellow");
                recentQueenCapturedTurnNo = turns;
                pointsAfterQueenCaptured = points;
            }
        }
    }
    if (striker.isTouching(pockets)) {
        points += striker.points;
    }
}

function bounceObjects() {
    striker.bounceOff(edges);
    striker.bounceOff(boardEdge);
    oppStriker.bounceOff(edges);
    oppStriker.bounceOff(boardEdge);
    oppStriker.bounce(coins);
    oppStriker.bounce(coins);
    if (!strikerReady) {
        striker.bounce(coins);
        striker.bounce(coins);
    }
    for (let m = 0; m < coins.length; m++) {
        const spr = coins[m];
        coins.bounceOff(spr);
    }
    coins.bounceOff(edges);
}

function resetGame() {
    for (const i in arguments) {
        const elt = arguments[i];
        elt.hide();
    }
    startButtons[0].show();
    startButtons[1].show();
    startButtons[2].hide();
    startButtons[3].hide();
    gameState = 0;
    striker.destroy();
    //striker2.destroy();
    coins.destroyEach();
    boardEdge.destroy();
    thickBand.destroy();
    thinBand.destroy();
    showOptions.hideButtons();
    points = "not-initialized";
    queenInPocket = false;
    queenTxtTimer = 3 * 30;
    queenTxt.html("Come on, you just need a cover for the queen to be safe!!!");
    turns = 0;
    turnStarts = 0;
    pointsAfterQueenCaptured = "not-captured";
    queenTxtTimerStart = false;
    recentQueenCapturedTurnNo = "not-captured";
    waitForQueenCover = false;
    gameStarted = false;
    loggedIn = true;
    shownDisableMsg = false;
    shownReadyMessage = false;
    shootBtn.hide();
    speedSlider.hide();
    cancelUploads = true;
    database.ref("Playing/" + plrName).remove();
    playerCount -= 1;
    updatePlrCount();
}

function drawShapesAndPatternsOnBoard() {
    push();
    noFill();
    push();
    translate(200, 200);
    rotate(-135);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(400, 200);
    rotate(-45);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(200, 400);
    rotate(135);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(400, 400);
    rotate(45);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    pop();
    // Down left
    line(213, 386, 52.5, 542.5);
    // Down right
    line(386, 386, 547.5, 542.5);
    // Up Left
    line(213, 215, 55, 57.5);
    // Up Right
    line(386, 215, 545, 60);

    push();
    fill("black");
    // Triangles as arrows
    triangle(175, 205, 187.5, 205, 180, 195);
    triangle(205, 187.5, 205, 175, 195, 180);

    triangle(400, 175, 400, 185, 410, 180);
    triangle(415, 200, 425, 200, 420, 190);

    triangle(205, 415, 202.5, 425, 195, 417.5);
    triangle(185, 395, 175, 395, 180, 405);

    triangle(412.5, 397.5, 425, 397.5, 420, 405);
    triangle(390, 422.5, 395, 412.5, 402.5, 420);

    // Up left
    triangle(52.5, 65, 65, 55, 42.5, 47.5);

    // Up right
    triangle(532.5, 60, 545, 70, 550, 52.5);

    // Down left
    triangle(67.5, 535, 57.5, 525, 47.5, 545);

    // Down right
    triangle(532.5, 535, 545, 525, 550, 545);

    push();
    stroke("black");
    noFill();
    for (let k = 0; k < ellipse_pos.x.length; k++) {
        var current_r;
        if (k <= 3) {
            current_r = 0;
        }
        else if (k === 4) {
            current_r = 1;
        }
        else if (k >= 5 && k <= 12) {
            current_r = 2;
            fill("yellow");
        }
        else if (k >= 13 || k <= 20) {
            current_r = 3;
            fill("red");
        }
        else if (k >= 21 || k <= 24) {
            current_r = 4;
        }
        ellipse(ellipse_pos.x[k], ellipse_pos.y[k], ellipse_pos.r[current_r]);
    }
    pop();
    pop();
}

// Allow only alphabets in the name
function alphaOnly(event) {
    var key;
    if (window.event) {
        key = window.event.key;
    }
    else if (e) {
        key = e.which;
    }
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key >= 95 && key <= 122) || key === 8 || key === 46 || (key >= 37 && key <= 40) || (key >= 35 && key <= 36));
}

function notify(_data, _color, _bgcolor, _timer) {
    unnotify();
    notification.html(_data);
    if (_data !== undefined && _data.slice(0, 4) !== "Good") {
        otherMsgShouldTakeOver = true;
    }
    if (_color) {
        notification.style("color", _color);
    }
    if (_bgcolor) {
        notification.style("background-color", _bgcolor);
    }
    notification.show();
    if (_timer) {
        notificationTime = 3 * 30;
        notifyTimeStarted = true;
        notifyCountDownContinue();
    }
}

function unnotify() {
    notification.html("");
    notification.hide();
    otherMsgShouldTakeOver = false;
}

function notifyCountDownContinue() {
    notificationTime -= 1;
}

function guestContinue() {
    console.log("guest");
    if (inputName.value() !== "") {
        inputName.hide();
        nameText.hide();
        continueGuestBtn.hide();
        plrName = inputName.value();
        loggedInWithName = true;
        startButtons[0].show();
        startButtons[1].show();
        loggedIn = true;
        cancelGoInGame.hide();
    }
    else {
        notify("Please enter a valid name to continue..", "red", "blue", true);
        alert("Please enter a valid name to continue..");
    }
}

function continueGame() {
    if (inputName && inputName.value() !== "") {
        startButtons[1].show();
        loggedIn = true;
    }
}

function startPlaying() {
    startButtons[0].hide();
    startButtons[1].hide();
    for (const i in arguments) {
        const elt = arguments[i];
        elt.hide();
    }
    gameState = 1;
    startButtons[3].show();
    gameStarted = true;
    playClicked = true;
}

function shoot() {
    strikerReady = false;
    striker.setSpeedAndDirection(selectedSpeed);
    turns += 1;
    checkedAnEnterStatement = true;
    strikerState = "not-moving";
    strikerShoot = true;
    updateMyShoot();
}

async function updateMyShoot() {
    database.ref("Playing/" + plrName).update({
        shooting: true
    });
}

async function updateStatus() {
    if (!cancelUploads && striker) {
        database.ref("Playing/" + plrName).update({
            score: points,
            angle: striker.rotation,
            name: plrName,
            speed: selectedSpeed,
            posX: striker.x
        });
        if (plrIndex >= 0 && plrIndex <= 1) {
            database.ref("Playing/" + plrName).update({
                index: plrIndex
            });
        }
    }
}

async function updatePlrCount() {
    database.ref("/").update({
        playerCount: playerCount
    });
}

async function getPlayerData() {
    await database.ref("/").get().then(function (data) {
        if (data.exists()) {
            var allData = data.val();
            allPlrData = allData.Playing;
            playerCount = allData.playerCount;
            reservedNames = allData.reservedNames;
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function setOpponentStrikerPostion() {        
    if (allPlrData && otherPlrName && allPlrData[otherPlrName]) {

        if(!otherPlrShooting && allPlrData[otherPlrName].shooting) {
            otherPlrPlayedShot = true;
            otherPlrShooting = allPlrData[otherPlrName].shooting;
        }
        
        if(otherPlrShooting == undefined || !otherPlrShooting) {
            opposAngle = allPlrData[otherPlrName].angle;
            otherPlrSpeed = allPlrData[otherPlrName].speed;
            otherPlrPosX = 600 - allPlrData[otherPlrName].posX;

            if (!allPlrData[otherPlrName].chance) {
                oppStriker.x = 300;
                oppStriker.y = 65;                
            } else {
                oppStriker.x = otherPlrPosX;
                oppStriker.y = 65;
                oppStriker.rotation = opposAngle + 180;                
            }
        } else {
            otherPlrShooting = allPlrData[otherPlrName].shooting;
        }
    }
}

function imitateOpponentsShot() {
    if (allPlrData && otherPlrName && allPlrData[otherPlrName]) {        
        if (otherPlrPlayedShot) {
            //console.log();
            oppStriker.setSpeedAndDirection(otherPlrSpeed);
            otherPlrPlayedShot = false;
        }
    }
}

// async function getOppsShoot() {
//     await database.ref("Playing/" + otherPlrName + "/shooting").get().then(function (data) {
//         if (data.exists()) {
//             if (otherPlrShooting) {
//                 oppStriker.setSpeedAndDirection(otherPlrSpeed);
//                 alert("shot");
//                 database.ref("Playing/" + otherPlrName).update({
//                     shooting: false
//                 });
//             }
//         }
//     }).catch(function (error) {
//         console.error(error);
//     });
// }

window.onbeforeunload = function () {
    cancelUploads = true;
    if (loggedIn) {
        database.ref("Playing/" + plrName).remove();
        if (gameStarted || waitingForPlr) {
            if (gameStarted) {
                giveMeUp = true;
            }
            database.ref("playerCount").on("value", function (data) {
                playerCount = data.val()
            });
            database.ref("/").update({
                playerCount: playerCount - 1
            });
            loseMe();
        }
        database.ref("reservedNames/" + myReservedIndex).remove();
    }
}

function disablePlayBtn() {
    document.getElementById("play-btn").disabled = true;
    startButtons[1].style("background-color", "grey");
}

function enablePlayBtn() {
    document.getElementById("play-btn").disabled = false;
    startButtons[1].style("background-color", "blue");
}

function getOtherPlrName() {
    for (var i in allPlrData) {
        if (allPlrData[i].name != plrName) {
            otherPlrName = allPlrData[i].name;
        }
    }
}

function checkConnection() {
    /* auth.onAuthStateChanged(()={
        **code**
    })
    We can even use the above code instead of the one below, but that doesn't fulfill ALL our conditions, so we'll use this one only ↓.
    */
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function (snap) {
        if (snap.val()) {
            if (actIfConnected && !auth.currentUser && !gameStarted) {
                console.log("connected");
                connected = true;
                actIfConnected = false;
                signupBtn.elt.hidden = false;
                loginBtn.elt.hidden = false;
                startButtons[0].elt.style.display = "block";
                // guestModeBtn.elt.hidden = false;
            }
            else if (auth.currentUser && showSignedInOpts) {
                database.ref("Users/" + auth.currentUser.uid).get().then((data) => {
                    plrName = data.val().name;
                })
                startButtons[0].show();
                startButtons[1].show();
                loggedIn = true;
                cancelGoInGame.hide();
            }
            database.ref("/").get().then(function (data) {
                if (data.exists() && auth.currentUser) {
                    var allData = data.val();
                    playerCount = allData.playerCount;
                }
            }).catch(function () {
                if (!networkAlertShown && auth.currentUser && !justSignedUp) {
                    alert("Your network is not enough for the game. Please check your network speed and come back again :(");
                    networkAlertShown = true;
                }
            });
        }
        else {
            showLoadingAnim();
            actIfConnected = true;
            if (!loggedIn) {
                signupBtn.elt.hidden = true;
                loginBtn.elt.hidden = true;
                startButtons[0].elt.style.display = "none";
                // guestModeBtn.elt.hidden = true;
            }
            if (waitingForPlr) {
                alert("We are being forced to loose your changes because your internet connection seems to be unstable, please check your network quality, and try again...");
                location.reload();
                waitingForPlr = false;
            }
        }
    });
}

function updateReservedNames() {
    var _reserved_names = reservedNames;
    database.ref("/").update({
        reservedNames: _reserved_names
    }).then(() => {
        // console.log(_reserved_names);
        for (var i in _reserved_names) {
            if (_reserved_names[i] === plrName) {
                myReservedIndex = i;
                //console.log(_reserved_names[i], myReservedIndex);
            }
        }
        //console.log("Success!");
    });
}

function loseMe() {
    if (confirm("Are you sure you want to give up?")) database.ref("Playing/" + otherPlrName).update({
        win: true
    });
}

function loseMe() {
    database.ref("Playing/" + plrName + "/win").get().then((data) => {
        if (data.exisits()) {
            // winning

        }
    });
}

function showWinMessage() {
    stopAllSprites();
    endGameBtn.show();
    cancelGameMovement = true;
    var maxCrownY = 160;
    var maxCloudX1 = 250;
    var maxCloudX2 = 280;
    push();
    // Message box
    {
        push();
        rectMode(CENTER);
        fill("black");
        rect(250, 200, 250, 130);
        pop();
    }
    // Show the encouragement text
    // Show player tags
    {
        textSize(15);
        fill("darkblue");
        push();
        stroke("white");
        strokeWeight(1.5);
        text("You", 130, 260);
        text("Opponent", 280, 260);
        pop();
    }
    // Define the values of formatting and show text
    {
        {
            fill("lightgreen");
            // To-do: remove below line on finalization
            croppedPlrname = plrName.slice(0, 3);
            if (plrName.length >= 3) {
                crownX = 160;
            }
            if (plrName.length > 3) {
                croppedPlrname = plrName.slice(0, 3) + "..";
                textSize(50);
            }
            else {
                textSize(70)
            }
            text(croppedPlrname, 125, 240);
        }
        {
            fill("magenta");
            // To-do: remove below line on finalization
            croppedOtherPlrName = otherPlrName.slice(0, 3);
            if (otherPlrName.length >= 3) {
                cloudX = 160;
            }
            if (otherPlrName.length > 3) {
                croppedOtherPlrName = otherPlrName.slice(0, 3) + "..";
                textSize(22.5);
            }
            else {
                textSize(42.5);
            }
            text(croppedOtherPlrName, 300, 240);
        }
    }
    // Movement of the crown
    {
        push();
        translate(crownX, crownY);
        if (crownY < maxCrownY) {
            crownY += 6;
            crownRotation += 0.39;
        }
        rotate(crownRotation);
        image(crown, 0, 0, (1329 / 10 / 2.2), (980 / 10 / 2.2));
        pop();
    }
    // Movement of the cloud
    {
        if (cloudX1 < maxCloudX1) {
            cloudX1 += 6;
        }
        if (cloudX2 > maxCloudX2) {
            cloudX2 -= 5;
        }
        image(cloud, cloudX1, cloudY, (5277 / 80), (3745 / 80));
        image(cloud, cloudX2, cloudY, (5277 / 80), (3745 / 80));
    }
    pop();
    endTxt.show();
}

function showLoseMessage() {
    stopAllSprites();
    endGameBtn.show();
    cancelGameMovement = true;
    var maxCrownY = 160;
    var maxCloudX1 = 125;
    var maxCloudX2 = 165;
    crownX = 320;
    endTxt.html("You lose! No problem, try again <br> to beat your opponents and by practising more").style("font-size", "11px").position(130, 130);
    push();
    // Message box
    {
        push();
        rectMode(CORNER);
        fill("black");
        rect(75, 200, 450, 330);
        pop();
    }
    // Show the encouragement text
    // Show player tags
    {
        textSize(15);
        fill("darkblue");
        push();
        stroke("white");
        strokeWeight(1.5);
        text("You", 130, 260);
        text("Opponent", 280, 260);
        pop();
    }
    // Define the values of formatting and show text
    {
        {
            plrName = "OOOO";
            fill("lightgreen");
            croppedPlrname = plrName.slice(0, 3);
            if (plrName.length > 3) {
                croppedPlrname = plrName.slice(0, 3) + "..";
                textSize(22.5);
            }
            else {
                textSize(42.5)
            }
            text(croppedPlrname, 135, 240);
        }
        {
            otherPlrName = "PPPP";
            fill("magenta");
            croppedOtherPlrName = otherPlrName.slice(0, 3);
            if (otherPlrName.length >= 3) {
                cloudX = 160;
            }
            if (otherPlrName.length > 3) {
                croppedOtherPlrName = otherPlrName.slice(0, 3) + "..";
                textSize(50);
            }
            else {
                textSize(70);
            }
            text(croppedOtherPlrName, 280, 240);
        }
    }
    // Movement of the crown
    {
        push();
        translate(crownX, crownY);
        if (crownY < maxCrownY) {
            crownY += 6;
            crownRotation += 0.41;
        }
        rotate(crownRotation);
        image(crown, 0, 0, (1329 / 10 / 2.2), (980 / 10 / 2.2));
        pop();
    }
    // Movement of the cloud
    {
        if (cloudX1 < maxCloudX1) {
            cloudX1 += 6;
        }
        if (cloudX2 > maxCloudX2) {
            cloudX2 -= 5;
        }
        image(cloud, cloudX1, cloudY, (5277 / 80), (3745 / 80));
        image(cloud, cloudX2, cloudY, (5277 / 80), (3745 / 80));
    }
    pop();
    endTxt.show();
    if (!showedOhhYouLostAlert) {
        alertSnd.play();
        alert("Ohhh..  you lost, you might have lost because the other other player would have scored more points, or you have given up. Don't worry, practice more and get better in aiming at the coins.");
        showedOhhYouLostAlert = true;
    }
}

function stopAllSprites() {
    for (var i in allSprites) {
        allSprites[i].velocityX = 0;
        allSprites[i].velocityY = 0;
    }
}