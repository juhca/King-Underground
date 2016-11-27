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
        document.getElementById('menu').style.opacity = 0.0;
        setTimeout(function() {
            document.getElementById('menu').style.display = 'none';
            document.getElementById('resume').style.display = 'inline';
            document.getElementById('start').style.display = 'none';

            document.getElementById('menu').style.transition = "opacity 0.5s";
        }, 2000);
        onload(); /* in main.js */
    }

    function pauseGame() {
        document.getElementById('menu').style.display = 'inline';
        setTimeout(function() {
            document.getElementById('menu').style.opacity = 1.0;
        }, 100);
    }

    function resumeGame() {
        document.getElementById('menu').style.opacity = 0.0;
        setTimeout(function() {
            document.getElementById('menu').style.display = 'none';
            runEngine();
        }, 500);
    }

    return {
        init: initMenu,
        pause: pauseGame
    }
}();
