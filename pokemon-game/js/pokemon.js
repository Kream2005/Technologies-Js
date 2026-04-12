export default class Pokemon {

    constructor(apiData, moves) {
        this.name = apiData.name.toUpperCase();
        this.sprite = apiData.sprites.front_default;
        this.maxHp = 300;
        this.currentHp = 300;
        this.moves = moves;
    }

    takeDamage(amount){
        this.currentHp -= amount;
        this.currentHp = this.currentHp < 0 ? 0 : this.currentHp;
    }

    isFainted() {
        return this.currentHp <= 0;
    }

    getRandomMove() {
        return this.moves[Math.floor(Math.random() * this.moves.length)];
    }
}
