export default class PokeApi {

    // static method to feth pokemon data
    static async getPokemon(idOrName){
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        if (!response.ok) throw new Error("Error while getting Pokemon");
        return await response.json();
    }

    // static method to get stats for a specefic move
    static async getMove(url){
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error while getting move stats");
        return await response.json(); 
    }

    // static method to look at a Pokemon's move pool and grab 5 valid attacks
    static async getRandomMoves(movesArray, count = 5) {
        let selectedMoves = [];
        let attempts = 0;

        while (selectedMoves.length < count && attempts < 50){
            attempts++;

            const randomMoveObj = movesArray[Math.floor(Math.random() * movesArray.length)];
            
            // we should check if we alrdy added that move
            if (selectedMoves.find(m => m.name === randomMoveObj.move.name)) continue;
            
            const moveData = await this.getMove(randomMoveObj.move.url);

            if (moveData.power !== null && moveData.accuracy !== null){
                selectedMoves.push({
                    name: moveData.name,
                    power: moveData.power,
                    accuracy: moveData.accuracy,
                    pp: moveData.pp 
                });
            }
        }
        return selectedMoves;
    }
}
