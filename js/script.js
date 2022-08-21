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
            let markerPlaced = placeMarker(event.target);
            if (markerPlaced) {
                emulateP2('player');
                checkWinner();
            }
            // what if placeMarker doesnt place it if its occupied but emulatep2 does place thinking we placed??
            // could make a BOT vs BOT as well if both p1 p2 are made via emulated option

        }
    }

    function placeMarker(val) {
        // expect either node object or an arr with pos and marker [pos, marker];
        const isNodeObject = ('querySelector' in val);
        const isArr = (val instanceof Array);

        if (isArr) {
            let pos = Number(val[0]);
            if (gboardDOM[pos].textContent === '') {
                gboardDOM[pos].textContent = lastMarker;
                return true;
            }
        }

        if (isNodeObject) {
            if (val.textContent === '') {
                val.textContent = lastMarker;
                return true;
            }
        }

        return false;

    }

    function emulateP2(type) {

        if (type === 'player') {
            if (lastMarker === opponentMarker) {
                lastMarker = playerMarker
            } else {
                lastMarker = opponentMarker;
            }
        }
    }

    function checkWinner() {
        let tempGboard = gboardDOM.map((item) => {return item.textContent});
        const combinations = [tempGboard.slice(0,3), tempGboard.slice(3,6), tempGboard.slice(6,9),
                             [tempGboard[0],tempGboard[4],tempGboard[8]],
                             [tempGboard[2],tempGboard[4],tempGboard[6]],
                             [tempGboard[0],tempGboard[3],tempGboard[6]],
                             [tempGboard[1],tempGboard[4],tempGboard[7]],
                             [tempGboard[2],tempGboard[5],tempGboard[8]]];

        for (let arr of combinations) {
            let w = arr.join('');
            if (w === "XXX" || w === 'OOO') {
                // returns winner as 1 and 2 for player  1 and 2 respectively
                let winner = (arr[0] === playerMarker) ? 1 : 2;
                console.log(winner);
                return winner;
            }
        }
    }

    return {init, placeMarker};

})();

gameboard.init({marker: 'X'}, {marker:'O'})