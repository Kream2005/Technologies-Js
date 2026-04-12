import UI from "./ui.js";
import PokeApi from "./api.js";
import Pokemon from "./pokemon.js";
import Battle from "./battle.js";


document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UI();

    try{
        ui.log("Connecting to PokeAPI...");

        const playerApiData = await PokeApi.getPokemon('charizard');
        const playerMoves = await PokeApi.getRandomMoves(playerApiData.moves);
        const player = new Pokemon(playerApiData, playerMoves);

        const randomBotId = Math.floor(Math.random() * 1025) + 1;
        const botApiData = await PokeApi.getPokemon(randomBotId);
        const botMoves = await PokeApi.getRandomMoves(botApiData.moves);
        const bot = new Pokemon(botApiData, botMoves);

        ui.setupArena(player, bot);
        const battle = new Battle(player, bot, ui);

        ui.clearLog();
        ui.log("Battle Started! Choose your move.");
        
        ui.renderMoves(player.moves, (moveIndex) => {
            // When a button is clicked, tell the battle engine to play a turn
            battle.playTurn(moveIndex);
        });

    } catch (error) {
        console.error("Error loading game data:", error);
        ui.log("Error loading Pokémon data. Please refresh and try again.");
    }   
})