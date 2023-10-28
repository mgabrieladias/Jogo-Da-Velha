$(document).ready(function() {
    const $currentPlayer = $(".currentPlayer");
    const $gameButtons = $(".game button");
    const $newGameButton = $("#newGameButton");

    let selected = [];
    let player = "X";
    let computer = "O";
    let isComputerTurn = true;
    let isGameOver = false;

    // Definindo os elementos de áudio
    const moveSound = $("#moveSound")[0];
    const winSound = $("#winSound")[0];
    const drawSound = $("#drawSound")[0];

    const positions = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];

    function init() {
        selected = [];
        $currentPlayer.html(`JOGADOR DA VEZ: ${player}`);
        $gameButtons.each(function() {
            $(this).html("");
            $(this).on("click", newMove);
        });
        $newGameButton.prop("disabled", true);
        isGameOver = false;
        if (isComputerTurn) {
            setTimeout(computerMove, 1000);
        }
    }

    init();

    function newMove() {
        if (!isComputerTurn && !isGameOver) {
            const index = $(this).data("i");
            if (!selected[index]) {
                $(this).html(player);
                $(this).off("click", newMove);
                selected[index] = player;
                check();
                isComputerTurn = true;
                $currentPlayer.html(`JOGADOR DA VEZ: ${computer}`);
                moveSound.play(); // Reproduz o som de movimento
                if (!isGameOver) {
                    setTimeout(computerMove, 1000);
                }
            }
        }
    }

    function computerMove() {
        if (isComputerTurn && !isGameOver) {
            const emptyCells = $gameButtons.filter(function() {
                return !$(this).html();
            });
            if (emptyCells.length > 0) {
                const index = Math.floor(Math.random() * emptyCells.length);
                const cell = emptyCells.eq(index);
                const indexData = cell.data("i");
                cell.html(computer);
                cell.off("click", newMove);
                selected[indexData] = computer;
                check();
                isComputerTurn = false;
                $currentPlayer.html(`JOGADOR DA VEZ: ${player}`);
                moveSound.play(); // Reproduz o som de movimento
            }
        }
    }

    function check() {
        let currentPlayerSymbol = isComputerTurn ? computer : player;

        const items = selected
            .map(function(item, i) {
                return [item, i];
            })
            .filter(function(item) {
                return item[0] === currentPlayerSymbol;
            })
            .map(function(item) {
                return item[1];
            });

        for (pos of positions) {
            if (pos.every(function(item) {
                return items.includes(item);
            })) {
                winSound.play(); // Reproduz o som de vitória
                isGameOver = true;
                $newGameButton.prop("disabled", false);
                $gameButtons.off("click", newMove);
                setTimeout(function () {
                    if (confirm("O JOGADOR '" + currentPlayerSymbol + "' GANHOU!\nDeseja jogar novamente?")) {
                        window.location.reload(); // Recarrega a página
                    }
                }, 0);
                return;
            }
        }

        if (selected.filter(function(item) {
            return item;
        }).length === 9) {
            drawSound.play(); // Reproduz o som de empate
            isGameOver = true;
            $newGameButton.prop("disabled", false);
            $gameButtons.off("click", newMove);
            setTimeout(function () {
                if (confirm("RESULTADO: EMPATE!\nDeseja jogar novamente?")) {
                    window.location.reload(); // Recarrega a página
                }
            }, 0);
            return;
        }
    }

    $newGameButton.on("click", function() {
        init();
    });
});