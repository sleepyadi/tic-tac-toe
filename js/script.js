const gameboard = (function() {
    let gboardDOM = [];
    let playerMarker = '';
    let opponentMarker = '';
    let lastMarker = '';
    const container = document.querySelector('.ttt-container');

    container.addEventListener('click', handleClick);

    function init(player1, player2) {
        playerMarker = player1.marker;
        opponentMarker = player2.marker;
        lastMarker = player1.marker;
        _setupBoard();
    }

    function _setupBoard() {
        gboardDOM = [];

        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.classList.add('ttt-box');
            gboardDOM.push(div);
            container.appendChild(div);
        }
    }

    function handleClick(event) {
        const isDiv = event.target.nodeName === 'DIV';
        const isTTTBox = event.target.getAttribute('class').includes('ttt-box');

        if (isDiv && isTTTBox) {
            placeMarker(event.target);
            // what if placeMarker doesnt place it if its occupied but emulatep2 does place thinking we placed??

        }
    }

    function placeMarker(val) {
        // expect either node object or an arr with pos and marker [pos, marker];
        const isNodeObject = ('querySelector' in val);
        const isArr = (val instanceof Array);

        if (isArr) {
            let pos = Number(val[0]);
            gboardDOM[pos].textContent = (gboardDOM[pos].textContent === '') ? val[1] : gboardDOM[pos].textContent;
            return;
        }

        if (isNodeObject) {
            val.textContent = (val.textContent === '') ? lastMarker : val.textContent;
            console.log(val.textContent)
            return;
        }


    }


    return {init, placeMarker};

})();

gameboard.init({marker: 'X'}, {marker:'O'})