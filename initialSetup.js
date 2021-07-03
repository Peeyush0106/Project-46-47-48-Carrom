var plrName, plrNameAlreadyTaken, nameText, pwdText, playersEntered, playerCount, playCliked, cancelUploads, playerData, passwordStatus, login, loginAndPlay, loggedIn, gameStarted, waitingTxt, nameChecked, checkedAnEnterStatement, notification, notificationTime, notifyTimeStarted, saluteMsg, periodOfDay, addedMeInGame, shownDisableMsg, shownReadyMessage, waitingForPlrs, cancelCommands;

function preload() {
    whiteImg = loadImage("images/whitepiece.png");
    blackImg = loadImage("images/blackpiece.png");
    queenImg = loadImage("images/queenpiece.png");
    strikerImg = loadImage("images/striker.png");
}

function setup() {
    canvas = createCanvas(600, 750);
    // Database setup
    database = firebase.database();
    strikerReady = true;
    points = "not-initialized";
    gameState = 0;
    playerCount = 0;
    loggedIn = false;
    gameStarted = false;
    checkedAnEnterStatement = false;
    addedMeInGame = false;
    cancelUploads = false;
    shownDisableMsg = false;
    shownReadyMessage = false;
    waitingForPlrs = false;
    cancelCommands = false;
    // Game state legend - 0 = Home screen || 1 = Playing || 2 = Player 1 won || 3 = Player2 won
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
    var aboutTxt = createElement("h2").html("About").position(35, 100).hide();
    var aboutInfo = createElement("p").attribute("class", "info").html("<i> This is a very popular game named carrom. <br> It is mainly about aiming on a point and acting according to it. <br> The aim and target of the person should be determined. <br> This game helps people be determined on their aims. <br> This game sends awareness amongst people <br> and tells an important story of </i> <strong> UNAWARENESS </strong> <i> <br> of their own motive. <br> <br> This game will be updated regularly to make sure that <br> there are no issues that the users are not facing. </i>").position(35, 150).hide();
    var doc_link = createElement("h2").html(" <a href='FAQs & About.html'> View Game Detail Document </a>").position(50, 470).hide();
    var doc_link2 = createElement("h2").html(" <a href='Game Updates.html'> View Game Updates </a>").position(50, 520).hide();
    queenTxt = createElement("h3").position(40, 95).html("Come on, you just need a cover for the queen to be safe!!!").style("background-color", "green").hide();
    notification = createElement("h3").position(10, 65).hide();
    startButtons = [
        (createButton("About / How to play / Learnings").attribute("class", "button").position(150, 200).style("background-color", "red")).mousePressed(() => {
            startButtons[0].hide();
            startButtons[1].hide();
            startButtons[2].show();
            aboutTxt.show();
            aboutInfo.show();
            doc_link.show();
            doc_link2.show();
            inputName.hide();
            nameText.hide();
            continueBtn.hide();
        }),
        (createButton("Play").attribute("class", "button").position(150, 335).style("background-color", "blue").attribute("id", "play-btn").mousePressed(() => {
            playClicked = true;
            playerCount += 1;
            updatePlrCount();
        })).hide(),
        (createButton("<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Back_Arrow.svg/1200px-Back_Arrow.svg.png' draggable=false width='50' height='50'/>").attribute("class", "button").style("width", "50px").style("height", "50px").style("background-color", rgb(255, 250, 220)).position(520, 690).mousePressed(() => {
            startButtons[0].show();
            startButtons[1].show();
            startButtons[2].hide();
            aboutTxt.hide();
            aboutInfo.hide();
            doc_link.hide();
            doc_link2.hide();
        }).hide()),
        (createButton("<img src='images/menu.png' draggable=false width='50' height='50'/>").attribute("class", "button").style("width", "50px").style("background-color", rgb(155, 210, 220)).style("height", "50px").position(545, 710).mousePressed(() => {
            showOptions.showButtons();
        }).hide()),
        (createButton("Give up").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 640).mousePressed(() => {
            resetGame(aboutTxt, aboutInfo, doc_link, doc_link2);
        }).hide()),
        (createButton("New Game").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 580).mousePressed(() => {
            resetGame(aboutTxt, aboutInfo, doc_link, doc_link2);
        }).hide()),
        (createButton("Sign Out").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 520).mousePressed(() => {
            location.reload();
        }).hide()),
        (createButton("Cancel").attribute("class", "button").style("width", "140px").style("height", "50px").style("font-size", "20px").style("background-color", "red").position(465, 460).mousePressed(() => {
            showOptions.hideButtons();
        }).hide())
    ];
    inputName = createInput("").attribute("type", "text").attribute("onkeydown", "return alphaOnly(event);").size(80).attribute("maxlength", 10).position(325, 360).style("background-color", "yellow").attribute("onkeydown", "return alphaOnly(event);").size(80).attribute("maxlength", 20).attribute("id", "name-box");
    nameText = createElement("h2").position(100, 335).html("Your gaming name: ");
    document.getElementById("name-box").focus();
    continueBtn = createButton("Continue").style("color", "white").style("background-color", "green").position(417.5, 360).mousePressed(() => {
        continueGame();
    });
    cancelPlayRequest = createButton("Cancel Play Request").position(285, 82.5).hide().style("color", "white").style("background-color", "green").style("font-size", "20px").mousePressed(() => {
        location.reload();
    });;
}