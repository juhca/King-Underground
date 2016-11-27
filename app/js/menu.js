function initMenu() {
    document.getElementById('back1').onclick = function() {
        switchVisible('back');
    };
    document.getElementById('back2').onclick = function() {
        switchVisible('back');
    };

    document.getElementById('start').onclick = function() {
        startGame();
    };
    document.getElementById('instructions').onclick = function() {
        switchVisible('instructions');
    };
    document.getElementById('story').onclick = function() {
        switchVisible('story');
    };
}

function switchVisible(id) {
    if(id === 'instructions') {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('story-screen').style.display = 'none';
        document.getElementById('instructions-screen').style.display = 'inherit';
    }
    else if(id === 'story') {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('story-screen').style.display = 'inherit';
        document.getElementById('instructions-screen').style.display = 'none';
    }
    else if(id === 'back') {
        document.getElementById('menu').style.display = 'inherit';
        document.getElementById('story-screen').style.display = 'none';
        document.getElementById('instructions-screen').style.display = 'none';
    }
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    onload(); /* in main.js */
}