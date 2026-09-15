const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Monopoly con Amigos</title>
      <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; text-align: center; margin: 0; padding: 20px; }
        #game-board { max-width: 600px; margin: 20px auto; background: #2a2a2a; padding: 20px; border-radius: 12px; border: 2px solid #444; }
        button { background: #28a745; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 6px; cursor: pointer; margin-top: 15px; }
        button:hover { background: #218838; }
        ul { list-style: none; padding: 0; }
        li { background: #333; margin: 5px 0; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; }
        input { padding: 10px; font-size: 16px; border-radius: 4px; border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <h1>🎲 Monopoly Multijugador 🎲</h1>
      <div id="setup">
        <input type="text" id="username" placeholder="Tu Nombre de Jugador">
        <button onclick="joinGame()">Unirse a la Partida</button>
      </div>

      <div id="game-board" style="display:none;">
        <h2 id="turn-info">Esperando jugadores...</h2>
        <div id="dice-result" style="font-size: 24px; font-weight: bold; margin: 15px 0;">🎲 Tirada: -</div>
        <button onclick="rollDice()">Tirar Dados</button>

        <h3>Jugadores Conectados (<span id="count">0</span>/6)</h3>
        <ul id="players-list"></ul>
      </div>

      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        let myName = '';

        function joinGame() {
          const input = document.getElementById('username');
          if (input.value.trim() === '') return alert('Escribe tu nombre');
          myName = input.value;
          socket.emit('joinGame', myName);
          document.getElementById('setup').style.display = 'none';
          document.getElementById('game-board').style.display = 'block';
        }

        function rollDice() {
          socket.emit('rollDice');
        }

        socket.on('updateGameState', (state) => {
          document.getElementById('count').innerText = state.players.length;
          const list = document.getElementById('players-list');
          list.innerHTML = '';
          state.players.forEach((p, idx) => {
            const isTurn = idx === state.currentTurn;
            list.innerHTML += \`<li style="\${isTurn ? 'border: 2px solid #28a745;' : ''}">
              <span>\${p.name} \${isTurn ? '⭐ (Turno Actual)' : ''}</span>
              <span>Posición: Casilla \${p.position} | $\${p.money}</span>
            </li>\`;
          });
          
          if (state.players.length > 0) {
            const currentPlayer = state.players[state.currentTurn];
            document.getElementById('turn-info').innerText = 'Turno de: ' + currentPlayer.name;
          }
        });

        socket.on('diceRolled', (data) => {
          document.getElementById('dice-result').innerText = \`🎲 \${data.player} sacó un \${data.dice}\`;
        });
      </script>
    </body>
    </html>
  `);
});

let gameState = {
  players: [],
  currentTurn: 0
};

io.on('connection', (socket) => {
  socket.on('joinGame', (name) => {
    if (gameState.players.length < 6) {
      gameState.players.push({
        id: socket.id,
        name: name,
        position: 0,
        money: 1500
      });
      io.emit('updateGameState', gameState);
    }
  });

  socket.on('rollDice', () => {
    if (gameState.players.length === 0) return;
    const playerTurn = gameState.players[gameState.currentTurn];
    
    if (playerTurn && playerTurn.id === socket.id) {
      const dice = Math.floor(Math.random() * 6) + 1;
      playerTurn.position = (playerTurn.position + dice) % 40;
      
      gameState.currentTurn = (gameState.currentTurn + 1) % gameState.players.length;
      
      io.emit('diceRolled', { player: playerTurn.name, dice: dice });
      io.emit('updateGameState', gameState);
    }
  });

  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    if (gameState.currentTurn >= gameState.players.length) {
      gameState.currentTurn = 0;
    }
    io.emit('updateGameState', gameState);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Servidor corriendo en el puerto ' + PORT));
