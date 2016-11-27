var MENU = function() {

    function initMenu() {
        document.getElementById('back1').onclick = function() {
            switchVisible('back');
        };
        document.getElementById('back2').onclick = function() {
            switchVisible('back');
        };
        document.getElementById('back3').onclick = function() {
            switchVisible('back');
        };
        document.getElementById('back4').onclick = function() {
            switchVisible('back');
        };

        document.getElementById('start').onclick = function() {
            startGame('menu');
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

        document.getElementById('start1').onclick = function() {
            startGame('dead-screen');
        };

        document.getElementById('start2').onclick = function() {
            startGame('survived-screen');
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
            document.getElementById('dead-screen').style.display = 'none';
            document.getElementById('survived-screen').style.display = 'none';
        }
    }

    function startGame(fromScreen) {
        document.getElementById(fromScreen).style.opacity = 0.0;
        setTimeout(function() {
            document.getElementById('menu').style.opacity = 0.0;
            document.getElementById(fromScreen).style.display = 'none';
            document.getElementById('resume').style.display = 'inline';
            document.getElementById('start').style.display = 'none';

            document.getElementById('menu').style.transition = "opacity 0.5s";
            document.getElementById('dead-screen').style.transition = 'opacity 3.0s'
            document.getElementById('survived-screen').style.transition = 'opacity 3.0s'
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

    function onDead() {
        document.getElementById('menu').style.opacity = 1.0;
        document.getElementById('resume').style.display = 'none';
        document.getElementById('start').style.display = 'inline';

        document.getElementById('dead-screen').style.display = 'inline';
        setTimeout(function() {
            document.getElementById('dead-screen').style.opacity = 1.0;
            document.getElementById('dead-screen').style.transition = 'opacity 1.0s';
        }, 100);
    }

    function onSurvived() {
        document.getElementById('menu').style.opacity = 1.0;
        document.getElementById('resume').style.display = 'none';
        document.getElementById('start').style.display = 'inline';

        document.getElementById('survived-screen').style.display = 'inline';
        setTimeout(function() {
            document.getElementById('survived-screen').style.opacity = 1.0;
            document.getElementById('survived-screen').style.transition = 'opacity 1.0s';
        }, 100);
    }

    return {
        init: initMenu,
        pause: pauseGame,
        died: onDead,
        survived: onSurvived
    }
}();
