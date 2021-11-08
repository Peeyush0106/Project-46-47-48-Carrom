var mouse_pos = document.getElementById("mouse-pos");
var coinDiameter = 25;

var plrName, plrNameAlreadyTaken, nameText, pwdText, playersEntered, playerCount, playCliked, cancelUploads, playerData, login, loginAndPlay, loggedIn, gameStarted, waitingTxt, nameChecked, doNotShowSignedInOpts, checkedAnEnterStatement, notification, notificationTime, notifyTimeStarted, saluteMsg, periodOfDay, addedMeInGame, shownDisableMsg, shownReadyMessage, waitingForPlr, cancelCommands, firstTurnDecisionDone, IamFirst, loggedInWithName, pocket_width_and_height, pockets, thickStripWidth, coins_pos, canvas, boardEdge, selectedSpeed, thinStripWidth, coins, striker, striker2, strikerMove, ellipse_pos, queen, music, edges, strip_pos, stopped_coins, thickBand, thinBand, whiteImg, blackImg, queenImg, strikerImg, strikerReady, pocket_pos, gameState, showOptions, points, queenInPocket, plrNames, strikerStateChecked, queenTxtTimer, queenTxt, turns, extraCoin, turnStarts, plrAngles, otherPlrIndex, opposAngle, pointsAfterQueenCaptured, strikerState, queenTxtTimerStart, recentQueenCapturedTurnNo, waitForQueenCover, shootBtn, speedSlider, playerCount, plrIndex, otherPlrName, oppStriker, playClicked, loggedInPlrs, strikerShoot, otherPlrShooting, otherPlrSpeed, giveMeUp, otherMsgShouldTakeOver, auth, showingDetails, isPreviousLogin, connected, actIfConnected, signupBtn, loginBtn, guestModeBtn, inputName2, continueSignupBtn, inputEmail, inputPwd, prev_data, continueLoginBtn, inputName, nameText, continueGuestBtn, cancelGoInGame, inGamingMode, nameOverlapped, reservedNames, myReservedIndex, leftArrowPressed, rightArrowPressed, crown, cloud, showChancePopup, showedOhhYouLostAlert, endTxt, otherPlrExists, alertForOtherPlrNotLiveShown, popupTimer, networkAlertShown, justSignedUp;

var myTurn;

function preload() {
    // images
    whiteImg = loadImage("images/whitepiece.png");
    blackImg = loadImage("images/blackpiece.png");
    queenImg = loadImage("images/queenpiece.png");
    strikerImg = loadImage("images/striker.png");
    crown = loadImage("images/crown.webp");
    cloud = loadImage("images/cloud.jpg");

    // sounds
    alertSnd = loadSound("sounds/alert.wav");
}

// Initial setup
{
    function setup() {
        canvas = createCanvas(600, 750);
        // Database setup
        database = firebase.database();
        auth = firebase.auth();
        strikerReady = true;
        points = "not-initialized";
        gameState = 0;
        // Game state legend - 0 = Home screen || 1 = Playing || 2 = Player 1 won || 3 = Player 2 won
        playerCount = 0;
        loggedIn = false;
        gameStarted = false;
        checkedAnEnterStatement = false;
        addedMeInGame = false;
        cancelUploads = false;
        shownDisableMsg = false;
        shownReadyMessage = false;
        waitingForPlr = false;
        cancelCommands = false;
        firstTurnDecisionDone = false;
        IamFirst = false;
        loggedInWithName = false;
        otherMsgShouldTakeOver = false;
        actIfConnected = false;
        inGamingMode = false;
        reservedNames = [];
        nameOverlapped = false;
        showedOhhYouLostAlert = false;
        justSignedUp = false;
        alertForOtherPlrNotLiveShown = false;
        popupTimer = 3;
        showChancePopup = false;
        networkAlertShown = false;
        showSignedInOpts = true;
        myReservedIndex = "no-index";
        showOptions = {
            currentOpt: 0,
            showButtons: function () {
                showOptions.currentOpt = 1;
            },
            goNeutral: function () {
                showOptions.currentOpt = 0;
            },
            hideButtons: function () {
                showOptions.currentOpt = -1;
            }
        };
        // Show options legend - 0 = neutral || 1 = Show || -1 = Hide

        // Game Ending Elements
        endTxt = createElement("h5").position(130, 120).style("color", "red").html("You win!!! Superb..").hide();
        endGameBtn = createButton("End Game").position(200, 250).addClass("small-btn").style("background-color", "red").style("color", "white").style("font-size", "10px").mousePressed(function () {
            location.reload();
        }).hide();
        // ending animation definitions
        {
            // crown
            {
                crownX = 130;
                crownY = 50;
                crownRotation = 0;
            }
            // cloud
            {
                cloudX1 = 50;
                cloudX2 = 450;
                cloudY = 180;
            }
        }

        var aboutTxt = createElement("h2").attribute("class", "text").attribute("class", "text").html("About").position(35, 100).hide();
        var aboutInfo = createP("<i> This is a very popular game named carrom. <br> It is mainly about aiming on a point and acting according to it. <br> The aim and target of the person should be determined. <br> This game helps people be determined on their aims. <br> This game sends awareness amongst people <br> and tells an important story of </i> <strong> UNAWARENESS </strong> <i> <br> of their own motive. <br> <br> This game will be updated regularly to make sure that <br> there are no issues that the users are not facing. </i>").attribute("class", "info").position(35, 150).hide();
        doc_link = createElement("h2").attribute("class", "link").position(50, 470).hide();
        doc_link2 = createElement("h2").attribute("class", "link").position(50, 520).hide();
        doc_link3 = createElement("h2").attribute("class", "link").position(50, 570).hide();
        doc_link.elt.innerHTML = `<a href="FAQs & About.html" target="_blank"> View Game Detail Document </a>`;
        doc_link2.elt.innerHTML = `<a href="Game updates.html" target="_blank"> View Game Updates History </a>`;
        doc_link3.elt.innerHTML = `<a href="How to play.html" target="_blank"> How to Play </a>`;
        queenTxt = createElement("h3").attribute("class", "text").attribute("class", "text").position(40, 95).html("Come on, you just need a cover for the queen to be safe!!!").style("background-color", "green").hide();
        notification = createElement("h3").position(10, 65).hide().addClass("notifier");
        startButtons = [
            (createButton("About / How to play / Learnings").attribute("class", "button").position(150, 200).style("background-color", "red")).mousePressed(() => {
                startButtons[0].hide();
                startButtons[1].hide();
                startButtons[2].show();
                aboutTxt.show();
                aboutInfo.show();
                doc_link.show();
                doc_link2.show();
                doc_link3.show();
                signupBtn.hide();
                loginBtn.hide();
                // guestModeBtn.hide();
                document.getElementById("guestOpts").hidden = true;
                showingDetails = true;
            }),
            (createButton("Play").attribute("class", "button").position(150, 335).style("background-color", "blue").attribute("id", "play-btn").mousePressed(() => {
                playClicked = true;
                playerCount += 1;
                updatePlrCount();
                plrIndex = playerCount - 1;
                continueGame();
            })).hide(),
            (createButton("<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Back_Arrow.svg/1200px-Back_Arrow.svg.png' draggable=false width='50' height='50'/>").attribute("class", "big-btn").style("width", "50px").style("height", "50px").style("background-color", rgb(255, 250, 220)).position(520, 690).mousePressed(() => {
                aboutTxt.hide();
                aboutInfo.hide();
                doc_link.hide();
                doc_link2.hide();
                doc_link3.hide();
                showingDetails = false;
                if (!loggedIn) {
                    startButtons[0].show();
                    startButtons[1].hide();
                    startButtons[2].hide();
                    signupBtn.show();
                    loginBtn.show();
                    // guestModeBtn.show();
                }
                else {
                    startButtons[0].show();
                    startButtons[1].show();
                    startButtons[2].hide();
                    notify(saluteMsg);
                }
            }).hide()),
            (createButton("<img src='images/menu.png' draggable=false width='50' height='50'/>").attribute("class", "button").style("width", "50px").style("background-color", rgb(155, 210, 220)).style("height", "50px").position(545, 710).mousePressed(() => {
                showOptions.showButtons();
            }).hide()),
            (createButton("Give up").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 640).mousePressed(() => {
                resetGame(aboutTxt, aboutInfo, doc_link, doc_link2, doc_link3);
                loseMe();
            }).hide()),
            (createButton("Home").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 580).mousePressed(() => {
                loseMe();
                resetGame(aboutTxt, aboutInfo, doc_link, doc_link2, doc_link3);
            }).hide()),
            (createButton("Sign Out").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 520).mousePressed(() => {
                loseMe();
                auth.signOut();
                location.reload();
            }).hide()),
            (createButton("Cancel").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 460).mousePressed(() => {
                showOptions.hideButtons();
            }).hide())
        ];
        signupBtn = createButton("Sign Up").attribute("class", "button").position(150, 310).style("background-color", "green").style("color", "white").style("width", "146.5px").style("font-size", "30px").mousePressed(() => {
            startButtons[0].hide();
            signupBtn.hide();
            loginBtn.hide();
            // guestModeBtn.hide();
            createGoInAccountOpts(true, false);
        });
        loginBtn = createButton("Log In").attribute("class", "button").position(303.5, 310).style("background-color", "blue").style("color", "white").style("width", "146.5px").style
            ("font-size", "30px").mousePressed(() => {
                startButtons[0].hide();
                signupBtn.hide();
                loginBtn.hide();
                // guestModeBtn.hide();
                createGoInAccountOpts(false, true);
            });
        // guestModeBtn = createButton("Play as Guest").attribute("class", "button").position(150, 415).style("background-color", "green").style("color", "white").mousePressed(() => {
        //     guestMode = true;
        //     document.getElementById("guestOpts").hidden = false;
        //     createGuestOptions();
        //     guestModeBtn.hide();
        //     signupBtn.hide();
        //     loginBtn.hide();
        //     startButtons[0].hide();
        // });

        cancelPlayRequest = createButton("Cancel Play Request").attribute("class", "small-btn").position(285, 82.5).hide().style("color", "white").style("background-color", "green").style("font-size", "20px").mousePressed(() => {
            cancelPlayRequest.hide();
            waitingForPlr = false;
            playerCount -= 1;
            updatePlrCount();
            unnotify();
            playClicked = false;
            document.getElementById("play-btn").disabled = false;
            startButtons[1].style("background-color", "blue");
        });

        cancelGoInGame = createButton("Cancel").attribute("class", "button").style("width", "200px").style("height", "50px").style("color", "white").style("background-color", "red").position(302.5, 500).mousePressed(() => {
            showElements(startButtons[0], signupBtn, loginBtn/*, guestModeBtn*/);
            hideElements(inputName2, continueSignupBtn, inputEmail, inputPwd, continueLoginBtn, inputName, nameText, continueGuestBtn, cancelGoInGame);
        }).hide();

        signoutBtn = createButton("Log Out").attribute("class", "button").style("width", "200px").style("height", "50px").style("color", "white").style("background-color", "red").position(202.5, 600).mousePressed(() => {
            if (auth.currentUser) {
                auth.signOut().then(() => {
                    location.reload();
                });
            }
            else {
                location.reload();
            }
        }).hide();
    }

    function showElements() {
        for (var i in arguments) {
            if (arguments[i] !== undefined) {
                arguments[i].show();
            }
        }
    }

    function hideElements() {
        for (var i in arguments) {
            if (arguments[i] !== undefined) {
                arguments[i].hide();
            }
        }
    }

    function createGoInAccountOpts(signup, login) {
        cancelGoInGame.show();
        if (signup) {
            inputName2 = createInput("").attribute("type", "text").size(80).position(170, 200).style("background-color", "yellow").attribute("onkeydown", "return alphaOnly(event);").attribute("maxlength", 10).attribute("id", "name-box-2").attribute("placeholder", "Name").attribute("class", "big-input");

            continueSignupBtn = createButton("Continue").attribute("class", "button").style("color", "white").style("background-color", "green").style("width", "200px").style("height", "50px").position(90, 500).mousePressed(() => {
                if (inputName2.value() !== "" &&
                    inputEmail.value() !== "" &&
                    inputPwd.value() !== "") {
                    justSignedUp = true;
                    auth.createUserWithEmailAndPassword(inputEmail.value(), inputPwd.value()).then(() => {
                        database.ref("Users/" + auth.currentUser.uid).update({
                            email: inputEmail.value(),
                            name: inputName2.value(),
                            id: auth.currentUser.uid
                        }).then(() => {
                            location.reload();
                        });
                    }).catch(err => {
                        alert(err.message);
                    });
                    showLoadingAnim();
                }
                else {
                    notify("Please fill up all the text areas to continue..", "red", "blue", true);
                    alert("Please fill up all the text areas to continue..");
                }
            });
            document.getElementById("name-box-2").focus();
        }
        inputEmail = createInput("", "text").attribute("type", "text").position(225, 300).style("background-color", "yellow").size(140).attribute("id", "eml-box").attribute("placeholder", "Email").attribute("class", "big-input");
        inputPwd = createInput("").attribute("type", "password").position(225, 400).style("background-color", "yellow").size(140).attribute("id", "pwd-box").attribute("placeholder", "Password").attribute("class", "big-input");

        if (login) {
            continueLoginBtn = createButton("Continue").attribute("class", "button").style("color", "white").style("background-color", "green").style("width", "200px").style("height", "50px").position(90, 500).mousePressed(() => {
                if (inputEmail.value() !== "" &&
                    inputPwd.value() !== "") {
                    auth.signInWithEmailAndPassword(inputEmail.value(), inputPwd.value()).then(() => {
                        database.ref("Users/" + auth.currentUser.uid).get().then((data) => {
                            var allUserData = data.val();
                            plrName = allUserData.name;
                        }).then(() => {
                            location.reload();
                        })
                    }).catch(err => {
                        alert(err.message);
                    });;
                    showSignedInOpts = false;
                }
                else {
                    notify("Please fill up all the details to continue..", "red", "blue", true);
                    alert("Please fill up all the details to continue..");
                }
            });
            document.getElementById("eml-box").focus();
        }
    }

    function createGuestOptions() {
        cancelGoInGame.show();

        inputName = createInput("").parent("#guestOpts").attribute("type", "text").size(80).position(170, 200).style("background-color", "yellow").attribute("onkeydown", "return alphaOnly(event);").attribute("maxlength", 10).attribute("id", "name-box").attribute("placeholder", "Temp Name").attribute("class", "big-input");

        nameText = createElement("h2").attribute("class", "text").position(100, 240).html("Your Temporary gaming name").parent("#guestOpts");

        inputName.elt.focus();

        continueGuestBtn = createButton("Continue").attribute("class", "button").style("color", "white").style("background-color", "green").style("width", "200px").style("height", "50px").position(90, 500).mousePressed(() => {
            var reserved_names, reserved_name;
            database.ref("reservedNames").get().then(function (data) {
                if (data.exists()) {
                    reserved_names = data.val();
                    var existingNameFound = false;
                    for (var i in reserved_names) {
                        reserved_name = reserved_names[i];
                        console.log(reserved_name);
                        if (reserved_name === inputName.value()) {
                            existingNameFound = true;
                            break;
                        }
                    }

                    if (existingNameFound) {
                        // alert("That name is already chosen by another player, please choose another one. You can rather Sign Up to save your scores and achievements.");
                        alert("That name is already chosen by another player, please choose another one.");
                    }
                    else {
                        plrName = inputName.value();
                        reservedNames.push(plrName);
                        console.log(reservedNames);
                        updateReservedNames();
                        guestContinue();
                        console.log("data exists");
                    }
                }
                else {
                    plrName = inputName.value();
                    reservedNames = [];
                    reservedNames.push(plrName);
                    console.log(reservedNames);
                    updateReservedNames();
                    guestContinue();
                    console.log("data does not exist");
                }
            }).catch(function (error) {
                console.error(error);
            });
        }).parent("#guestOpts");
    }
}

// Game Setup
{
    function setStriker() {
        turnStarts += 1;
        // if (striker2 !== undefined) striker.x = striker2.x;
        // else striker.x = 300;
        striker.x = 300;
        striker.y = 530;
        strikerReady = false;
        striker.setSpeedAndDirection(0)
        striker.pointTo(canvas.width / 2, canvas.height / 2);
    }

    function startGame() {
        console.log("Started game", "playercount: ", playerCount);
        // Pockets
        pocket_width_and_height = 56;
        points = 0;
        // Multiplying by 30 for getting seconds. The 
        queenTxtTimer = 3 * 30;
        turns = 0;
        recentQueenCapturedTurnNo = "not-captured";
        pointsAfterQueenCaptured = "not-captured";
        queenInPocket = false;
        waitForQueenCover = false;
        turnStarts = 0;
        queenTxtTimerStart = false;
        strikerShoot = false;
        giveMeUp = false;
        inGamingMode = true;
        strikerState = "not-moving";
        pockets = createGroup();
        pocket_pos = { x: [0, 600, 600, 0], y: [0, 0, 600, 600] };
        for (let i = 0; i < pocket_pos.x.length; i++) {
            const spr = createSprite(pocket_pos.x[i], pocket_pos.y[i], pocket_width_and_height, pocket_width_and_height);
            spr.setCollider("circle");
            pockets.add(spr);
            spr.visible = false;
        }

        // Strips
        thickStripWidth = 9;
        thinStripWidth = 4;

        strip_pos = {
            x: [525, 540, 75, 60, 300, 300, 300, 300],
            y: [300, 300, 300, 300, 75, 60, 525, 540],
            width: [thickStripWidth, thinStripWidth, thickStripWidth, thinStripWidth, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100],
            height: [thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thickStripWidth, thinStripWidth, thickStripWidth, thinStripWidth]
        };
        coins = createGroup();

        //  Striker
        striker = createSprite();
        setStriker();
        striker.rotation = -90;
        striker.rotateToDirection = true;
        striker.friction = 0.018;
        striker.points = -10;
        striker.restitution = 0.25;
        striker.setCollider("circle");
        striker.addImage(strikerImg);

        oppStriker = createSprite(300, 65);
        oppStriker.rotation = 90;
        oppStriker.rotateToDirection = true;
        oppStriker.friction = 0.018;
        oppStriker.points = -10;
        oppStriker.tint = "lightred";
        oppStriker.restitution = 0.25;
        oppStriker.setCollider("circle");
        oppStriker.addImage(strikerImg);
        // Coins

        var queenX = 300;
        var queenY = 300;

        coins_pos = { black: { x: [], y: [] }, white: { x: [], y: [] } };
        //Black coins - first layer
        for (var angle = 75; angle < 360; angle += 120) {
            var coinX = queenX + cos(angle) * coinDiameter;
            var coinY = queenY + sin(angle) * coinDiameter;
            coins_pos.black.x.push(coinX);
            coins_pos.black.y.push(coinY);
        }

        //Black coins second layer
        for (var angle = 45; angle < 360; angle += 60) {

            var xOffset = cos(angle) * (2 * coinDiameter * cos(30));
            var yOffset = sin(angle) * (2 * coinDiameter * cos(30));

            var coinX = queenX + xOffset;
            var coinY = queenY + yOffset;
            coins_pos.black.x.push(coinX);
            coins_pos.black.y.push(coinY);
        }

        //White coins - first layer
        for (var angle = 15; angle < 360; angle += 120) {
            var coinX = queenX + cos(angle) * coinDiameter;
            var coinY = queenY + sin(angle) * coinDiameter;
            coins_pos.white.x.push(coinX);
            coins_pos.white.y.push(coinY);
        }

        //White coins second layer
        for (var angle = 15; angle < 360; angle += 60) {

            var xOffset = cos(angle) * (2 * coinDiameter);
            var yOffset = sin(angle) * (2 * coinDiameter);

            var coinX = queenX + xOffset;
            var coinY = queenY + yOffset;
            coins_pos.white.x.push(coinX);
            coins_pos.white.y.push(coinY);
        }

        for (let l = 0; l < coins_pos.white.x.length; l++) {
            var spr = createSprite(coins_pos.white.x[l], coins_pos.white.y[l], coinDiameter, coinDiameter);
            blackImg.width = spr.width;
            spr.addImage(blackImg);
            coins.add(spr);
            spr.setCollider("circle", 0, 0, 12);
            spr.restitution = 0.25;
            spr.friction = 0.03;
            spr.points = 10;
        }
        for (let l = 0; l < coins_pos.black.x.length; l++) {
            var spr = createSprite(coins_pos.black.x[l], coins_pos.black.y[l], coinDiameter, coinDiameter);
            whiteImg.width = spr.width;
            spr.addImage(whiteImg);
            coins.add(spr);
            spr.setCollider("circle", 0, 0, 12);
            spr.friction = 0.03;
            spr.restitution = 0.25;
            spr.points = 20;
        }

        queen = createSprite(queenX, queenY, coinDiameter, coinDiameter);
        queen.addImage(queenImg);
        coins.add(queen);
        queen.points = 50;
        queen.name = "queen";
        queen.setCollider("circle", 0, 0, 12);
        queen.friction = 0.03;
        queen.restitution = 0.25;

        ellipse_pos = {
            x: [0, 0, 600, 600,
                300,
                500, 532.5, 500, 532.5, 67.5, 100, 100, 67.5, 500, 532.5, 500, 532.5, 67.5, 100, 100, 67.5,
                520, 520, 82, 82.5],
            y: [0, 600, 600, 0,
                300,
                68, 105, 532, 495, 495, 530, 68, 100, 68, 105, 532, 495, 495, 530, 68, 100,
                82.5, 515, 515, 82.5],
            r: [90, 130, 35, 15],
        };
        edges = createEdgeSprites();
        boardEdge = createSprite(300, 675, 600, 150);
        boardEdge.shapeColor = rgb(155, 210, 220);
        boardEdge.depth = -2;

        // thickBand at the bottom
        thickBand = createSprite(300, 640, 438, 10);
        thickBand.shapeColor = "black";
        thickBand.depth = -1;
        // thinBand at the bottom
        thinBand = createSprite(300, 660, 438, 5);
        thinBand.shapeColor = "black";
        thinBand.depth = -1;

        shootBtn = createButton("Shoot").attribute("class", "button").style("width", "80px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(270, 700).mousePressed(() => {
            if (strikerReady && !mouseDown()) {
                shoot();
            }
        });
        speedSlider = createSlider(0, 55, 20).position(127.5, 712.5).changed(() => {
            selectedSpeed = parseInt(speedSlider.elt.value);
        });
        selectedSpeed = speedSlider.elt.value;
    }
}