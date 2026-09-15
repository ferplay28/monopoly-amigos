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
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background: #121212; color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
        h1 { margin-top: 0; color: #4caf50; }
        #setup { margin-top: 50px; background: #1e1e1e; padding: 30px; border-radius: 10px; text-align: center; border: 1px solid #333; }
        input { padding: 12px; font-size: 16px; border-radius: 5px; border: 1px solid #444; background: #2a2a2a; color: white; margin-right: 10px; }
        button { background: #4caf50; color: white; border: none; padding: 12px 20px; font-size: 16px; border-radius: 5px; cursor: pointer; font-weight: bold; }
        button:hover { background: #45a049; }
        button:disabled { background: #555; cursor: not-allowed; }

        #game-container { display: none; width: 100%; max-width: 1000px; grid-template-columns: 2fr 1fr; gap: 20px; }
        .board { display: grid; grid-template-columns: repeat(11, 1fr); grid-template-rows: repeat(11, 1fr); width: 600px; height: 600px; background: #c7e6c7; border: 4px solid #333; position: relative; border-radius: 8px; }
        
        .cell { border: 1px solid #333; font-size: 9px; text-align: center; color: #111; display: flex; flex-direction: column; justify-content: space-between; font-weight: bold; position: relative; background: #e8f5e9; }
        .cell-header { height: 15px; width: 100%; }
        .cell-name { padding: 2px; }
        .cell-price { margin-bottom: 2px; }

        .cell-0 { grid-column: 11; grid-row: 11; background: #ffcdd2; }
        .cell-1 { grid-column: 10; grid-row: 11; } .cell-1 .cell-header { background: #795548; }
        .cell-2 { grid-column: 9; grid-row: 11; } .cell-2 .cell-header { background: #795548; }
        .cell-3 { grid-column: 8; grid-row: 11; } .cell-3 .cell-header { background: #80d8ff; }
        .cell-4 { grid-column: 7; grid-row: 11; } .cell-4 .cell-header { background: #80d8ff; }
        .cell-5 { grid-column: 6; grid-row: 11; background: #e0e0e0; }
        .cell-6 { grid-column: 5; grid-row: 11; } .cell-6 .cell-header { background: #ff80ab; }
        .cell-7 { grid-column: 4; grid-row: 11; } .cell-7 .cell-header { background: #ff80ab; }
        .cell-8 { grid-column: 3; grid-row: 11; } .cell-8 .cell-header { background: #ffab40; }
        .cell-9 { grid-column: 2; grid-row: 11; } .cell-9 .cell-header { background: #ffab40; }
        .cell-10 { grid-column: 1; grid-row: 11; background: #ffe0b2; }

        .cell-11 { grid-column: 1; grid-row: 10; } .cell-11 .cell-header { background: #ff5252; }
        .cell-12 { grid-column: 1; grid-row: 9; } .cell-12 .cell-header { background: #ff5252; }
        .cell-13 { grid-column: 1; grid-row: 8; } .cell-13 .cell-header { background: #ffd740; }
        .cell-14 { grid-column: 1; grid-row: 7; } .cell-14 .cell-header { background: #ffd740; }
        .cell-15 { grid-column: 1; grid-row: 6; background: #e0e0e0; }
        .cell-16 { grid-column: 1; grid-row: 5; } .cell-16 .cell-header { background: #b9f6ca; }
        .cell-17 { grid-column: 1; grid-row: 4; } .cell-17 .cell-header { background: #b9f6ca; }
        .cell-18 { grid-column: 1; grid-row: 3; } .cell-18 .cell-header { background: #82b1ff; }
        .cell-19 { grid-column: 1; grid-row: 2; } .cell-19 .cell-header { background: #82b1ff; }
        .cell-20 { grid-column: 1; grid-row: 1; background: #b2dfdb; }

        .cell-21 { grid-column: 2; grid-row: 1; } .cell-21 .cell-header { background: #ea80fc; }
        .cell-22 { grid-column: 3; grid-row: 1; } .cell-22 .cell-header { background: #ea80fc; }
        .cell-23 { grid-column: 4; grid-row: 1; } .cell-23 .cell-header { background: #8d6e63; }
        .cell-24 { grid-column: 5; grid-row: 1; } .cell-24 .cell-header { background: #8d6e63; }
        .cell-25 { grid-column: 6; grid-row: 1; background: #e0e0e0; }
        .cell-26 { grid-column: 7; grid-row: 1; } .cell-26 .cell-header { background: #cfd8dc; }
        .cell-27 { grid-column: 8; grid-row: 1; } .cell-27 .cell-header { background: #cfd8dc; }
        .cell-28 { grid-column: 9; grid-row: 1; } .cell-28 .cell-header { background: #a1887f; }
        .cell-29 { grid-column: 10; grid-row: 1; } .cell-29 .cell-header { background: #a1887f; }
        .cell-30 { grid-column: 11; grid-row: 1; background: #ffcc80; }

        .cell-31 { grid-column: 11; grid-row: 2; } .cell-31 .cell-header { background: #80cbc4; }
        .cell-32 { grid-column: 11; grid-row: 3; } .cell-32 .cell-header { background: #80cbc4; }
        .cell-33 { grid-column: 11; grid-row: 4; } .cell-33 .cell-header { background: #9fa8da; }
        .cell-34 { grid-column: 11; grid-row: 5; } .cell-34 .cell-header { background: #9fa8da; }
        .cell-35 { grid-column: 11; grid-row: 6; background: #e0e0e0; }
        .cell-36 { grid-column: 11; grid-row: 7; } .cell-36 .cell-header { background: #f48fb1; }
        .cell-37 { grid-column: 11; grid-row: 8; } .cell-37 .cell-header { background: #f48fb1; }
        .cell-38 { grid-column: 11; grid-row: 9; } .cell-38 .cell-header { background: #b0bec5; }
        .cell-39 { grid-column: 11; grid-row: 10; } .cell-39 .cell-header { background: #b0bec5; }

        .board-center { grid-column: 2 / 11; grid-row: 2 / 11; background: #2a2a2a; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; }
        .player-token { width: 14px; height: 14px; border-radius: 50%; border: 1px solid white; display: inline-block; position: absolute; bottom: 2px; }
        .panel { background: #1e1e1e; padding: 20px; border-radius: 8px; border: 1px solid #333; }
        .player-card { background: #2a2a2a; padding: 10px; margin-bottom: 10px; border-radius: 6px; border-left: 5px solid #fff; }
        #logs { background: #000; height: 150px; overflow-y: auto; padding: 10px; font-family: monospace; font-size: 12px; border-radius: 5px; color: #00ff00; margin-top: 15px; }
      </style>
    </head>
    <body>

      <h1>🎲 MONOPOLY ONLINE 🎲</h1>

      <div id="setup">
        <h2>Unirse al Juego</h2>
        <input type="text" id="username" placeholder="Tu Nombre">
        <button onclick="joinGame()">Entrar</button>
      </div>

      <div id="game-container">
        <div class="board" id="board">
          <div class="board-center">
            <h2 id="turn-info" style="color:#fff;">Esperando jugadores...</h2>
            <div id="dice-display" style="font-size:32px; margin: 15px 0;">🎲 -</div>
            <button id="roll-btn" onclick="rollDice()" disabled>Tirar Dados</button>
            <button id="buy-btn" onclick="buyProperty()" style="display:none; background:#2196F3; margin-top:20px;">Comprar Propiedad</button>
          </div>
        </div>

        <div class="panel">
          <h3>Jugadores (<span id="count">0</span>/6)</h3>
          <div id="players-list"></div>
          <h4>Historial</h4>
          <div id="logs"></div>
        </div>
      </div>

      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        let myId = '';
        const colors = ['#f44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

        const boardData = [
          { name: "SALIDA", price: 0 }, { name: "Arequipa", price: 60 }, { name: "Cusco", price: 60 },
          { name: "Trujillo", price: 100 }, { name: "Chiclayo", price: 100 }, { name: "Tren Sur", price: 200 },
          { name: "Piura", price: 140 }, { name: "Iquitos", price: 140 }, { name: "Huancayo", price: 160 },
          { name: "Tacna", price: 160 }, { name: "CARCEL", price: 0 }, { name: "Puno", price: 180 },
          { name: "Cajamarca", price: 180 }, { name: "Ayacucho", price: 200 }, { name: "Tarapoto", price: 200 },
          { name: "Tren Norte", price: 200 }, { name: "Huaraz", price: 220 }, { name: "Ica", price: 220 },
          { name: "Chincha", price: 240 }, { name: "Pisco", price: 240 }, { name: "PARADA", price: 0 },
          { name: "Sullana", price: 260 }, { name: "Tumbes", price: 260 }, { name: "Talara", price: 280 },
          { name: "Juliaca", price: 280 }, { name: "Tren Oeste", price: 200 }, { name: "Moquegua", price: 300 },
          { name: "Ilo", price: 300 }, { name: "Chimbote", price: 320 }, { name: "Barranca", price: 320 },
          { name: "VAYASE A CARCEL", price: 0 }, { name: "Pucallpa", price: 350 }, { name: "Moyobamba", price: 350 },
          { name: "Huánuco", price: 380 }, { name: "Abancay", price: 380 }, { name: "Tren Este", price: 200 },
          { name: "Jaén", price: 400 }, { name: "Cerro de Pasco", price: 400 }, { name: "IMPUESTO", price: 0 },
          { name: "Lima Base", price: 500 }
        ];

        const boardEl = document.getElementById('board');
        boardData.forEach((b, i) => {
          const cell = document.createElement('div');
          cell.className = 'cell cell-' + i;
          cell.id = 'cell-' + i;
          cell.innerHTML = '<div class="cell-header"></div><div class="cell-name">' + b.name + '</div><div class="cell-price">' + (b.price ? '$' + b.price : '') + '</div>';
          boardEl.appendChild(cell);
        });

        function joinGame() {
          const name = document.getElementById('username').value.trim();
          if (!name) return alert('Escribe tu nombre');
          socket.emit('joinGame', name);
          document.getElementById('setup').style.display = 'none';
          document.getElementById('game-container').style.display = 'grid';
        }

        function rollDice() {
          socket.emit('rollDice');
        }

        function buyProperty() {
          socket.emit('buyProperty');
        }

        socket.on('init', (data) => { myId = data.id; });

        socket.on('updateGameState', (state) => {
          document.getElementById('count').innerText = state.players.length;
          document.querySelectorAll('.player-token').forEach(t => t.remove());

          const list = document.getElementById('players-list');
          list.innerHTML = '';

          state.players.forEach((p, idx) => {
            const isMyTurn = idx === state.currentTurn;
            const pColor = colors[idx % colors.length];

            const cell = document.getElementById('cell-' + p.position);
            if (cell) {
              const token = document.createElement('div');
              token.className = 'player-token';
              token.style.background = pColor;
              token.style.left = (idx * 16 + 2) + 'px';
              cell.appendChild(token);
            }

            list.innerHTML += '<div class="player-card" style="border-left-color: ' + pColor + '"><strong>' + p.name + ' ' + (p.id === myId ? '(Tú)' : '') + '</strong><br>Dinero: $' + p.money + ' | Casilla: ' + p.position + '<br>Propiedades: ' + p.properties.length + '</div>';

            if (isMyTurn && p.id === myId) {
              document.getElementById('roll-btn').disabled = state.hasRolled;
              document.getElementById('turn-info').innerText = '¡ES TU TURNO!';
              document.getElementById('turn-info').style.color = '#4caf50';
              
              const currentCell = boardData[p.position];
              const isPurchasable = currentCell.price > 0 && !state.propertiesOwned[p.position];
              document.getElementById('buy-btn').style.display = (state.hasRolled && isPurchasable) ? 'block' : 'none';
            } else if (isMyTurn) {
              document.getElementById('roll-btn').disabled = true;
              document.getElementById('buy-btn').style.display = 'none';
              document.getElementById('turn-info').innerText = 'Turno de: ' + p.name;
              document.getElementById('turn-info').style.color = '#fff';
            }
          });
        });

        socket.on('diceRolled', (data) => {
          document.getElementById('dice-display').innerText = '🎲 ' + data.dice;
          addLog(data.player + ' tiró un ' + data.dice + ' y movió a ' + boardData[data.position].name);
        });

        socket.on('log', (msg) => addLog(msg));

        function addLog(msg) {
          const logs = document.getElementById('logs');
          logs.innerHTML += '<div>> ' + msg + '</div>';
          logs.scrollTop = logs.scrollHeight;
        }
      </script>
    </body>
    </html>
  `);
});

let gameState = {
  players: [],
  currentTurn: 0,
  hasRolled: false,
  propertiesOwned: {}
};

const boardPrices = [0,60,60,100,100,200,140,140,160,160,0,180,180,200,200,200,220,220,240,240,0,260,260,280,280,200,300,300,320,320,0,350,350,380,380,200,400,400,0,500];

io.on('connection', (socket) => {
  socket.emit('init', { id: socket.id });

  socket.on('joinGame', (name) => {
    if (gameState.players.length < 6) {
      gameState.players.push({
        id: socket.id,
        name: name,
        position: 0,
        money: 1500,
        properties: []
      });
      io.emit('updateGameState', gameState);
      io.emit('log', name + ' se ha unido a la partida.');
    }
  });

  socket.on('rollDice', () => {
    const player = gameState.players[gameState.currentTurn];
    if (player && player.id === socket.id && !gameState.hasRolled) {
      const dice = Math.floor(Math.random() * 6) + 1;
      player.position = (player.position + dice) % 40;
      gameState.hasRolled = true;

      const ownerId = gameState.propertiesOwned[player.position];
      if (ownerId && ownerId !== player.id) {
        const owner = gameState.players.find(p => p.id === ownerId);
        const rent = Math.floor(boardPrices[player.position] * 0.25);
        player.money -= rent;
        owner.money += rent;
        io.emit('log', player.name + ' pagó $' + rent + ' de renta a ' + owner.name + '.');
      }

      io.emit('diceRolled', { player: player.name, dice: dice, position: player.position });
      
      setTimeout(() => {
        if (gameState.hasRolled) {
          gameState.currentTurn = (gameState.currentTurn + 1) % gameState.players.length;
          gameState.hasRolled = false;
          io.emit('updateGameState', gameState);
        }
      }, 3500);

      io.emit('updateGameState', gameState);
    }
  });

  socket.on('buyProperty', () => {
    const player = gameState.players[gameState.currentTurn];
    if (player && player.id === socket.id && gameState.hasRolled) {
      const price = boardPrices[player.position];
      if (price > 0 && !gameState.propertiesOwned[player.position] && player.money >= price) {
        player.money -= price;
        player.properties.push(player.position);
        gameState.propertiesOwned[player.position] = player.id;
        io.emit('log', player.name + ' compró la propiedad por $' + price + '!');
        
        gameState.currentTurn = (gameState.currentTurn + 1) % gameState.players.length;
        gameState.hasRolled = false;
        io.emit('updateGameState', gameState);
      }
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
