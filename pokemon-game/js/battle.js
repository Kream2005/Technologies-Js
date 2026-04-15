export default class Battle {
    
    constructor(player, bot) {
        this.player = player;
        this.bot = bot;
        this.gameOver = false;
    }

    playTurn(playerMoveSelection) {
        if (this.gameOver) return;

        const playerMove = this.resolvePlayerMove(playerMoveSelection);
        const botMove = this.bot.getRandomMove();

        if (!playerMove) {
            console.log("Invalid move selection. Please choose a valid move.");
            return;
        }

        if (!botMove) {
            console.log(`${this.bot.name} has no available moves.`);
            this.gameOver = true;
            return;
        }

        console.log(`--- New Turn ---`);
        console.log(`${this.player.name} chose ${playerMove.name.toUpperCase()} (PP: ${playerMove.pp})`);
        console.log(`${this.bot.name} chose ${botMove.name.toUpperCase()} (PP: ${botMove.pp})`);

        let playerCanAttack = true;
        let botCanAttack = true;

        if (playerMove.pp < botMove.pp) {
            console.log(`!! ${this.bot.name}'s move has higher PP. ${this.player.name}'s attack is canceled!`);
            playerCanAttack = false;
        } else if (botMove.pp < playerMove.pp) {
            console.log(`!! ${this.player.name}'s move has higher PP. ${this.bot.name}'s attack is canceled!`);
            botCanAttack = false;
        }

        if (playerCanAttack){
            this.executeAttack(this.player, this.bot, playerMove, 'bot')
        }

        if (botCanAttack && !this.bot.isFainted()) {
            this.executeAttack(this.bot, this.player, botMove, 'player');
        }

        // check if someone Died 😢
        this.checkWinCondition();
    }

    resolvePlayerMove(playerMoveSelection) {
        if (typeof playerMoveSelection === 'number') {
            return this.player.moves[playerMoveSelection];
        }

        if (typeof playerMoveSelection === 'string') {
            const parsedIndex = Number.parseInt(playerMoveSelection, 10);
            if (Number.isInteger(parsedIndex)) {
                return this.player.moves[parsedIndex];
            }

            return this.player.moves.find((move) => move.name === playerMoveSelection);
        }

        return undefined;
    }

    executeAttack(attacker, defender, move, defenderRole){
        // we'll get a base to compare with the attacks accuracy
        const random_acc = Math.floor(Math.random() * 100) + 1;

        if (random_acc > move.accuracy) {
            console.log(`${attacker.name}'s ${move.name.toUpperCase()} missed!`);
            return;
        }

        defender.takeDamage(move.power);
        console.log(` ${attacker.name} hit ${defender.name} for ${move.power} damage!`);
        console.log(`${defender.name} HP: ${defender.currentHp}/${defender.maxHp}`);
    }

    checkWinCondition() {
        if (this.bot.isFainted()) {
            console.log(`YOU WIN! ${this.bot.name} fainted!`);
            this.gameOver = true;
        } else if (this.player.isFainted()) {
            console.log(`YOU LOSE! ${this.player.name} fainted!`);
            this.gameOver = true;
        }
    }
}
