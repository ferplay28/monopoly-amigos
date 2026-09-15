<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monopoly Web - UI Prototype</title>
  <style>
    /* --------------------------------------------------
       1. ESTILOS GENERALES Y RESET
    -------------------------------------------------- */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Utilitario para alternar pantallas */
    .screen {
      display: none;
      flex: 1;
      width: 100%;
      height: 100%;
    }

    .screen.active {
      display: flex;
    }

    /* --------------------------------------------------
       2. PANTALLA 1: MENÚ DE SELECCIÓN DE MODO
    -------------------------------------------------- */
    #screen-menu {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
      padding: 20px;
    }

    .logo-container {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-container h1 {
      font-size: 3rem;
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .menu-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      max-width: 320px;
    }

    .btn-main {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }

    .btn-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
    }

    .btn-main.secondary {
      background: linear-gradient(135deg, #475569 0%, #334155 100%);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    }

    /* --------------------------------------------------
       3. PANTALLA 2: PERSONALIZACIÓN / LOBBY
    -------------------------------------------------- */
    #screen-lobby {
      flex-direction: column;
      background: #1e293b;
    }

    .header-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(15, 23, 42, 0.8);
      border-bottom: 1px solid #334155;
    }

    .steps-bar {
      display: flex;
      gap: 12px;
    }

    .step-pill {
      padding: 6px 16px;
      background: #334155;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .step-pill.active {
      background: #3b82f6;
      color: white;
    }

    .lobby-content {
      display: flex;
      flex: 1;
      padding: 24px;
      gap: 24px;
    }

    .options-panel {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-option {
      background: #0f172a;
      border: 2px solid #334155;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .card-option:hover, .card-option.selected {
      border-color: #3b82f6;
    }

    .preview-panel {
      flex: 1;
      background: #0f172a;
      border-radius: 12px;
      border: 1px solid #334155;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* --------------------------------------------------
       4. PANTALLA 3: HUD DE JUEGO (GAMEPLAY)
    -------------------------------------------------- */
    #screen-gameplay {
      position: relative;
      background: #020617;
    }

    .board-viewport {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #1e293b 0%, #020617 100%);
    }

    .board-placeholder {
      width: 450px;
      height: 450px;
      border: 4px dashed #334155;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-weight: bold;
    }

    .players-sidebar {
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .player-hud-card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border-radius: 30px 12px 12px 30px;
      display: flex;
      align-items: center;
      padding: 8px 16px 8px 8px;
      min-width: 200px;
      border: 2px solid transparent;
    }

    .player-hud-card.active-turn {
      border-color: #a855f7;
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
    }

    .hud-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .hud-info {
      margin-left: 12px;
    }

    .hud-name { font-size: 0.85rem; font-weight: 700; }
    .hud-money { font-size: 0.95rem; font-weight: 800; color: #facc15; }

    /* Modal emergente dentro del juego */
    .game-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      color: #0f172a;
      border-radius: 12px;
      width: 280px;
      padding: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      display: none;
    }

    .card-header-color {
      background: #10b981;
      color: white;
      text-align: center;
      font-weight: 800;
      padding: 8px;
      border-radius: 6px 6px 0 0;
      margin: -16px -16px 12px -16px;
    }
  </style>
</head>
<body>

  <!-- ==========================================
       PANTALLA 1: MENÚ PRINCIPAL
  =========================================== -->
  <section id="screen-menu" class="screen active">
    <div class="logo-container">
      <h1>Monopoly</h1>
      <p style="color: #94a3b8;">Edición Web 3D</p>
    </div>
    <div class="menu-options">
      <button class="btn-main" onclick="navigateTo('screen-lobby')">Jugar Local</button>
      <button class="btn-main secondary" onclick="alert('Modo Online Próximamente')">Multijugador</button>
    </div>
  </section>

  <!-- ==========================================
       PANTALLA 2: LOBBY DE PERSONALIZACIÓN
  =========================================== -->
  <section id="screen-lobby" class="screen">
    <header class="header-nav">
      <button class="btn-main secondary" style="padding: 6px 16px; font-size: 0.9rem;" onclick="navigateTo('screen-menu')">← Volver</button>
      <div class="steps-bar">
        <span class="step-pill active">1. Reglas</span>
        <span class="step-pill">2. Tablero</span>
        <span class="step-pill">3. Peón</span>
      </div>
      <div></div>
    </header>

    <div class="lobby-content">
      <div class="options-panel">
        <h2>Selecciona Modo de Juego</h2>
        <div class="card-option selected">
          <div>
            <h3>Monopoly Clásico</h3>
            <p style="color: #94a3b8; font-size: 0.85rem;">Reglas tradicionales, compra de propiedades y bancarrota.</p>
          </div>
          <span>✓</span>
        </div>
        <div class="card-option">
          <div>
            <h3>Modo Rápido</h3>
            <p style="color: #94a3b8; font-size: 0.85rem;">Partidas de 20 minutos con subastas automáticas.</p>
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div style="width: 100px; height: 100px; background: #334155; border-radius: 50%; margin-bottom: 16px; display:flex; align-items:center; justify-content:center; font-size: 2rem;">🎲</div>
        <h3>Listo para jugar</h3>
        <button class="btn-main" style="margin-top: 24px; width: 100%;" onclick="navigateTo('screen-gameplay')">Iniciar Partida</button>
      </div>
    </div>
  </section>

  <!-- ==========================================
       PANTALLA 3: GAMEPLAY (TABLERO Y HUD)
  =========================================== -->
  <section id="screen-gameplay" class="screen">
    <div class="board-viewport">
      <div class="board-placeholder">
        [ Render del Tablero 3D ]
        <br>
        <button class="btn-main" style="margin-top: 16px;" onclick="togglePropertyModal()">Probar Evento de Compra</button>
      </div>
    </div>

    <!-- HUD Lateral de Jugadores -->
    <aside class="players-sidebar">
      <div class="player-hud-card active-turn">
        <div class="hud-avatar">P1</div>
        <div class="hud-info">
          <div class="hud-name">EpicNabob116</div>
          <div class="hud-money">ℳ 1,500</div>
        </div>
      </div>
      <div class="player-hud-card">
        <div class="hud-avatar" style="background: #ef4444;">BOT</div>
        <div class="hud-info">
          <div class="hud-name">Bot Pagoda</div>
          <div class="hud-money">ℳ 1,200</div>
        </div>
      </div>
    </aside>

    <!-- Modal Emergente (Propiedad) -->
    <div id="property-modal" class="game-modal">
      <div class="card-header-color">SENDERO DEL PATIO</div>
      <p style="font-size: 0.85rem; text-align: center; margin-bottom: 12px;">¿Deseas comprar esta propiedad por <strong>ℳ 300</strong>?</p>
      <div style="display: flex; gap: 8px;">
        <button class="btn-main" style="flex: 1; padding: 8px; font-size: 0.85rem;" onclick="togglePropertyModal()">Comprar</button>
        <button class="btn-main secondary" style="flex: 1; padding: 8px; font-size: 0.85rem;" onclick="togglePropertyModal()">Pasar</button>
      </div>
    </div>
  </section>

  <!-- ==========================================
       5. LÓGICA DE NAVEGACIÓN SIMPLE (JS)
  =========================================== -->
  <script>
    function navigateTo(screenId) {
      // Ocultar todas las pantallas
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      // Mostrar la pantalla seleccionada
      const targetScreen = document.getElementById(screenId);
      if (targetScreen) {
        targetScreen.classList.add('active');
      }
    }

    function togglePropertyModal() {
      const modal = document.getElementById('property-modal');
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
  </script>
</body>
</html>
