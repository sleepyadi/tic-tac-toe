
const modals = (function() {
    let openModalBtn = document.querySelectorAll('[data-target-modal]');
    let closeModalBtn = document.querySelectorAll('[data-close-modal]');
    const overlay = document.querySelector('#overlay')

    openModalBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalID = btn.getAttribute('data-target-modal');
            const modal = document.querySelector(modalID);
            openModal(modal);
        });
    })
    closeModalBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            const modalID = btn.getAttribute('data-close-modal');
            const modal = document.querySelector(modalID);
            closeModal(modal);
        });
    });


    function openModal(modal) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    } 

    function refreshModals() {
        openModalBtn = document.querySelectorAll('[data-target-modal]');
        closeModalBtn = document.querySelectorAll('[data-close-modal]');

        openModalBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                const modalID = btn.getAttribute('data-target-modal');
                const modal = document.querySelector(modalID);
                openModal(modal);
            });
        })
        closeModalBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                const modalID = btn.getAttribute('data-close-modal');
                const modal = document.querySelector(modalID);
                closeModal(modal);
            });
        });

    }

    return {refreshModals, openModal, closeModal}
})();


const gameboard = (function() {
    let gboardDOM = [];
    let player = '';
    let opponent = '';
    let lastMarker = '';
    const main = document.querySelector('main');
    const resultModal = document.querySelector('#modal-game-over')

    const clearBoardBtn = document.createElement('button');
    clearBoardBtn.textContent = 'Clear Board';
    clearBoardBtn.classList.add('btn');
    clearBoardBtn.classList.add('btn-red');
    clearBoardBtn.classList.add('btn-clear');

    const container = document.createElement('div');
    container.classList.add('ttt-container');

    clearBoardBtn.addEventListener('click', clearBoard)
    container.addEventListener('click', handleClick);

    function init(player1, player2) {
        main.innerHTML = '';
        main.appendChild(clearBoardBtn);
        main.appendChild(container);
        player = player1;
        opponent = player2;
        lastMarker = player1.marker;
        _setupBoard();
        setupMarkerBoard();
    }

    function _setupBoard() {
        gboardDOM = [];
        container.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.classList.add('ttt-box');
            gboardDOM.push(div);
            container.appendChild(div);
        }
    }

    function clearBoard() {
        if (gboardDOM.length >= 1) {
            gboardDOM.forEach((gbox) => {gbox.textContent = ''});
        }
    }

    function setupMarkerBoard() {
        const div = document.createElement('div')
        div.classList.add('markers');

        const playerM = document.createElement('div');
        playerM.classList.add('player-marker');
        playerM.textContent = `${player.name}: ${player.marker}`

        const opponentM = document.createElement('div');
        opponentM.classList.add('opponent-marker');
        opponentM.textContent = `${opponent.name}: ${opponent.marker}`
        div.appendChild(playerM);
        div.appendChild(opponentM);
        main.appendChild(div);
    }

    function handleClick(event) {
        const isDiv = event.target.nodeName === 'DIV';
        const isTTTBox = event.target.getAttribute('class').includes('ttt-box');

        if (isDiv && isTTTBox) {
            let markerPlaced = placeMarker(event.target);
            if (markerPlaced) {
                emulateP2(opponent.type);
                checkWinner();
            }
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
                gboardDOM[pos].textContent = val[1];
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
            if (lastMarker === opponent.marker) {
                lastMarker = player.marker
            } else {
                lastMarker = opponent.marker;
            }
        } else if (type === 'easybot') {
            easyBot(2000);
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
                let winner = (arr[0] === player.marker) ? 1 : 2;
                showWinner(w);
            }
        }

        let availableSpots = gboardDOM.filter((item) => {return item.textContent === ''});
        if (availableSpots.length === 0) {
            showWinner(3);
        }
    }

    function showWinner(w) {
        let winner = (w === 1) ? player : opponent;
        let winMsg = `The winner is ${winner.name}!, with the marker ${winner.marker}`;
        let drawMsg = 'Its a draw!'
        
        const resultDiv = resultModal.querySelector('.game-over-msg');
        resultDiv.textContent = (w === 3) ? drawMsg : winMsg;
        modals.openModal(resultModal);

    }

    function disableInputs() {
        container.classList.add('not-allowed');
        gboardDOM.forEach((gbox) => {gbox.classList.add('no-pointer-events')});
    }

    function enableInputs() {
        container.classList.remove('not-allowed');
        gboardDOM.forEach((gbox) => {gbox.classList.remove('no-pointer-events')})
    }

    function random(n) {
        return Math.floor(Math.random() * n);
    }

    function easyBot(delay) {
        let availableSpots = [];

        for (let i = 0; i < 9; i++) {
            if (gboardDOM[i].textContent === '') {
                availableSpots.push(i);
            }
        }

        if (availableSpots.length >= 1) {
            let randomPos = availableSpots[random(availableSpots.length)];
            disableInputs();
            setTimeout(placeMarker, delay, [randomPos, opponent.marker]);
            setTimeout(enableInputs, delay);
            setTimeout(checkWinner, delay);
        }
        
    }

    return {init, placeMarker};

})();


const createPlayer = (name, marker, type='player') => {

    return {name, marker, type};
};


const game = (function() {

    const main = document.querySelector('main');
    const playerDetails = document.querySelector('#form-player-data');
    const resultModal = document.querySelector('#modal-game-over')
    const restartBtn = document.querySelector('.btn-restart-game');

    playerDetails.addEventListener('submit', gameStart);
    restartBtn.addEventListener('click', gameOver);

    function init() {
        main.innerHTML = '';
        const startGameBtn = document.createElement('button');
        startGameBtn.textContent = 'Start Game';
        startGameBtn.classList.add('btn');
        startGameBtn.classList.add('btn-start')
        startGameBtn.setAttribute('data-target-modal','#modal-player-data');
        main.appendChild(startGameBtn);
        modals.refreshModals();
    }

    function gameStart(e) {
        // prevent form submit
        e.preventDefault();
        const players = parseFormData(playerDetails);
        const p1 = players[0];
        const p2 = players[1];
        modals.closeModal(playerDetails.parentNode);
        gameboard.init(p1, p2);
    }

    function gameOver() {
        modals.closeModal(resultModal);
        init();
    }

    function parseFormData(form) {
        const p1name = form.elements['player1-name'].value;
        const p1marker = form.elements['marker'].value;
        const p2name = form.elements['player2-name'].value;
        const p2marker = (p1marker === 'X') ? 'O': 'X';
        const p2type = form.elements['difficulty'].value;
        const p1 = createPlayer(p1name, p1marker, 'player');
        const p2 = createPlayer(p2name, p2marker, p2type);
        clearForm(form);
        return [p1, p2];
    }

    function clearForm(form) {
        for (let elem in form.elements) {
            if (elem.includes('-name')) {
                form.elements[elem].value = '';
            }
        }
    }

    return {init}
})();

game.init();
