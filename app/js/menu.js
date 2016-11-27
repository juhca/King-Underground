var MENU = function() {

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
        document.getElementById('resume').onclick = function() {
            resumeGame();
        };
    }

    function switchVisible(id) {
        if(id === 'instructions') {
            document.getElementById('menu').style.display = 'none';
            document.getElementById('story-screen').style.display = 'none';
            document.getElementById('instructions-screen').style.display = 'inline';
        } else if(id === 'story') {
            document.getElementById('menu').style.display = 'none';
            document.getElementById('story-screen').style.display = 'inline';
            document.getElementById('instructions-screen').style.display = 'none';
        } else if(id === 'back') {
            document.getElementById('menu').style.display = 'inline';
            document.getElementById('story-screen').style.display = 'none';
            document.getElementById('instructions-screen').style.display = 'none';
        }
    }

    function startGame() {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('resume').style.display = 'inline';
        document.getElementById('start').style.display = 'none';
        onload(); /* in main.js */
    }

    function pauseGame() {
        document.getElementById('renderCanvas').style.display = 'none';
        document.getElementById('menu').style.display = 'inline';
    }

    function resumeGame() {
        document.getElementById('renderCanvas').style.display = 'inline';
        document.getElementById('menu').style.display = 'none';
        runEngine();
    }

    return {
        init: initMenu,
        pause: pauseGame
    }
}();
