export default class UI {

    constructor() {
        this.logEl = document.getElementById('battle-log');
        this.movesContainer = document.getElementById('moves-container');
    }

    setupArena(player, bot){
        // setting up tha names of the player aénd the bot

        document.getElementById('player-name').innerText = player.name;
        document.getElementById('bot-name').innerText = bot.name;
    }

    updateHP(role, current, max){
        
        const percentage = (current / max) * 100;
        const fillBar = document.getElementById(`${role}-hp-fill`);

        fillBar.style.width = `${percentage}%`;
        document.getElementById(`${role}-hp-text`).innerText = `${current} / ${max}`;
        
        if (percentage <= 20) {
            fillBar.className = 'h-full w-full transition-all bg-red-500';
        } else if (percentage <= 50) {
            fillBar.className = 'h-full w-full transition-all bg-yellow-400';
        } else {
            fillBar.className = 'h-full w-full transition-all bg-green-500';
        }
    }

    log(message){
        const p = document.createElement('p');

        if (message.includes('---')) {
            p.className = 'text-blue-600 font-bold mt-2';
        } else if (message.includes('missed') || message.includes('canceled')) {
            p.className = 'text-red-500';
        } else if (message.includes('damage!')) {
            p.className = 'text-green-600';
        } else if (message.includes('WIN') || message.includes('LOSE')) {
            p.className = 'text-yellow-600 font-black text-lg text-center my-2';
        }

        p.innerText = message;
        this.logEl.appendChild(p);
        this.logEl.scrollTop = this.logEl.scrollHeight;
    }

    clearLog() {
        this.logEl.innerHTML = ''; 
    }

    renderMoves(moves, onMoveClick) {
        this.movesContainer.innerHTML = '';
        moves.forEach((move, index) => {
            const btn = document.createElement('button');

            btn.className = `
                flex flex-col items-center justify-center p-2 
                bg-blue-50 text-blue-700 border border-blue-200 rounded 
                hover:bg-blue-100 active:bg-blue-200
                transition-colors cursor-pointer 
                disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed
            `;
            
            btn.innerHTML = `
                <span class="font-bold text-sm mb-1">${move.name.toUpperCase()}</span>
                <span class="text-xs opacity-75 text-gray-600">Pow: ${move.power} | Acc: ${move.accuracy} | PP: ${move.pp}</span>
            `;

            btn.onclick = () => onMoveClick(index);
            this.movesContainer.appendChild(btn);
        })
    }

    disableMoves() {
        const buttons = document.querySelectorAll('#moves-container button');
        buttons.forEach(btn => btn.disabled = true);
    }
}
