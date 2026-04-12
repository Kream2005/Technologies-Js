export default class Battle {
    
    constructor(player, bot, ui) {
        this.player = player;
        this.bot = bot;
        this.ui = ui;
        this.gameOver = false;
    }

    playTurn(playerMoveIndex) {
        if (this.gameOver) return;

        const playerMove = this.player.moves[playerMoveIndex];
        const botMove = this.bot.getRandomMove();

        this.ui.log(`--- New Turn ---`);
        this.ui.log(`${this.player.name} chose ${playerMove.name.toUpperCase()} (PP: ${playerMove.pp})`);
        this.ui.log(`${this.bot.name} chose ${botMove.name.toUpperCase()} (PP: ${botMove.pp})`);

        let playerCanAttack = true;
        let botCanAttack = true;

        if (playerMove.pp < botMove.pp) {
            this.ui.log(`!! ${this.bot.name}'s move has higher PP. ${this.player.name}'s attack is canceled!`);
            playerCanAttack = false;
        } else if (botMove.pp < playerMove.pp) {
            this.ui.log(`!! ${this.player.name}'s move has higher PP. ${this.bot.name}'s attack is canceled!`);
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

    executeAttack(attacker, defender, move, defenderRole){
        // we'll get a base to compare with the attacks accuracy
        const random_acc = Math.floor(Math.random() * 100) + 1;

        if (random_acc > move.accuracy) {
            this.ui.log(`${attacker.name}'s ${move.name.toUpperCase()} missed!`);
            return;
        }

        defender.takeDamage(move.power);
        this.ui.log(` ${attacker.name} hit ${defender.name} for ${move.power} damage!`);
        this.ui.updateHP(defenderRole, defender.currentHp, defender.maxHp);
    }

    checkWinCondition() {
        if (this.bot.isFainted()) {
            this.ui.log(`YOU WIN! ${this.bot.name} fainted!`);
            this.ui.disableMoves();
            this.gameOver = true;
        } else if (this.player.isFainted()) {
            this.ui.log(`YOU LOSE! ${this.player.name} fainted!`);
            this.ui.disableMoves();
            this.gameOver = true;
        }
    }
}
