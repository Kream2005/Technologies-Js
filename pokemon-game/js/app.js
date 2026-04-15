#!/usr/bin/env node

import PokeApi from "./api.js";
import Pokemon from "./pokemon.js";
import Battle from "./battle.js";
import inquirer from 'inquirer';


async function startPokemon(){
    try{
        console.log("Connecting to PokeAPI...");

        const playerApiData = await PokeApi.getPokemon('charizard');
        const playerMoves = await PokeApi.getRandomMoves(playerApiData.moves);
        const player = new Pokemon(playerApiData, playerMoves);

        const randomBotId = Math.floor(Math.random() * 1025) + 1;
        const botApiData = await PokeApi.getPokemon(randomBotId);
        const botMoves = await PokeApi.getRandomMoves(botApiData.moves);
        const bot = new Pokemon(botApiData, botMoves);

        const battle = new Battle(player, bot);

        console.clear();
        console.log(`${player.name.toUpperCase()}  VS  ${bot.name.toUpperCase()}\n`)
        
        await playTurn(battle, player, bot);
        

    } catch (error) {
        console.error("Error loading game data:", error);
    }
}


async function playTurn(battle, player, bot){
    
    console.log(`${player.name} : ${player.currentHp}\n${bot.name} : ${bot.currentHp}\n`);
    
    console.log("Your available moves : ");
    //player.showMoves();
    const answer = await inquirer.prompt([
        {
            type: 'rawlist',
            name: 'moveIndex',
            message: 'What will you do?',
            choices: player.moves.map((move, index) => ({
                name: `${move.name.toUpperCase()} (Power: ${move.power || 'Not Found'})`,
                value: index
            }))
        }
    ]);
    battle.playTurn(answer.moveIndex);

        if (bot.currentHp <= 0) {
            console.log(`\n${bot.name} fainted! You are the winner!`);
        } else if (player.currentHp <= 0) {
            console.log(`\n${player.name} fainted! Better luck next time...`);
        } else {
            await playTurn(battle, player, bot);
        }
    }

startPokemon();
