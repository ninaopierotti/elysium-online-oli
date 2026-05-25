import Phaser from 'phaser';

// ══════════════════════════════════════════
// TILE & MAP CONFIGURATION
// ══════════════════════════════════════════

const MAP_CONFIG = {
    tileSize: 32,
    safeRadius: 5,

    tiles: {
        GRASS: 130, DIRT: 0, SAND: 76, EMPTY: -1,
        DIRT_TOP: 264, DIRT_BOTTOM: 8, DIRT_RIGHT: 69, DIRT_LEFT: 132,
        DIRT_NW: 65, DIRT_NE: 193, DIRT_SW: 67, DIRT_SE: 195,
    }
};


const MAPS = {
    overworld: {
        name: 'Floresta de Elysium',
        width: 100,
        height: 100,
        spawnX: 50,
        spawnY: 50,
        baseTile: 130,
        hasPaths: true,
        holes: [
            { x: 52, y: 52, target: 'dungeon', spawnX: 10, spawnY: 10 }
        ],
        monsters: { rat: 25, orc: 12 },
    },
    dungeon: {
        name: 'Caverna Sombria',
        width: 50,
        height: 50,
        spawnX: 10,
        spawnY: 10,
        baseTile: 0,
        hasPaths: false,
        holes: [
            { x: 10, y: 9, target: 'overworld', spawnX: 52, spawnY: 51 }
        ],
        monsters: { orc: 8, vampire: 8 },
    },
};


// ══════════════════════════════════════════
// SERVER CONFIG
// ══════════════════════════════════════════


const SERVER_CONFIG = {
    expRate: 100,
    skillRate: 1,     // Multiplicador de skill EXP (1 = normal, 2 = dobro)
    lootRate: 1,
    spawnRate: 1,
};


// ══════════════════════════════════════════
// MONSTER DEFINITIONS
// ══════════════════════════════════════════

const MONSTER_DEFS = {
    rat: {
        name: 'Rat',
        sprite: 'rat',
        scale: 0.8,
        maxHp: 25,
        attack: 5,
        defense: 1,
        exp: 5,
        attackSpeed: 2000,
        aggroRange: 4,
        chaseRange: 6,
        spawnCount: 25,
    },
    orc: {
        name: 'Orc',
        sprite: 'orc',
        scale: 1.4,
        maxHp: 80,
        attack: 14,
        defense: 4,
        exp: 25,
        attackSpeed: 2500,
        chaseRange: 7,
        aggroRange: 5,
        spawnCount: 12,
    },
    vampire: {
        name: 'Vampire',
        sprite: 'vampire',
        scale: 1.5,
        maxHp: 150,
        attack: 22,
        defense: 8,
        exp: 200,
        attackSpeed: 2000,
        aggroRange: 6,
        chaseRange: 8,
        spawnCount: 8,
    },
};

// ══════════════════════════════════════════
// PLAYER COMBAT STATS
// ══════════════════════════════════════════

const PLAYER_STATS = {
    baseAttack: 18,
    baseDefense: 5,
    attackSpeed: 1500,
};

// ══════════════════════════════════════════
// ITEMS & LOOT TABLES
// ══════════════════════════════════════════

const ITEMS = {
    // Poções
    health_potion: { name: 'Health Potion', icon: '🧪', type: 'potion', effect: 'hp', value: 30, stackable: true },
mana_potion:   { name: 'Mana Potion',   icon: '🔮', type: 'potion', effect: 'mana', value: 20, stackable: true },
great_health:  { name: 'Great Health',   icon: '⚗️', type: 'potion', effect: 'hp', value: 60, stackable: true },

    // Armas
    rusty_sword:   { name: 'Rusty Sword',   icon: '🗡️', type: 'weapon',  slot: 'weapon',  attack: 5,  defense: 0, skillType: 'sword' },
    iron_sword:    { name: 'Iron Sword',    icon: '⚔️', type: 'weapon',  slot: 'weapon',  attack: 10, defense: 0, skillType: 'sword' },
    orc_axe:       { name: 'Orc Axe',       icon: '🪓', type: 'weapon',  slot: 'weapon',  attack: 15, defense: 0, skillType: 'axe' },

    // Escudos
    wood_shield:   { name: 'Wood Shield',   icon: '🛡️', type: 'shield',  slot: 'shield',  attack: 0,  defense: 3 },
    iron_shield:   { name: 'Iron Shield',   icon: '🔰', type: 'shield',  slot: 'shield',  attack: 0,  defense: 6 },

    // Armaduras
    leather_armor: { name: 'Leather Armor', icon: '🦺', type: 'armor',   slot: 'armor',   attack: 0,  defense: 4 },
    chain_armor:   { name: 'Chain Armor',   icon: '🥋', type: 'armor',   slot: 'armor',   attack: 0,  defense: 8 },

    // Capacetes
    leather_helm:  { name: 'Leather Helm',  icon: '⛑️', type: 'helmet',  slot: 'helmet',  attack: 0,  defense: 2 },
    iron_helm:     { name: 'Iron Helm',     icon: '🪖', type: 'helmet',  slot: 'helmet',  attack: 0,  defense: 5 },

    // Calças
    leather_legs:  { name: 'Leather Legs',  icon: '👖', type: 'legs',    slot: 'legs',    attack: 0,  defense: 3 },
    iron_legs:     { name: 'Iron Legs',     icon: '🦿', type: 'legs',    slot: 'legs',    attack: 0,  defense: 6 },
};

// Loot table: { itemId, chance (0-1) }
const LOOT_TABLES = {
    rat: [
        { item: 'health_potion', chance: 0.50 },
        { item: 'mana_potion',   chance: 0.30 },
        { item: 'rusty_sword',   chance: 0.08 },
        { item: 'leather_helm',  chance: 0.06 },
        { item: 'leather_legs',  chance: 0.05 },
        { item: 'wood_shield',   chance: 0.05 },
    ],
    orc: [
        { item: 'health_potion', chance: 0.60 },
        { item: 'great_health',  chance: 0.25 },
        { item: 'mana_potion',   chance: 0.40 },
        { item: 'iron_sword',    chance: 0.12 },
        { item: 'orc_axe',       chance: 0.06 },
        { item: 'iron_shield',   chance: 0.08 },
        { item: 'chain_armor',   chance: 0.06 },
        { item: 'leather_armor', chance: 0.10 },
        { item: 'iron_helm',     chance: 0.07 },
        { item: 'iron_legs',     chance: 0.06 },
    ],
    vampire: [
        { item: 'great_health',  chance: 0.55 },
        { item: 'mana_potion',   chance: 0.45 },
        { item: 'iron_sword',    chance: 0.12 },
        { item: 'iron_shield',   chance: 0.10 },
        { item: 'chain_armor',   chance: 0.08 },
        { item: 'iron_helm',     chance: 0.09 },
        { item: 'iron_legs',     chance: 0.08 },
    ],
};

// ══════════════════════════════════════════
// PROPS
// ══════════════════════════════════════════

const PROP_DEFS = {
    tree_orange:    { x: 2,   y: 4,   w: 74,  h: 136, blocking: true,  minimapColor: '#C45A20' },
    tree_blue:      { x: 105, y: 4,   w: 94,  h: 134, blocking: true,  minimapColor: '#4A9CB0' },
    tree_yellow:    { x: 229, y: 2,   w: 56,  h: 124, blocking: true,  minimapColor: '#C8A030' },
    tree_pine:      { x: 298, y: 4,   w: 47,  h: 122, blocking: true,  minimapColor: '#2D6B14' },
    bush_green_lg:  { x: 647, y: 51,  w: 54,  h: 45,  blocking: false, minimapColor: '#5A8C2A' },
    bush_green_sm:  { x: 609, y: 60,  w: 30,  h: 35,  blocking: false, minimapColor: '#5A8C2A' },
    bush_yellow_lg: { x: 647, y: 115, w: 54,  h: 45,  blocking: false, minimapColor: '#8B8C2A' },
    bush_yellow_sm: { x: 609, y: 124, w: 30,  h: 35,  blocking: false, minimapColor: '#8B8C2A' },
    bush_orange_lg: { x: 647, y: 243, w: 54,  h: 45,  blocking: false, minimapColor: '#A05A20' },
    bush_orange_sm: { x: 609, y: 252, w: 30,  h: 35,  blocking: false, minimapColor: '#A05A20' },
    bush_red_lg:    { x: 647, y: 307, w: 54,  h: 45,  blocking: false, minimapColor: '#8C3A2A' },
    bush_blue_lg:   { x: 647, y: 179, w: 54,  h: 45,  blocking: false, minimapColor: '#4A8090' },
    bush_blue_sm:   { x: 609, y: 188, w: 30,  h: 35,  blocking: false, minimapColor: '#4A8090' },
    rock_large:     { x: 18,  y: 226, w: 41,  h: 30,  blocking: true,  minimapColor: '#808080' },
    rock_small:     { x: 66,  y: 235, w: 29,  h: 21,  blocking: false, minimapColor: '#A0A0A0' },
    stump_1:        { x: 35,  y: 163, w: 26,  h: 25,  blocking: true,  minimapColor: '#5A3A1A' },
    stump_2:        { x: 98,  y: 163, w: 28,  h: 26,  blocking: true,  minimapColor: '#5A3A1A' },
    tree_sm_orange: { x: 129, y: 235, w: 57,  h: 71,  blocking: true,  minimapColor: '#C45A20' },
    tree_sm_blue:   { x: 257, y: 235, w: 57,  h: 71,  blocking: true,  minimapColor: '#4A9CB0' },
    tree_sm_green:  { x: 204, y: 259, w: 40,  h: 56,  blocking: true,  minimapColor: '#5A8C2A' },
    tree_sm_yellow: { x: 332, y: 259, w: 40,  h: 56,  blocking: true,  minimapColor: '#C8A030' },
};

// ══════════════════════════════════════════

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.playerName = data.playerName || 'Player';
        this.playerVocation = 'Knight';

        this.currentMapId = 'overworld';
        this.gridSize = MAP_CONFIG.tileSize;
        this.mapWidth = MAPS.overworld.width;
        this.mapHeight = MAPS.overworld.height;
        this.playerGridX = MAPS.overworld.spawnX;
        this.playerGridY = MAPS.overworld.spawnY;
        this.holeSprites = [];
        this.isTransitioning = false;

        this.isMoving = false;
        this.playerLevel = 1;
        this.facing = 'south';

        this.maxHp = 100;
        this.currentHp = 100;
        this.maxMana = 50;
        this.currentMana = 50;
        this.currentExp = 0;
        this.totalExp = 0;

        this.lootWindowOpen = false;
        this.lootSlots = [null, null, null, null, null, null];
        this.rightPanelVisible = true;
        this.leftPanelVisible = true;
        this.maxCapacity = 100;
        this.currentCapacity = 0;

        
        this.skills = {
            sword: { level: 10, exp: 0, next: 100 },
            axe:   { level: 10, exp: 0, next: 100 },
            club:  { level: 10, exp: 0, next: 100 },
            magic: { level: 10, exp: 0, next: 100 }
        };


        this.equipment = {
            necklace: null, helmet: null,
            backpack: { name: 'Bag', icon: '🎒' },
            weapon: null, armor: null, shield: null,
            ring: null, legs: null, utilities: null, boots: null
        };
 
        // Hotbar (6 slots: 0=F1, 1=F2, 2=1, 3=2, 4=3, 5=4)
        
        this.hotbar = [null, null, null, null, null, null];
        this.dragData = null;

        
        this.activeTab = 'geral';
        this.chatBubble = null;
        this.chatBubbleTimer = null;


        this.collisionMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.collisionMap[y] = new Array(this.mapWidth).fill(false);
        }

        this.dirtMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.dirtMap.push(new Array(this.mapWidth).fill(false));
        }

        this.overlayData = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.overlayData.push(new Array(this.mapWidth).fill(MAP_CONFIG.tiles.EMPTY));
        }

        this.propSprites = [];
        this.propPositions = [];

        // Monsters & Combat
        this.monsters = [];
        this.targetMonster = null;
        this.lastPlayerAttackTime = 0;
        this.isChasing = false;
    }

    preload() {
        const directions = ['west', 'south', 'east', 'north'];
        directions.forEach(dir => {
            for (let i = 0; i < 6; i++) {
                const frame = String(i).padStart(3, '0');
                this.load.image(`player_${dir}_${i}`, `/sprites/player/${dir}/frame_${frame}.png`);
            }
        });

        const monsterTypes = ['rat', 'orc', 'vampire'];
        monsterTypes.forEach(type => {
            directions.forEach(dir => {
                for (let i = 0; i < 6; i++) {
                    const frame = String(i).padStart(3, '0');
                    this.load.image(`${type}_${dir}_${i}`, `/sprites/${type}/${dir}/frame_${frame}.png`);
                }
            });
        });

        this.load.spritesheet('terrain', '/tilesets/TileSet.png', {
            frameWidth: 32, frameHeight: 32
        });

        this.load.image('props-sheet', '/tilesets/Props.png');
    }

    create() {
        this.definePropsFrames();
        this.createMap();
        this.placeProps();
        this.spawnMonsters();
        this.createPlayer();
        this.createAnimations();
        this.createPlayerUI();
        this.setupPanels();
        this.setupTooltips();
        this.setupHotbar();
        this.setupMinimap();
        this.setupChat();

        // Target indicator graphic
        this.targetIndicator = this.add.graphics().setDepth(9999);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey('W'),
            down: this.input.keyboard.addKey('S'),
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D')
        };

        // ESC para deselecionar target
        this.input.keyboard.on('keydown-ESC', () => {
            this.clearTarget();
        });

        // Click no mundo para target de monstro
        this.input.on('pointerdown', (pointer) => {
            this.handleWorldClick(pointer);
        });

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.3);
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.gridSize, this.mapHeight * this.gridSize);

        this.scale.on('resize', (gameSize) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
            this.cameras.main.setBounds(0, 0, this.mapWidth * this.gridSize, this.mapHeight * this.gridSize);
        });

        // Timers
        this.time.addEvent({
            delay: 1000,
            callback: this.monsterAI,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 500,
            callback: this.updateBattleList,
            callbackScope: this,
            loop: true
        });
    }


// ══════════════════════════════════════
// HOTBAR & DRAG
// ══════════════════════════════════════

setupHotbar() {
    // Teclas de atalho para poções/skills
    this.input.keyboard.on('keydown-F1', (e) => { e.preventDefault(); this.useHotbarSlot(0); });
    this.input.keyboard.on('keydown-F2', (e) => { e.preventDefault(); this.useHotbarSlot(1); });
    this.input.keyboard.on('keydown-ONE', () => this.useHotbarSlot(2));
    this.input.keyboard.on('keydown-TWO', () => this.useHotbarSlot(3));
    this.input.keyboard.on('keydown-THREE', () => this.useHotbarSlot(4));
    this.input.keyboard.on('keydown-FOUR', () => this.useHotbarSlot(5));

    this.setupDragAndDrop();
}

setupDragAndDrop() {
    let ghost = null;

    // ── Drag start (loot slots) ──
    document.addEventListener('mousedown', (e) => {
        const lootSlot = e.target.closest('.loot-slot.filled');
        if (!lootSlot) return;

        const index = parseInt(lootSlot.dataset.index);
        const slot = this.lootSlots[index];
        if (!slot) return;

        const item = ITEMS[slot.id];
        if (!item) return;

        e.preventDefault();
        this.hideTooltip();

        this.dragData = { source: 'loot', index, itemId: slot.id };
        lootSlot.classList.add('dragging');

        // Ghost element
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.textContent = item.icon;
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        document.body.appendChild(ghost);
    });

    // ── Drag move ──
    document.addEventListener('mousemove', (e) => {
        if (!this.dragData || !ghost) return;
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;

        // Highlight hotbar slots on hover
        document.querySelectorAll('.hotbar-slot').forEach(el => {
            el.classList.remove('drag-over');
        });

        const hotbarSlot = e.target.closest('.hotbar-slot');
        if (hotbarSlot) {
            const hotbarIdx = parseInt(hotbarSlot.dataset.hotbar);
            const item = ITEMS[this.dragData.itemId];

            // F1/F2 (indices 0,1) = só poções
            if (hotbarIdx <= 1 && item.type === 'potion') {
                hotbarSlot.classList.add('drag-over');
            } else if (hotbarIdx >= 2) {
                hotbarSlot.classList.add('drag-over');
            }
        }
    });

    // ── Drop ──
document.addEventListener('mouseup', (e) => {
    if (!this.dragData) return;

    // Limpa ghost
    if (ghost) {
        ghost.remove();
        ghost = null;
    }

    // Limpa visuais
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    const hotbarSlot = e.target.closest('.hotbar-slot');
    const lootSlot = e.target.closest('.loot-slot');
    const sidePanel = e.target.closest('#side-panel');
    const leftPanel = e.target.closest('#left-panel');
    const hotbarEl = e.target.closest('#hotbar');

    if (hotbarSlot) {
        // Drop no hotbar
        const hotbarIdx = parseInt(hotbarSlot.dataset.hotbar);
        const item = ITEMS[this.dragData.itemId];

        let canDrop = false;
        if (hotbarIdx <= 1 && item.type === 'potion') {
            canDrop = true;
        } else if (hotbarIdx >= 2) {
            canDrop = true;
        }

        if (canDrop) {
            this.hotbar[hotbarIdx] = {
                itemId: this.dragData.itemId,
                sourceIndex: this.dragData.index
            };
            this.renderHotbar();
        }
    } else if (!lootSlot && !sidePanel && !leftPanel && !hotbarEl) {
        // Drop fora dos painéis e hotbar = drop no mapa (descarta)
        const slot = this.lootSlots[this.dragData.index];
        if (slot) {
            const item = ITEMS[slot.id];
            const itemName = item ? `${item.icon} ${item.name}` : 'Item';
            const qty = slot.qty > 1 ? ` (x${slot.qty})` : '';

            // Remove da bag
            this.lootSlots[this.dragData.index] = null;

            // Remove do hotbar se estava lá
            this.hotbar.forEach((hb, idx) => {
                if (hb && hb.itemId === this.dragData.itemId) {
                    // Verifica se ainda existe na bag
                    const stillInBag = this.lootSlots.some(s => s && s.id === this.dragData.itemId);
                    if (!stillInBag) {
                        this.hotbar[idx] = null;
                    }
                }
            });

            this.addLog(`Descartou ${itemName}${qty}`, 'system');
            this.renderLootSlots();
            this.renderHotbar();
        }
    }

    this.dragData = null;
});

    // ── Right click to remove from hotbar ──
    document.addEventListener('contextmenu', (e) => {
        const hotbarSlot = e.target.closest('.hotbar-slot');
        if (hotbarSlot) {
            e.preventDefault();
            const idx = parseInt(hotbarSlot.dataset.hotbar);
            this.hotbar[idx] = null;
            this.renderHotbar();
        }
    });
}

useHotbarSlot(index) {
    const hotbarItem = this.hotbar[index];
    if (!hotbarItem) return;

    const item = ITEMS[hotbarItem.itemId];
    if (!item) return;

    if (item.type === 'potion') {
        // Encontra a poção na bag
        const bagIndex = this.lootSlots.findIndex(s => s && s.id === hotbarItem.itemId);
        if (bagIndex === -1) {
            // Sem estoque — remove do hotbar
            this.hotbar[index] = null;
            this.renderHotbar();
            return;
        }

        this.usePotion(item, bagIndex);
        this.renderHotbar();
    }
}

renderHotbar() {
    this.hotbar.forEach((hbItem, idx) => {
        const el = document.querySelector(`.hotbar-slot[data-hotbar="${idx}"]`);
        if (!el) return;

        const iconEl = el.querySelector('.hotbar-icon');
        const qtyEl = el.querySelector('.hotbar-qty');

        if (!iconEl || !qtyEl) return;  // ← safety check

        if (hbItem) {
            const item = ITEMS[hbItem.itemId];
            if (!item) {
                this.hotbar[idx] = null;
                el.classList.remove('has-item', 'on-cooldown');
                iconEl.textContent = '';
                qtyEl.textContent = '';
                return;
            }

            iconEl.textContent = item.icon;
            el.classList.add('has-item');

            if (item.stackable) {
                const bagSlot = this.lootSlots.find(s => s && s.id === hbItem.itemId);
                const qty = bagSlot ? bagSlot.qty : 0;
                qtyEl.textContent = qty > 0 ? qty : '0';

                if (qty <= 0) {
                    el.classList.add('on-cooldown');
                } else {
                    el.classList.remove('on-cooldown');
                }
            } else {
                qtyEl.textContent = '';
                el.classList.remove('on-cooldown');
            }
        } else {
            el.classList.remove('has-item', 'on-cooldown');
            iconEl.textContent = '';
            qtyEl.textContent = '';
        }
    });
}

    // ══════════════════════════════════════
    // MAP LAYERS
    // ══════════════════════════════════════

    definePropsFrames() {
        const tex = this.textures.get('props-sheet');
        Object.entries(PROP_DEFS).forEach(([name, def]) => {
            tex.add(name, 0, def.x, def.y, def.w, def.h);
        });
    }

    
    createMap() {
        const mapData = MAPS[this.currentMapId];

        // ── LAYER 0: Base ──
        this.createMapForCurrentWorld(mapData);

        if (mapData.hasPaths) {
            this.generateDirtPaths();
            this.calculateTransitions();
        }

        // ── LAYER 1: Overlay ──
        const overlayMap = this.make.tilemap({
            data: this.overlayData,
            tileWidth: this.gridSize,
            tileHeight: this.gridSize
        });
        const overlayTileset = overlayMap.addTilesetImage('terrain');
        this.overlayLayer = overlayMap.createLayer(0, overlayTileset, 0, 0);
        this.overlayLayer.setDepth(1);

        // ── Holes ──
        this.placeHoles(mapData);
    }


    
// ══════════════════════════════════════
// MAP SYSTEM
// ══════════════════════════════════════

loadMap(mapId, spawnX, spawnY) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.fadeOut(400, 0, 0, 0);

    this.time.delayedCall(400, () => {
        // IMPORTANTE: Mata TODOS os tweens ativos antes de destruir
        this.tweens.killAll();

        // Limpa monstros
        this.monsters.forEach(m => {
            m.alive = false;
            m.isMoving = false;
            if (m.sprite && m.sprite.active) m.sprite.destroy();
            if (m.nameText && m.nameText.active) m.nameText.destroy();
            if (m.hpBar && m.hpBar.active) m.hpBar.destroy();
            m.sprite = null;
            m.nameText = null;
            m.hpBar = null;
        });
        this.monsters = [];

        // Limpa props
        this.propSprites.forEach(s => { if (s && s.active) s.destroy(); });
        this.propSprites = [];
        this.propPositions = [];

        // Limpa holes
        this.holeSprites.forEach(s => { if (s && s.active) s.destroy(); });
        this.holeSprites = [];

        // Limpa layers
        if (this.baseLayer) { this.baseLayer.destroy(); this.baseLayer = null; }
        if (this.overlayLayer) { this.overlayLayer.destroy(); this.overlayLayer = null; }

        // Limpa target
        this.clearTarget();

        // Atualiza config do mapa
        const mapData = MAPS[mapId];
        this.currentMapId = mapId;
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;
        this.playerGridX = spawnX;
        this.playerGridY = spawnY;

        // Reset collision map
        this.collisionMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.collisionMap[y] = new Array(this.mapWidth).fill(false);
        }

        // Reset dirt map
        this.dirtMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.dirtMap.push(new Array(this.mapWidth).fill(false));
        }

        // Reset overlay
        this.overlayData = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.overlayData.push(new Array(this.mapWidth).fill(MAP_CONFIG.tiles.EMPTY));
        }

        // Recria o mapa
        this.createMapForCurrentWorld(mapData);

        if (mapData.hasPaths) {
            this.generateDirtPaths();
            this.calculateTransitions();
        }

        // Overlay layer
        const overlayMap = this.make.tilemap({
            data: this.overlayData,
            tileWidth: this.gridSize,
            tileHeight: this.gridSize
        });
        const overlayTileset = overlayMap.addTilesetImage('terrain');
        this.overlayLayer = overlayMap.createLayer(0, overlayTileset, 0, 0);
        this.overlayLayer.setDepth(1);

        // Props
        if (mapData.hasPaths) {
            this.placeProps();
        }

        // Holes
        this.placeHoles(mapData);

        // Monsters
        this.spawnMonstersForMap(mapData);

        // Player position
        const startX = this.playerGridX * this.gridSize + this.gridSize / 2;
        const startY = this.playerGridY * this.gridSize + this.gridSize / 2;
        this.player.setPosition(startX, startY);
        this.player.setDepth(startY);

        // Camera
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.gridSize, this.mapHeight * this.gridSize);

        // Minimap
        this.drawMinimap();

        // Update map name
        const mapNameEl = document.querySelector('.hud-map-name');
        if (mapNameEl) mapNameEl.textContent = `🗺️ ${mapData.name}`;

        // Log
        this.addLog(`Você entrou em: ${mapData.name}`, 'system');

        this.isMoving = false;
        this.isTransitioning = false;
        this.cameras.main.fadeIn(400, 0, 0, 0);
    });
}

createMapForCurrentWorld(mapData) {
    const baseData = [];
    for (let y = 0; y < this.mapHeight; y++) {
        baseData.push(new Array(this.mapWidth).fill(mapData.baseTile));
    }

    const baseMap = this.make.tilemap({
        data: baseData,
        tileWidth: this.gridSize,
        tileHeight: this.gridSize
    });
    const baseTileset = baseMap.addTilesetImage('terrain');
    this.baseLayer = baseMap.createLayer(0, baseTileset, 0, 0);
    this.baseLayer.setDepth(0);
}

placeHoles(mapData) {
    if (!mapData.holes) return;

    mapData.holes.forEach(hole => {
        const worldX = hole.x * this.gridSize + this.gridSize / 2;
        const worldY = hole.y * this.gridSize + this.gridSize / 2;

        // Buraco escuro
        const holeGfx = this.add.graphics();
        holeGfx.setDepth(2);

        // Círculo preto
        holeGfx.fillStyle(0x000000, 0.9);
        holeGfx.fillCircle(worldX, worldY, 14);

        // Borda escura
        holeGfx.fillStyle(0x1a0a00, 0.8);
        holeGfx.fillCircle(worldX, worldY, 16);

        // Brilho sutil ao redor
        holeGfx.lineStyle(1, 0x8b6914, 0.4);
        holeGfx.strokeCircle(worldX, worldY, 17);

        this.holeSprites.push(holeGfx);

        // Texto indicativo
        const holeText = this.add.text(worldX, worldY - 22, '⬇️', {
            fontSize: '14px'
        }).setOrigin(0.5).setDepth(10000);

        this.holeSprites.push(holeText);

        // Animação de pulsar
        this.tweens.add({
            targets: holeText,
            y: worldY - 26,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    });
}

checkHoleCollision() {
    if (this.isTransitioning) return;

    const mapData = MAPS[this.currentMapId];
    if (!mapData || !mapData.holes) return;

    mapData.holes.forEach(hole => {
        if (this.playerGridX === hole.x && this.playerGridY === hole.y) {
            this.loadMap(hole.target, hole.spawnX, hole.spawnY);
        }
    });
}

spawnMonstersForMap(mapData) {
    if (!mapData.monsters) return;

    const rng = new Phaser.Math.RandomDataGenerator([`monsters_${this.currentMapId}`]);

    Object.entries(mapData.monsters).forEach(([type, count]) => {
        const def = MONSTER_DEFS[type];
        if (!def) return;

        let spawned = 0;
        let attempts = 0;

        while (spawned < count && attempts < 300) {
            attempts++;
            const gx = rng.integerInRange(3, this.mapWidth - 4);
            const gy = rng.integerInRange(3, this.mapHeight - 4);

            if (Math.abs(gx - this.playerGridX) < MAP_CONFIG.safeRadius &&
                Math.abs(gy - this.playerGridY) < MAP_CONFIG.safeRadius) continue;
            if (this.collisionMap[gy][gx]) continue;
            if (this.isMonsterAt(gx, gy)) continue;

            this.createMonster(type, gx, gy);
            spawned++;
        }
    });
}

    generateDirtPaths() {
        const rng = new Phaser.Math.RandomDataGenerator(['paths2026']);
        const cx = Math.floor(this.mapWidth / 2);
        const cy = Math.floor(this.mapHeight / 2);

        let pathY = cy;
        for (let x = 5; x < this.mapWidth - 5; x++) {
            pathY += rng.integerInRange(-1, 1);
            pathY = Phaser.Math.Clamp(pathY, 10, this.mapHeight - 10);
            for (let dy = 0; dy < 2; dy++) {
                const ty = pathY + dy;
                if (ty >= 0 && ty < this.mapHeight) this.dirtMap[ty][x] = true;
            }
        }

        let pathX = cx;
        for (let y = 5; y < this.mapHeight - 5; y++) {
            pathX += rng.integerInRange(-1, 1);
            pathX = Phaser.Math.Clamp(pathX, 10, this.mapWidth - 10);
            for (let dx = 0; dx < 2; dx++) {
                const tx = pathX + dx;
                if (tx >= 0 && tx < this.mapWidth) this.dirtMap[y][tx] = true;
            }
        }

        // Praça central
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const tx = cx + dx;
                const ty = cy + dy;
                if (tx >= 0 && tx < this.mapWidth && ty >= 0 && ty < this.mapHeight) {
                    this.dirtMap[ty][tx] = true;
                }
            }
        }
    }


    isDirt(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) return false;
        return this.dirtMap[y][x];
    }

    calculateTransitions() {
        const T = MAP_CONFIG.tiles;

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.dirtMap[y][x]) { this.overlayData[y][x] = T.DIRT; continue; }

                const dN = this.isDirt(x, y - 1);
                const dS = this.isDirt(x, y + 1);
                const dW = this.isDirt(x - 1, y);
                const dE = this.isDirt(x + 1, y);
                const dNW = this.isDirt(x - 1, y - 1);
                const dNE = this.isDirt(x + 1, y - 1);
                const dSW = this.isDirt(x - 1, y + 1);
                const dSE = this.isDirt(x + 1, y + 1);

                if (dS && !dN && !dW && !dE) this.overlayData[y][x] = T.DIRT_TOP;
                else if (dN && !dS && !dW && !dE) this.overlayData[y][x] = T.DIRT_BOTTOM;
                else if (dE && !dW && !dN && !dS) this.overlayData[y][x] = T.DIRT_LEFT;
                else if (dW && !dE && !dN && !dS) this.overlayData[y][x] = T.DIRT_RIGHT;
                else if (dS && dE && !dN && !dW) this.overlayData[y][x] = T.DIRT_NW;
                else if (dS && dW && !dN && !dE) this.overlayData[y][x] = T.DIRT_NE;
                else if (dN && dE && !dS && !dW) this.overlayData[y][x] = T.DIRT_SW;
                else if (dN && dW && !dS && !dE) this.overlayData[y][x] = T.DIRT_SE;
                else if (!dN && !dS && !dW && !dE) {
                    if (dSE) this.overlayData[y][x] = T.DIRT_NW;
                    else if (dSW) this.overlayData[y][x] = T.DIRT_NE;
                    else if (dNE) this.overlayData[y][x] = T.DIRT_SW;
                    else if (dNW) this.overlayData[y][x] = T.DIRT_SE;
                }
            }
        }
    }

    // ══════════════════════════════════════
    // PROPS
    // ══════════════════════════════════════

    placeProps() {
        const rng = new Phaser.Math.RandomDataGenerator(['elysium2026']);
        const bigTrees = ['tree_orange', 'tree_blue', 'tree_yellow', 'tree_pine'];
        const smallTrees = ['tree_sm_orange', 'tree_sm_blue', 'tree_sm_green', 'tree_sm_yellow'];
        const allTrees = [...bigTrees, ...smallTrees];
        const bushTypes = [
            'bush_green_lg', 'bush_green_sm', 'bush_yellow_lg', 'bush_yellow_sm',
            'bush_orange_lg', 'bush_orange_sm', 'bush_blue_lg', 'bush_blue_sm', 'bush_red_lg'
        ];

        for (let c = 0; c < 12; c++) {
            const cx = rng.integerInRange(5, this.mapWidth - 6);
            const cy = rng.integerInRange(5, this.mapHeight - 6);
            if (this.isNearSpawn(cx, cy)) continue;
            for (let t = 0; t < rng.integerInRange(3, 6); t++) {
                const tx = cx + rng.integerInRange(-3, 3);
                const ty = cy + rng.integerInRange(-3, 3);
                if (!this.isValidPropPos(tx, ty)) continue;
                this.placeObject(tx, ty, rng.frac() < 0.6 ? rng.pick(bigTrees) : rng.pick(smallTrees));
            }
            for (let b = 0; b < rng.integerInRange(2, 4); b++) {
                const bx = cx + rng.integerInRange(-4, 4);
                const by = cy + rng.integerInRange(-4, 4);
                if (!this.isValidPropPos(bx, by)) continue;
                this.placeObject(bx, by, rng.pick(bushTypes));
            }
        }

        for (let i = 0; i < 25; i++) {
            const x = rng.integerInRange(2, this.mapWidth - 3);
            const y = rng.integerInRange(2, this.mapHeight - 3);
            if (!this.isValidPropPos(x, y) || this.isNearSpawn(x, y)) continue;
            this.placeObject(x, y, rng.pick(allTrees));
        }

        for (let i = 0; i < 30; i++) {
            const x = rng.integerInRange(1, this.mapWidth - 2);
            const y = rng.integerInRange(1, this.mapHeight - 2);
            if (!this.isValidPropPos(x, y) || this.isNearSpawn(x, y)) continue;
            this.placeObject(x, y, rng.pick(bushTypes));
        }

        for (let i = 0; i < 15; i++) {
            const x = rng.integerInRange(2, this.mapWidth - 3);
            const y = rng.integerInRange(2, this.mapHeight - 3);
            if (!this.isValidPropPos(x, y) || this.isNearSpawn(x, y)) continue;
            this.placeObject(x, y, rng.frac() < 0.4 ? 'rock_large' : 'rock_small');
        }

        for (let i = 0; i < 10; i++) {
            const x = rng.integerInRange(2, this.mapWidth - 3);
            const y = rng.integerInRange(2, this.mapHeight - 3);
            if (!this.isValidPropPos(x, y) || this.isNearSpawn(x, y)) continue;
            this.placeObject(x, y, rng.frac() < 0.5 ? 'stump_1' : 'stump_2');
        }
    }

    
    isNearSpawn(gx, gy) {
        return Math.abs(gx - this.playerGridX) < MAP_CONFIG.safeRadius &&
            Math.abs(gy - this.playerGridY) < MAP_CONFIG.safeRadius;
    }


    isValidPropPos(gx, gy) {
        if (gx < 1 || gx >= this.mapWidth - 1) return false;
        if (gy < 1 || gy >= this.mapHeight - 1) return false;
        if (this.collisionMap[gy][gx]) return false;
        if (this.dirtMap[gy][gx]) return false;
        if (this.overlayData[gy][gx] !== MAP_CONFIG.tiles.EMPTY) return false;
        return true;
    }

    placeObject(gridX, gridY, propName) {
        const def = PROP_DEFS[propName];
        if (!def) return;
        const worldX = gridX * this.gridSize + this.gridSize / 2;
        const worldY = gridY * this.gridSize + this.gridSize / 2;
        const sprite = this.add.image(worldX, worldY, 'props-sheet', propName);
        sprite.setOrigin(0.5, 0.85);
        sprite.setDepth(worldY);
        this.propSprites.push(sprite);
        this.propPositions.push({ gridX, gridY, type: propName });
        if (def.blocking) this.collisionMap[gridY][gridX] = true;
    }

    // ══════════════════════════════════════
    // MONSTERS
    // ══════════════════════════════════════

    
spawnMonsters() {
    const mapData = MAPS[this.currentMapId];
    this.spawnMonstersForMap(mapData);
}

    isMonsterAt(gx, gy) {
        return this.monsters.some(m => m.gridX === gx && m.gridY === gy && m.alive);
    }

    createMonster(type, gridX, gridY) {
        const def = MONSTER_DEFS[type];
        const worldX = gridX * this.gridSize + this.gridSize / 2;
        const worldY = gridY * this.gridSize + this.gridSize / 2;

        const sprite = this.add.sprite(worldX, worldY, `${type}_south_0`);
        sprite.setScale(def.scale);
        sprite.setDepth(worldY);
        sprite.setInteractive({ useHandCursor: true });
        sprite.play(`${type}_walk_south`);

        const nameText = this.add.text(worldX, worldY - 38, def.name, {
            fontFamily: 'MedievalSharp, cursive',
            fontSize: '10px',
            color: '#ffaaaa',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 1).setDepth(10000);

        const hpBar = this.add.graphics().setDepth(10000);

        const monster = {
            type, def, sprite, nameText, hpBar,
            gridX, gridY,
            currentHp: def.maxHp,
            maxHp: def.maxHp,
            isMoving: false,
            facing: 'south',
            alive: true,
            lastAttackTime: 0,
        };

        // Click pra targetar
        sprite.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            this.setTarget(monster);
        });

        this.drawMonsterHpBar(monster);
        this.monsters.push(monster);
    }

    drawMonsterHpBar(monster) {
    if (!monster.alive || !monster.sprite || !monster.hpBar) return;

    const g = monster.hpBar;
    const px = monster.sprite.x;
    const py = monster.sprite.y;
    const barW = 28;
    const barH = 3;
    const barX = px - barW / 2;
    const barY = py - 34;

    g.clear();
    g.fillStyle(0x550000, 0.8);
    g.fillRect(barX, barY, barW, barH);

    const pct = monster.currentHp / monster.maxHp;
    const color = pct > 0.5 ? 0x22cc22 : pct > 0.25 ? 0xcccc22 : 0xcc2222;
    g.fillStyle(color, 1);
    g.fillRect(barX, barY, barW * pct, barH);

    g.lineStyle(1, 0x000000, 0.8);
    g.strokeRect(barX, barY, barW, barH);
}

    // ══════════════════════════════════════
    // TARGETING & COMBAT
    // ══════════════════════════════════════

    handleWorldClick(pointer) {
        // Converte posição do clique para grid
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const gx = Math.floor(worldPoint.x / this.gridSize);
        const gy = Math.floor(worldPoint.y / this.gridSize);

        // Verifica se clicou em algum monstro (por grid)
        const clickedMonster = this.monsters.find(m =>
            m.alive && m.gridX === gx && m.gridY === gy
        );

        if (clickedMonster) {
            this.setTarget(clickedMonster);
        } else {
            this.clearTarget();
        }
    }

    setTarget(monster) {
        if (!monster.alive) return;
        this.targetMonster = monster;
        this.isChasing = true;
    }

    clearTarget() {
        this.targetMonster = null;
        this.isChasing = false;
        this.targetIndicator.clear();
    }

    drawTargetIndicator() {
        this.targetIndicator.clear();

        if (!this.targetMonster || !this.targetMonster.alive) {
            this.targetIndicator.clear();
            return;
        }

        const m = this.targetMonster;
        const px = m.sprite.x;
        const py = m.sprite.y;
        const size = 22;

        // Quadrado vermelho pulsante ao redor do monstro
        const pulse = 0.6 + Math.sin(this.time.now / 200) * 0.4;

        this.targetIndicator.lineStyle(2, 0xff0000, pulse);
        this.targetIndicator.strokeRect(
            px - size, py - size,
            size * 2, size * 2
        );

        // Cantos destacados
        const corner = 6;
        this.targetIndicator.lineStyle(2, 0xff4444, 1);

        // Top-left
        this.targetIndicator.beginPath();
        this.targetIndicator.moveTo(px - size, py - size + corner);
        this.targetIndicator.lineTo(px - size, py - size);
        this.targetIndicator.lineTo(px - size + corner, py - size);
        this.targetIndicator.strokePath();

        // Top-right
        this.targetIndicator.beginPath();
        this.targetIndicator.moveTo(px + size - corner, py - size);
        this.targetIndicator.lineTo(px + size, py - size);
        this.targetIndicator.lineTo(px + size, py - size + corner);
        this.targetIndicator.strokePath();

        // Bottom-left
        this.targetIndicator.beginPath();
        this.targetIndicator.moveTo(px - size, py + size - corner);
        this.targetIndicator.lineTo(px - size, py + size);
        this.targetIndicator.lineTo(px - size + corner, py + size);
        this.targetIndicator.strokePath();

        // Bottom-right
        this.targetIndicator.beginPath();
        this.targetIndicator.moveTo(px + size - corner, py + size);
        this.targetIndicator.lineTo(px + size, py + size);
        this.targetIndicator.lineTo(px + size, py + size - corner);
        this.targetIndicator.strokePath();
    }

    getGridDistance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    
    isAdjacent(x1, y1, x2, y2) {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        // Chebyshev distance = 1 (inclui diagonal)
        return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
    }

    getDirectionTo(fromX, fromY, toX, toY) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        if (Math.abs(dx) >= Math.abs(dy)) {
            return dx > 0 ? 'east' : 'west';
        }
        return dy > 0 ? 'south' : 'north';
    }

    canPlayerMoveTo(gx, gy) {
        if (gx < 0 || gx >= this.mapWidth) return false;
        if (gy < 0 || gy >= this.mapHeight) return false;
        if (this.collisionMap[gy][gx]) return false;
        if (this.isMonsterAt(gx, gy)) return false;
        return true;
    }

    // Player chases target monster
    chaseTarget() {
    if (!this.targetMonster || !this.targetMonster.alive) {
        this.clearTarget();
        return;
    }

    if (this.isMoving) return;

    const m = this.targetMonster;

    // Se já está adjacente, PARA e ataca — não move
    if (this.isAdjacent(this.playerGridX, this.playerGridY, m.gridX, m.gridY)) {
        if (this.player.anims.isPlaying) {
            this.player.anims.stop();
        }
        const dir = this.getDirectionTo(this.playerGridX, this.playerGridY, m.gridX, m.gridY);
        this.facing = dir;
        this.player.setTexture(`player_${this.facing}_0`);

        this.playerAttack();
        return;
    }

    // Calcula distância — se está a 2+ tiles, move. Se está a 1, já é adjacente (tratado acima)
    const dx = m.gridX - this.playerGridX;
    const dy = m.gridY - this.playerGridY;

    // Tenta eixo principal
    if (Math.abs(dx) >= Math.abs(dy)) {
        const stepX = dx > 0 ? 1 : -1;
        const newX = this.playerGridX + stepX;
        const direction = stepX > 0 ? 'east' : 'west';

        // Só move se o destino NÃO é o tile do monstro
        if (!(newX === m.gridX && this.playerGridY === m.gridY) && this.canPlayerMoveTo(newX, this.playerGridY)) {
            this.movePlayer(stepX, 0, direction);
            return;
        }

        // Tenta eixo alternativo
        if (dy !== 0) {
            const stepY = dy > 0 ? 1 : -1;
            const newY = this.playerGridY + stepY;
            const dirAlt = stepY > 0 ? 'south' : 'north';

            if (!(this.playerGridX === m.gridX && newY === m.gridY) && this.canPlayerMoveTo(this.playerGridX, newY)) {
                this.movePlayer(0, stepY, dirAlt);
                return;
            }
        }
    } else {
        const stepY = dy > 0 ? 1 : -1;
        const newY = this.playerGridY + stepY;
        const direction = stepY > 0 ? 'south' : 'north';

        if (!(this.playerGridX === m.gridX && newY === m.gridY) && this.canPlayerMoveTo(this.playerGridX, newY)) {
            this.movePlayer(0, stepY, direction);
            return;
        }

        // Tenta eixo alternativo
        if (dx !== 0) {
            const stepX = dx > 0 ? 1 : -1;
            const newX = this.playerGridX + stepX;
            const dirAlt = stepX > 0 ? 'east' : 'west';

            if (!(newX === m.gridX && this.playerGridY === m.gridY) && this.canPlayerMoveTo(newX, this.playerGridY)) {
                this.movePlayer(stepX, 0, dirAlt);
                return;
            }
        }
    }
}

    playerAttack() {
    const now = this.time.now;
    if (now - this.lastPlayerAttackTime < PLAYER_STATS.attackSpeed) return;
    if (!this.targetMonster || !this.targetMonster.alive) return;

    this.lastPlayerAttackTime = now;

    const m = this.targetMonster;
    const skillBonus = this.getSkillDamageBonus();
    const variance = Phaser.Math.Between(-3, 3);
    const damage = Math.max(1, this.getPlayerAttack() + skillBonus - m.def.defense + variance);

    m.currentHp -= damage;
    this.drawMonsterHpBar(m);

    m.sprite.setTint(0xff0000);
    this.time.delayedCall(150, () => {
        if (m.alive && m.sprite) m.sprite.clearTint();
    });

    this.showDamageText(m.sprite.x, m.sprite.y - 20, damage, '#ffff00');

    // Log de combate
    this.addLog(`Você atacou ${m.def.name} por ${damage} de dano.`, 'combat');

    // Ganha skill EXP
    const skillType = this.getActiveSkillType();
    const skillExpGain = Math.floor(Phaser.Math.Between(3, 6) * SERVER_CONFIG.skillRate);
    this.gainSkillExp(skillType, skillExpGain);


    if (m.currentHp <= 0) {
        this.killMonster(m);
    }
}

    monsterAttackPlayer(monster) {
    const now = this.time.now;
    if (now - monster.lastAttackTime < monster.def.attackSpeed) return;

    monster.lastAttackTime = now;

    const variance = Phaser.Math.Between(-2, 2);
    const damage = Math.max(1, monster.def.attack - this.getPlayerDefense() + variance);

    this.currentHp = Math.max(0, this.currentHp - damage);
    this.updatePanelBars();

    this.player.setTint(0xff0000);
    this.time.delayedCall(150, () => {
        this.player.clearTint();
    });

    this.showDamageText(this.player.x, this.player.y - 30, damage, '#ff4444');

    // Log
    this.addLog(`${monster.def.name} te atacou por ${damage} de dano.`, 'damage-taken');

    if (this.currentHp <= 0) {
        this.playerDeath();
    }
}

    showDamageText(x, y, damage, color) {
        const text = this.add.text(x, y, `-${damage}`, {
            fontFamily: 'MedievalSharp, cursive',
            fontSize: '14px',
            color: color,
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(20000);

        this.tweens.add({
            targets: text,
            y: y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

killMonster(monster) {
    monster.alive = false;

    this.tweens.killTweensOf(monster.sprite);
    monster.isMoving = false;

    if (monster.sprite.anims) {
        monster.sprite.anims.stop();
    }

    // EXP
const expGain = Math.floor(monster.def.exp * SERVER_CONFIG.expRate);
this.currentExp += expGain;
this.totalExp += expGain;

// Log
this.addLog(`Você matou ${monster.def.name}!`, 'combat');
this.addLog(`+${expGain} EXP`, 'exp');

// Level up — LOOP para múltiplos levels
let leveled = false;
while (this.currentExp >= this.getExpToNextLevel()) {
    this.currentExp -= this.getExpToNextLevel();
    this.playerLevel++;
    this.maxHp += 15;
    this.maxMana += 8;
    leveled = true;

    this.addLog(`LEVEL UP! Você alcançou o level ${this.playerLevel}!`, 'levelup');
}

if (leveled) {
    this.currentHp = this.maxHp;
    this.currentMana = this.maxMana;
    this.showDamageText(this.player.x, this.player.y - 50, `LEVEL ${this.playerLevel}!`, '#ffd700');
}

this.updateAllDisplays();

    this.showDamageText(monster.sprite.x, monster.sprite.y - 10, `+${expGain} EXP`, '#44ff44');

    // Gera loot
    this.generateLoot(monster);

    // Fade out
    const spriteRef = monster.sprite;
    const nameRef = monster.nameText;
    const hpRef = monster.hpBar;

    hpRef.clear();

    this.tweens.add({
        targets: [spriteRef, nameRef],
        alpha: 0,
        duration: 500,
        onComplete: () => {
            if (spriteRef && spriteRef.active) spriteRef.destroy();
            if (nameRef && nameRef.active) nameRef.destroy();
            if (hpRef && hpRef.active) hpRef.destroy();
        }
    });

    monster.sprite = null;
    monster.nameText = null;
    monster.hpBar = null;

    if (this.targetMonster === monster) {
        this.clearTarget();
    }

    this.time.delayedCall(15000, () => {
        this.respawnMonster(monster.type);
    });
}

// ══════════════════════════════════════
// LOOT SYSTEM
// ══════════════════════════════════════

generateLoot(monster) {
    const lootTable = LOOT_TABLES[monster.type];
    if (!lootTable) return;

    const drops = [];
    lootTable.forEach(entry => {
        if (Math.random() < entry.chance) {
            drops.push(entry.item);
        }
    });

    if (drops.length === 0) {
        this.addLog(`${monster.def.name} não dropou nada.`, 'system');
        return;
    }

    
if (!this.lootWindowOpen) {
    this.lootWindowOpen = true;
    const bagWindow = document.getElementById('bag-window');
    if (bagWindow) bagWindow.style.display = 'block';
    const btnBag = document.getElementById('btn-bag');
    if (btnBag) btnBag.classList.add('active');
}


    drops.forEach(itemId => {
        this.addToLootBag(itemId);
        const item = ITEMS[itemId];
        if (item) {
            this.addLog(`Loot: ${item.icon} ${item.name}`, 'loot');
        }
    });

    this.renderLootSlots();
    if (this.renderHotbar) this.renderHotbar();
}

addToLootBag(itemId) {
    const item = ITEMS[itemId];
    if (!item) return;

    // Se stackable, tenta achar slot existente
    if (item.stackable) {
        const existing = this.lootSlots.find(s => s && s.id === itemId);
        if (existing) {
            existing.qty++;
            return;
        }
    }

    // Procura slot vazio
    const emptyIndex = this.lootSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
        this.lootSlots[emptyIndex] = { id: itemId, qty: 1 };
    } else {
        // Bag cheia — expande (adiciona slot)
        this.lootSlots.push({ id: itemId, qty: 1 });
    }
}

renderLootSlots() {
    
    
const lootGrid = document.getElementById('loot-grid');
    if (!lootGrid) return;


    let html = '';
    const minSlots = Math.max(6, this.lootSlots.length);

    for (let i = 0; i < minSlots; i++) {
        const slot = this.lootSlots[i] || null;

        if (slot) {
            const item = ITEMS[slot.id];
            const qtyLabel = slot.qty > 1 ? `<span class="loot-qty">${slot.qty}</span>` : '';
            const isEquip = item.type !== 'potion';

            html += `
                <div class="loot-slot filled" data-index="${i}" title="${item.name}">
                    <span class="loot-item-icon">${item.icon}</span>
                    ${qtyLabel}
                </div>
            `;
        } else {
            html += `<div class="loot-slot empty" data-index="${i}"></div>`;
        }
    }

    lootGrid.innerHTML = html;

    // Adiciona event listeners nos slots com item
    lootGrid.querySelectorAll('.loot-slot.filled').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.dataset.index);
            this.useLootSlot(index);
        });
    });
}

useLootSlot(index) {
    const slot = this.lootSlots[index];
    if (!slot) return;

    const item = ITEMS[slot.id];
    if (!item) return;

    this.hideTooltip();  // ← adicione aqui

    if (item.type === 'potion') {
        this.usePotion(item, index);
    } else {
        this.equipItem(item, index);
    }
}

usePotion(item, slotIndex) {
    if (item.effect === 'hp') {
        const before = this.currentHp;
        this.currentHp = Math.min(this.maxHp, this.currentHp + item.value);
        const healed = this.currentHp - before;
        if (healed > 0) {
            this.showDamageText(this.player.x, this.player.y - 30, `+${healed} HP`, '#44ff44');
            this.addLog(`Usou ${item.icon} ${item.name}: +${healed} HP`, 'heal');
        }
    } else if (item.effect === 'mana') {
        const before = this.currentMana;
        this.currentMana = Math.min(this.maxMana, this.currentMana + item.value);
        const restored = this.currentMana - before;
        if (restored > 0) {
            this.showDamageText(this.player.x, this.player.y - 30, `+${restored} Mana`, '#4488ff');
            this.addLog(`Usou ${item.icon} ${item.name}: +${restored} Mana`, 'heal');
        }
    }

    this.updatePanelBars();

    const slot = this.lootSlots[slotIndex];
    slot.qty--;
    if (slot.qty <= 0) {
        this.lootSlots[slotIndex] = null;
    }

    this.renderLootSlots();
    if (this.renderHotbar) this.renderHotbar();
}

equipItem(item, slotIndex) {
    const targetSlot = item.slot;
    if (!targetSlot) return;

    // Se já tem algo equipado, devolve pra bag
    const currentEquip = this.equipment[targetSlot];
    if (currentEquip && currentEquip.id) {
        this.addToLootBag(currentEquip.id);
    }

    // Equipa o item
    this.equipment[targetSlot] = { id: this.lootSlots[slotIndex].id, ...item };

    // Remove da bag
    this.lootSlots[slotIndex] = null;

    // Atualiza visual do slot de equipamento
    this.updateEquipmentSlots();
    this.renderLootSlots();

    
this.showDamageText(this.player.x, this.player.y - 30, `${item.name} equipped!`, '#d4a017');
this.addLog(`Equipou ${item.icon} ${item.name}`, 'equip');

}

getPlayerAttack() {
    let bonus = 0;
    Object.values(this.equipment).forEach(eq => {
        if (eq && eq.attack) bonus += eq.attack;
    });
    return PLAYER_STATS.baseAttack + bonus;
}

getPlayerDefense() {
    let bonus = 0;
    Object.values(this.equipment).forEach(eq => {
        if (eq && eq.defense) bonus += eq.defense;
    });
    return PLAYER_STATS.baseDefense + bonus;
}

updateEquipmentSlots() {
    const slots = ['necklace', 'helmet', 'backpack', 'weapon', 'armor', 'shield', 'ring', 'legs', 'utilities', 'boots'];

    const defaultIcons = {
        necklace: '📿', helmet: '⛑️', weapon: '⚔️', armor: '🦺', backpack: '🎒',
        shield: '🔰', ring: '💍', legs: '👖', utilities: '🧪', boots: '🥾'
    };

    slots.forEach(slotName => {
        const el = document.querySelector(`.equip-slot[data-slot="${slotName}"]`);
        if (!el) return;

        const eq = this.equipment[slotName];

        if (eq && eq.icon && slotName !== 'backpack') {
            el.classList.add('equipped');
            el.querySelector('.slot-icon').textContent = eq.icon;
            el.title = '';

            el.onclick = () => {
                this.unequipItem(slotName);
            };
        } else if (slotName !== 'backpack') {
            el.classList.remove('equipped');
            el.querySelector('.slot-icon').textContent = defaultIcons[slotName] || '❓';
            el.title = slotName;
            el.onclick = null;
        }
    });
}

unequipItem(slotName) {
    this.hideTooltip();
    const eq = this.equipment[slotName];
    if (!eq || !eq.id) return;

    // Devolve pra bag
    this.addToLootBag(eq.id);

    // Limpa slot
    
    const defaultIcons = {
        necklace: '📿', helmet: '⛑️', weapon: '⚔️', armor: '🦺',
        shield: '🔰', ring: '💍', legs: '👖', utilities: '🧪', boots: '🥾'
    };
    const defaultNames = {
        necklace: 'Colar', helmet: 'Capacete', weapon: 'Arma', armor: 'Armadura',
        shield: 'Escudo', ring: 'Anel', legs: 'Calças', utilities: 'Utensílios', boots: 'Botas'
    };

    this.equipment[slotName] = null;

    const el = document.querySelector(`.equip-slot[data-slot="${slotName}"]`);
    if (el) {
        el.classList.remove('equipped');
        el.querySelector('.slot-icon').textContent = defaultIcons[slotName] || '❓';
        el.querySelector('.slot-label').textContent = defaultNames[slotName] || slotName;
        el.onclick = null;
    }

    this.renderLootSlots();
    
this.showDamageText(this.player.x, this.player.y - 30, 'Unequipped!', '#aaaaaa');
this.addLog(`Desequipou ${defaultNames[slotName]}`, 'equip');

}

    respawnMonster(type) {
        const rng = new Phaser.Math.RandomDataGenerator();
        let attempts = 0;

        while (attempts < 100) {
            attempts++;
            const gx = rng.integerInRange(3, this.mapWidth - 4);
            const gy = rng.integerInRange(3, this.mapHeight - 4);

            if (Math.abs(gx - this.playerGridX) < MAP_CONFIG.safeRadius &&
                Math.abs(gy - this.playerGridY) < MAP_CONFIG.safeRadius) continue;
            if (this.collisionMap[gy][gx]) continue;
            if (this.isMonsterAt(gx, gy)) continue;

            this.monsters = this.monsters.filter(m => m.alive);
            this.createMonster(type, gx, gy);
            break;
        }
    }

    playerDeath() {
    this.currentHp = this.maxHp;
    this.currentMana = this.maxMana;
    this.clearTarget();

    this.addLog('Você morreu! Respawnando na cidade...', 'death');

    // Se está em outro mapa, volta pro overworld
    if (this.currentMapId !== 'overworld') {
        this.loadMap('overworld', MAPS.overworld.spawnX, MAPS.overworld.spawnY);
        return;
    }

    // Já está no overworld — só teleporta pro spawn
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
        this.playerGridX = MAPS.overworld.spawnX;
        this.playerGridY = MAPS.overworld.spawnY;
        const startX = this.playerGridX * this.gridSize + this.gridSize / 2;
        const startY = this.playerGridY * this.gridSize + this.gridSize / 2;
        this.player.setPosition(startX, startY);
        this.isMoving = false;

        this.updateAllDisplays();
        this.drawMinimap();
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.showDamageText(this.player.x, this.player.y - 50, 'YOU DIED!', '#ff0000');
    });
}

    // ══════════════════════════════════════
    // MONSTER AI
    // ══════════════════════════════════════

    monsterAI() {
    this.monsters.forEach(monster => {
        if (!monster.alive || monster.isMoving || !monster.sprite) return;

        const dist = this.getGridDistance(
            monster.gridX, monster.gridY,
            this.playerGridX, this.playerGridY
        );

        const adjacent = this.isAdjacent(
            monster.gridX, monster.gridY,
            this.playerGridX, this.playerGridY
        );

        if (adjacent) {
            // Vira pro player
            const dir = this.getDirectionTo(monster.gridX, monster.gridY, this.playerGridX, this.playerGridY);
            monster.facing = dir;
            monster.sprite.setTexture(`${monster.type}_${dir}_0`);

            // Ataca
            this.monsterAttackPlayer(monster);

            // 25% chance de circular ao redor do player
            if (Phaser.Math.Between(1, 100) <= 25) {
                this.circlePlayer(monster);
            }
            return;
        }

        // Se está dentro do aggro range → persegue
        if (dist <= monster.def.aggroRange) {
            this.chasePlayer(monster);
            return;
        }

        // Fora do aggro → wander aleatório
        if (Phaser.Math.Between(1, 100) <= 30) {
            this.wanderMonster(monster);
        }
    });
}

    chasePlayer(monster) {
    if (monster.isMoving) return;

    const dx = this.playerGridX - monster.gridX;
    const dy = this.playerGridY - monster.gridY;

    // Tenta eixo principal primeiro (sem diagonal)
    if (Math.abs(dx) >= Math.abs(dy)) {
        // Tenta horizontal
        const moveDx = dx > 0 ? 1 : -1;
        const newX = monster.gridX + moveDx;
        const dir = moveDx > 0 ? 'east' : 'west';

        if (this.canMonsterMoveTo(newX, monster.gridY)) {
            this.moveMonster(monster, newX, monster.gridY, dir);
            return;
        }

        // Horizontal bloqueado — tenta vertical
        if (dy !== 0) {
            const moveDy = dy > 0 ? 1 : -1;
            const newY = monster.gridY + moveDy;
            const dirAlt = moveDy > 0 ? 'south' : 'north';

            if (this.canMonsterMoveTo(monster.gridX, newY)) {
                this.moveMonster(monster, monster.gridX, newY, dirAlt);
                return;
            }
        }
    } else {
        // Tenta vertical
        const moveDy = dy > 0 ? 1 : -1;
        const newY = monster.gridY + moveDy;
        const dir = moveDy > 0 ? 'south' : 'north';

        if (this.canMonsterMoveTo(monster.gridX, newY)) {
            this.moveMonster(monster, monster.gridX, newY, dir);
            return;
        }

        // Vertical bloqueado — tenta horizontal
        if (dx !== 0) {
            const moveDx = dx > 0 ? 1 : -1;
            const newX = monster.gridX + moveDx;
            const dirAlt = moveDx > 0 ? 'east' : 'west';

            if (this.canMonsterMoveTo(newX, monster.gridY)) {
                this.moveMonster(monster, newX, monster.gridY, dirAlt);
                return;
            }
        }
    }
}

circlePlayer(monster) {
    if (monster.isMoving) return;

    const px = this.playerGridX;
    const py = this.playerGridY;

    // Todos os tiles adjacentes ao player (incluindo diagonais)
    const adjacentTiles = [
        { gx: px - 1, gy: py - 1 },
        { gx: px,     gy: py - 1 },
        { gx: px + 1, gy: py - 1 },
        { gx: px - 1, gy: py     },
        { gx: px + 1, gy: py     },
        { gx: px - 1, gy: py + 1 },
        { gx: px,     gy: py + 1 },
        { gx: px + 1, gy: py + 1 },
    ];

    // Filtra destinos válidos (não onde já está)
    const validDestinations = adjacentTiles.filter(t =>
        (t.gx !== monster.gridX || t.gy !== monster.gridY) &&
        this.canMonsterMoveTo(t.gx, t.gy)
    );

    if (validDestinations.length === 0) return;

    const target = Phaser.Utils.Array.GetRandom(validDestinations);
    const dx = target.gx - monster.gridX;
    const dy = target.gy - monster.gridY;

    // Tenta mover em CARDINAL primeiro (1 eixo por vez)
    // Prioriza horizontal
    if (dx !== 0) {
        const stepX = monster.gridX + (dx > 0 ? 1 : -1);
        const dir = dx > 0 ? 'east' : 'west';
        if (this.canMonsterMoveTo(stepX, monster.gridY)) {
            this.moveMonster(monster, stepX, monster.gridY, dir);
            return;
        }
    }

    // Tenta vertical
    if (dy !== 0) {
        const stepY = monster.gridY + (dy > 0 ? 1 : -1);
        const dir = dy > 0 ? 'south' : 'north';
        if (this.canMonsterMoveTo(monster.gridX, stepY)) {
            this.moveMonster(monster, monster.gridX, stepY, dir);
            return;
        }
    }

    // Ambos cardinais bloqueados → permite diagonal como fallback
    if (dx !== 0 && dy !== 0) {
        const diagX = monster.gridX + (dx > 0 ? 1 : -1);
        const diagY = monster.gridY + (dy > 0 ? 1 : -1);
        const dir = this.getDirectionTo(monster.gridX, monster.gridY, diagX, diagY);
        if (this.canMonsterMoveTo(diagX, diagY)) {
            this.moveMonster(monster, diagX, diagY, dir);
        }
    }
}

    wanderMonster(monster) {
        const dirs = [
            { dx: 0, dy: -1, dir: 'north' },
            { dx: 0, dy: 1,  dir: 'south' },
            { dx: -1, dy: 0, dir: 'west' },
            { dx: 1, dy: 0,  dir: 'east' }
        ];

        const move = Phaser.Utils.Array.GetRandom(dirs);
        const newX = monster.gridX + move.dx;
        const newY = monster.gridY + move.dy;

        if (this.canMonsterMoveTo(newX, newY)) {
            this.moveMonster(monster, newX, newY, move.dir);
        }
    }

    canMonsterMoveTo(gx, gy) {
        if (gx < 1 || gx >= this.mapWidth - 1) return false;
        if (gy < 1 || gy >= this.mapHeight - 1) return false;
        if (this.collisionMap[gy][gx]) return false;
        if (this.isMonsterAt(gx, gy)) return false;
        if (gx === this.playerGridX && gy === this.playerGridY) return false;
        return true;
    }

    moveMonster(monster, newX, newY, dir) {
    monster.isMoving = true;
    monster.facing = dir;
    monster.sprite.play(`${monster.type}_walk_${dir}`, true);

    const targetX = newX * this.gridSize + this.gridSize / 2;
    const targetY = newY * this.gridSize + this.gridSize / 2;

    this.tweens.add({
        targets: monster.sprite,
        x: targetX,
        y: targetY,
        duration: 600,
        ease: 'Linear',
        onUpdate: () => {
            // Safety check — monstro pode ter morrido durante o tween
            if (!monster.alive || !monster.sprite || !monster.nameText) return;

            monster.nameText.setPosition(monster.sprite.x, monster.sprite.y - 38);
            monster.sprite.setDepth(monster.sprite.y);
            this.drawMonsterHpBar(monster);
        },
        onComplete: () => {
            if (!monster.alive || !monster.sprite) return;

            monster.gridX = newX;
            monster.gridY = newY;
            monster.isMoving = false;
            monster.sprite.anims.stop();
            monster.sprite.setTexture(`${monster.type}_${monster.facing}_0`);
        }
    });
}

    getDistanceToPlayer(monster) {
        const dx = monster.gridX - this.playerGridX;
        const dy = monster.gridY - this.playerGridY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    
updateBattleList() {
    const battleListEl = document.getElementById('battle-list');
    if (!battleListEl) return;

    const nearby = this.monsters
        .filter(m => m.alive && this.getDistanceToPlayer(m) <= m.def.aggroRange)
        .sort((a, b) => this.getDistanceToPlayer(a) - this.getDistanceToPlayer(b));

    if (nearby.length === 0) {
        battleListEl.innerHTML = '<div class="battle-empty">Nenhuma criatura.</div>';
        return;
    }

    let html = '';
    nearby.forEach(monster => {
        const hpPct = Math.round((monster.currentHp / monster.maxHp) * 100);
        const hpColor = hpPct > 50 ? '#22cc22' : hpPct > 25 ? '#cccc22' : '#cc2222';
        const isTarget = this.targetMonster === monster;

        html += `
            <div class="battle-entry ${isTarget ? 'battle-targeted' : ''}">
                <div class="battle-sprite-icon ${monster.type}-icon"></div>
                <div class="battle-info">
                    <div class="battle-name">${monster.def.name}</div>
                    <div class="battle-hp-row">
                        <div class="battle-hp-bar">
                            <div class="battle-hp-fill" style="width:${hpPct}%; background:${hpColor};"></div>
                        </div>
                        <div class="battle-hp-pct">${hpPct}%</div>
                    </div>
                </div>
            </div>
        `;
    });

    battleListEl.innerHTML = html;
}


    // ══════════════════════════════════════
    // PLAYER
    // ══════════════════════════════════════

    createPlayer() {
        const startX = this.playerGridX * this.gridSize + this.gridSize / 2;
        const startY = this.playerGridY * this.gridSize + this.gridSize / 2;
        this.player = this.add.sprite(startX, startY, 'player_south_0');
        this.player.setScale(1.4);
        this.player.setDepth(startY);
    }

    createPlayerUI() {
        this.nameText = this.add.text(this.player.x, this.player.y - 42, this.playerName, {
            fontFamily: 'MedievalSharp, cursive',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 1).setDepth(10000);

        this.barsGraphics = this.add.graphics().setDepth(10000);
        this.barConfig = {
            width: 36, height: 4,
            hpColor: 0x22cc22, hpBgColor: 0x550000,
            manaColor: 0x3399ff, manaBgColor: 0x001155,
            borderColor: 0x000000
        };
    }

    drawBars() {
        const g = this.barsGraphics;
        const cfg = this.barConfig;
        const px = this.player.x;
        const py = this.player.y;
        const barX = px - cfg.width / 2;
        const hpY = py - 40;
        const manaY = hpY + cfg.height + 2;

        g.clear();
        g.fillStyle(cfg.hpBgColor, 0.8);
        g.fillRect(barX, hpY, cfg.width, cfg.height);
        g.fillStyle(cfg.hpColor, 1);
        g.fillRect(barX, hpY, cfg.width * (this.currentHp / this.maxHp), cfg.height);
        g.lineStyle(1, cfg.borderColor, 0.8);
        g.strokeRect(barX, hpY, cfg.width, cfg.height);

        g.fillStyle(cfg.manaBgColor, 0.8);
        g.fillRect(barX, manaY, cfg.width, cfg.height);
        g.fillStyle(cfg.manaColor, 1);
        g.fillRect(barX, manaY, cfg.width * (this.currentMana / this.maxMana), cfg.height);
        g.lineStyle(1, cfg.borderColor, 0.8);
        g.strokeRect(barX, manaY, cfg.width, cfg.height);
    }

    // ══════════════════════════════════════
    // PANELS
    // ══════════════════════════════════════

    setupPanels() {
    // HUD
    const hudName = document.getElementById('hud-player-name');
    const hudLevel = document.getElementById('hud-level');
    if (hudName) hudName.textContent = this.playerName;
    if (hudLevel) hudLevel.textContent = `Level ${this.playerLevel} — ${this.playerVocation}`;

    // Floating window toggles
    const btnBag = document.getElementById('btn-bag');
    const btnEquip = document.getElementById('btn-equip');
    const btnStats = document.getElementById('btn-stats');

    if (btnBag) btnBag.addEventListener('click', () => this.toggleWindow('bag-window', btnBag));
    if (btnEquip) btnEquip.addEventListener('click', () => this.toggleWindow('equip-window', btnEquip));
    if (btnStats) btnStats.addEventListener('click', () => this.toggleWindow('stats-window', btnStats));

    // Keyboard shortcuts
    this.input.keyboard.on('keydown-B', () => this.toggleWindow('bag-window', btnBag));
    this.input.keyboard.on('keydown-E', () => this.toggleWindow('equip-window', btnEquip));
    this.input.keyboard.on('keydown-C', () => this.toggleWindow('stats-window', btnStats));

    // Close buttons
    document.querySelectorAll('.window-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const winId = btn.dataset.window;
            const win = document.getElementById(winId);
            if (win) win.style.display = 'none';
            // Deactivate hotbar btn
            document.querySelectorAll('.hotbar-btn').forEach(b => {
                if (this.getWindowForBtn(b) === winId) b.classList.remove('active');
            });
        });
    });

    // Draggable windows
    this.makeDraggable('bag-window');
    this.makeDraggable('equip-window');
    this.makeDraggable('stats-window');

    this.updateAllDisplays();
}

getWindowForBtn(btn) {
    if (btn.id === 'btn-bag') return 'bag-window';
    if (btn.id === 'btn-equip') return 'equip-window';
    if (btn.id === 'btn-stats') return 'stats-window';
    return null;
}

toggleWindow(windowId, btn) {
    const win = document.getElementById(windowId);
    if (!win) return;

    const isVisible = win.style.display !== 'none';
    win.style.display = isVisible ? 'none' : 'block';

    if (btn) {
        btn.classList.toggle('active', !isVisible);
    }

    // Reset transform when opening (so it's centered)
    if (!isVisible && !win.dataset.dragged) {
        // Keep default CSS position
    }
}

makeDraggable(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    const header = win.querySelector('.window-header');
    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-close')) return;
        isDragging = true;
        win.dataset.dragged = 'true';

        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Remove CSS transform centering
        win.style.transform = 'none';
        win.style.left = `${rect.left}px`;
        win.style.top = `${rect.top}px`;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Clamp to viewport
        newX = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - win.offsetHeight, newY));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

    setupTooltips() {
        this.tooltipEl = document.getElementById('global-tooltip');

        // Delegate: hover em equip slots
        document.addEventListener('mouseover', (e) => {
            const equipSlot = e.target.closest('.equip-slot.equipped');
            const lootSlot = e.target.closest('.loot-slot.filled');

            if (equipSlot) {
                const slotName = equipSlot.dataset.slot;
                const eq = this.equipment[slotName];
                if (eq && eq.name) {
                    let html = `<div class="tooltip-name">${eq.name}</div>`;
                    if (eq.attack) html += `<div class="tooltip-stat">⚔️ ATK +${eq.attack}</div>`;
                    if (eq.defense) html += `<div class="tooltip-stat">🛡️ DEF +${eq.defense}</div>`;
                    html += `<div class="tooltip-action">Clique pra desequipar</div>`;
                    this.showTooltip(html, e);
                }
            } else if (lootSlot) {
                const index = parseInt(lootSlot.dataset.index);
                const slot = this.lootSlots[index];
                if (slot) {
                    const item = ITEMS[slot.id];
                    if (item) {
                        const isEquip = item.type !== 'potion';
                        let html = `<div class="tooltip-name">${item.name}</div>`;
                        if (item.attack) html += `<div class="tooltip-stat">⚔️ ATK +${item.attack}</div>`;
                        if (item.defense) html += `<div class="tooltip-stat">🛡️ DEF +${item.defense}</div>`;
                        if (item.effect === 'hp') html += `<div class="tooltip-stat">❤️ +${item.value} HP</div>`;
                        if (item.effect === 'mana') html += `<div class="tooltip-stat">💙 +${item.value} Mana</div>`;
                        html += `<div class="tooltip-action">${isEquip ? 'Clique pra equipar' : 'Clique pra usar'}</div>`;
                        this.showTooltip(html, e);
                    }
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            const equipSlot = e.target.closest('.equip-slot.equipped');
            const lootSlot = e.target.closest('.loot-slot.filled');
            if (equipSlot || lootSlot) {
                this.hideTooltip();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.tooltipEl.style.display === 'block') {
                this.positionTooltip(e);
            }
        });
    }

    showTooltip(html, event) {
        this.tooltipEl.innerHTML = html;
        this.tooltipEl.style.display = 'block';
        this.positionTooltip(event);
    }

    positionTooltip(event) {
        const tt = this.tooltipEl;
        const ttW = tt.offsetWidth;
        const ttH = tt.offsetHeight;
        const margin = 12;

        let x = event.clientX - ttW - margin;
        let y = event.clientY - ttH / 2;

        // Se não cabe à esquerda, vai pra direita
        if (x < 5) {
            x = event.clientX + margin;
        }

        // Não deixa sair da tela vertical
        if (y < 5) y = 5;
        if (y + ttH > window.innerHeight - 5) {
            y = window.innerHeight - ttH - 5;
        }

        tt.style.left = `${x}px`;
        tt.style.top = `${y}px`;
    }

    hideTooltip() {
        this.tooltipEl.style.display = 'none';
    }


    setupMinimap() {
        this.minimapCanvas = document.getElementById('minimap-canvas');
        if (!this.minimapCanvas) return;
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        this.drawMinimap();
    }

        // ══════════════════════════════════════
    // GAME LOG
    // ══════════════════════════════════════

    addLog(message, type = 'system') {
    const logEl = document.getElementById('chat-gamelog');
    if (!logEl) return;

    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    logEl.appendChild(entry);

    while (logEl.children.length > 150) {
        logEl.removeChild(logEl.firstChild);
    }

    // Auto-scroll se tab ativa
    if (this.activeTab === 'gamelog') {
        logEl.scrollTop = logEl.scrollHeight;
    }
}

// ══════════════════════════════════════
// CHAT SYSTEM
// ══════════════════════════════════════

setupChat() {
    // Tab switching
    document.querySelectorAll('.chat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            this.switchChatTab(tabName);
        });
    });

    // Input
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            e.stopPropagation();

            if (e.key === 'Enter') {
                this.sendChatMessage(chatInput.value.trim());
                chatInput.value = '';
                chatInput.blur();
            }

            if (e.key === 'Escape') {
                chatInput.value = '';
                chatInput.blur();
            }
        });

        // Previne WASD de mover o player quando digitando
        chatInput.addEventListener('keyup', (e) => e.stopPropagation());
        chatInput.addEventListener('keypress', (e) => e.stopPropagation());
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                this.sendChatMessage(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }

    // ENTER global para focar no chat
    this.input.keyboard.on('keydown-ENTER', () => {
        const chatInput = document.getElementById('chat-input');
        if (chatInput && document.activeElement !== chatInput) {
            chatInput.focus();
        }
    });
}

switchChatTab(tabName) {
    this.activeTab = tabName;

    // Tabs
    document.querySelectorAll('.chat-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabName);
    });

    // Messages
    document.querySelectorAll('.chat-messages').forEach(m => {
        m.classList.remove('active');
    });

    const activeMessages = document.getElementById(`chat-${tabName}`);
    if (activeMessages) {
        activeMessages.classList.add('active');
        activeMessages.scrollTop = activeMessages.scrollHeight;
    }
}

sendChatMessage(text) {
    if (!text || text.length === 0) return;

    // Adiciona na aba Geral
    this.addChatMessage('geral', this.playerName, text, 'player');

    // Mostra balão acima do player
    this.showChatBubble(text);

    // Verifica se é mensagem pra NPC
    this.checkNpcInteraction(text);
}

addChatMessage(tab, sender, message, type = 'player') {
    const tabEl = document.getElementById(`chat-${tab}`);
    if (!tabEl) return;

    const entry = document.createElement('div');
    entry.className = 'chat-msg';

    if (type === 'player') {
        entry.innerHTML = `<span class="chat-player-name">${sender}:</span> <span class="chat-player-msg">${message}</span>`;
    } else if (type === 'npc') {
        entry.innerHTML = `<span class="chat-npc-name">${sender}:</span> <span class="chat-npc-msg">${message}</span>`;
    } else if (type === 'system') {
        entry.innerHTML = `<span class="chat-system">${message}</span>`;
    }

    tabEl.appendChild(entry);

    while (tabEl.children.length > 150) {
        tabEl.removeChild(tabEl.firstChild);
    }

    // Auto-scroll se tab ativa
    if (this.activeTab === tab) {
        tabEl.scrollTop = tabEl.scrollHeight;
    }
}

checkNpcInteraction(text) {
    const lower = text.toLowerCase().trim();
    const greetings = ['hi', 'oi', 'hello', 'olá', 'ola', 'hey'];

    if (greetings.includes(lower)) {
        // Verifica se tem NPC perto (futuro)
        // Por enquanto, resposta genérica
        this.time.delayedCall(500, () => {
            const npcResponse = 'Nenhum NPC por perto para conversar.';
            this.addChatMessage('geral', 'Sistema', npcResponse, 'system');
            this.addChatMessage('npc', 'Sistema', npcResponse, 'system');
        });
    }
}

showChatBubble(text) {
    // Remove bubble anterior
    if (this.chatBubble) {
        this.chatBubble.destroy();
        this.chatBubble = null;
    }
    if (this.chatBubbleTimer) {
        this.chatBubbleTimer.remove();
        this.chatBubbleTimer = null;
    }

    // Trunca texto longo
    const displayText = text.length > 40 ? text.substring(0, 40) + '...' : text;

    this.chatBubble = this.add.text(
        this.player.x,
        this.player.y - 58,
        displayText,
        {
            fontFamily: 'MedievalSharp, cursive',
            fontSize: '10px',
            color: '#e8d5a3',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 6, y: 3 },
            stroke: '#000000',
            strokeThickness: 1,
        }
    ).setOrigin(0.5, 1).setDepth(20001);

    // Auto-remove após 4 segundos
    this.chatBubbleTimer = this.time.delayedCall(4000, () => {
        if (this.chatBubble) {
            this.tweens.add({
                targets: this.chatBubble,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    if (this.chatBubble) {
                        this.chatBubble.destroy();
                        this.chatBubble = null;
                    }
                }
            });
        }
    });
}

    // ══════════════════════════════════════
// SKILL SYSTEM
// ══════════════════════════════════════

getActiveSkillType() {
    const weapon = this.equipment.weapon;
    if (weapon && weapon.skillType) {
        return weapon.skillType;
    }
    // Sem arma = club (luta com os punhos)
    return 'club';
}

getSkillExpNeeded(skillLevel) {
    return Math.floor(50 * Math.pow(1.1, skillLevel - 10));
}

gainSkillExp(skillType, amount) {
    const skill = this.skills[skillType];
    if (!skill) return;

    skill.exp += amount;

    // Check level up
    const needed = this.getSkillExpNeeded(skill.level);
    if (skill.exp >= needed) {
        skill.exp -= needed;
        skill.level++;
        skill.next = this.getSkillExpNeeded(skill.level);

        this.addLog(`Skill ${skillType.charAt(0).toUpperCase() + skillType.slice(1)} subiu para ${skill.level}!`, 'skill');
        this.showDamageText(this.player.x, this.player.y - 60, `${skillType.toUpperCase()} UP!`, '#22aacc');
    }

    this.updateSkillsDisplay();
}

getSkillDamageBonus() {
    const skillType = this.getActiveSkillType();
    const skill = this.skills[skillType];
    if (!skill) return 0;
    // Cada nível de skill acima de 10 dá +1 de dano
    return Math.max(0, skill.level - 10);
}

    drawMinimap() {
        if (!this.minimapCtx) return;
        const ctx = this.minimapCtx;
        const canvas = this.minimapCanvas;
        const ts = canvas.width / this.mapWidth;

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                ctx.fillStyle = this.dirtMap[y][x] ? '#7a5a2a' :
                    (x + y) % 2 === 0 ? '#5a7a2a' : '#4d6b1e';
                ctx.fillRect(x * ts, y * ts, ts, ts);
            }
        }

        this.propPositions.forEach(prop => {
            const def = PROP_DEFS[prop.type];
            if (def && def.minimapColor) {
                ctx.fillStyle = def.minimapColor;
                ctx.fillRect(prop.gridX * ts, prop.gridY * ts, ts, ts);
            }
        });

        this.monsters.forEach(m => {
            if (m.alive) {
                ctx.fillStyle = '#cc2222';
                ctx.fillRect(m.gridX * ts, m.gridY * ts, ts, ts);
            }
        });

        // Holes no minimap
        const mapData = MAPS[this.currentMapId];
        if (mapData && mapData.holes) {
            mapData.holes.forEach(hole => {
                ctx.fillStyle = '#d4a017';
                ctx.beginPath();
                ctx.arc(hole.x * ts + ts / 2, hole.y * ts + ts / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        const px = this.playerGridX * ts + ts / 2;
        const py = this.playerGridY * ts + ts / 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4a017';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.stroke();
    }

    updateAllDisplays() {
        this.updateExpDisplay();
        this.updatePanelBars();
        this.updateCharDetails();
        this.updateSkillsDisplay();
    }

    updatePanelBars() {
    const hpFill = document.getElementById('hud-hp-fill');
    const hpText = document.getElementById('hud-hp-text');
    const manaFill = document.getElementById('hud-mana-fill');
    const manaText = document.getElementById('hud-mana-text');

    if (hpFill) hpFill.style.width = `${(this.currentHp / this.maxHp) * 100}%`;
    if (hpText) hpText.textContent = `${this.currentHp}/${this.maxHp}`;
    if (manaFill) manaFill.style.width = `${(this.currentMana / this.maxMana) * 100}%`;
    if (manaText) manaText.textContent = `${this.currentMana}/${this.maxMana}`;
}

    getExpToNextLevel() { return this.playerLevel * 100; }

    updateExpDisplay() {
    const needed = this.getExpToNextLevel();
    const percent = Math.min(100, Math.floor((this.currentExp / needed) * 100));

    const fill = document.getElementById('hud-exp-fill');
    const text = document.getElementById('hud-exp-text');

    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% — ${this.currentExp}/${needed}`;

    // HUD level
    const hudLevel = document.getElementById('hud-level');
    if (hudLevel) hudLevel.textContent = `Level ${this.playerLevel} — ${this.playerVocation}`;
}

    updateCharDetails() {
    const levelEl = document.getElementById('char-level');
    const expTotal = document.getElementById('char-exp-total');
    const expNext = document.getElementById('char-exp-next');
    const capEl = document.getElementById('char-capacity');

    if (levelEl) levelEl.textContent = this.playerLevel;
    if (expTotal) expTotal.textContent = this.totalExp;
    if (expNext) expNext.textContent = this.getExpToNextLevel();
    if (capEl) capEl.textContent = `${this.currentCapacity}/${this.maxCapacity}`;
}

    updateSkillsDisplay() {
    Object.keys(this.skills).forEach(skill => {
        const data = this.skills[skill];
        const needed = this.getSkillExpNeeded(data.level);
        data.next = needed;
        const pct = Math.min(100, Math.floor((data.exp / needed) * 100));
        const bar = document.getElementById(`skill-${skill}-bar`);
        const label = document.getElementById(`skill-${skill}-pct`);
        if (bar) bar.style.width = `${pct}%`;
        if (label) label.textContent = data.level;
    });
}

    // ══════════════════════════════════════
    // ANIMATIONS & MOVEMENT
    // ══════════════════════════════════════

    createAnimations() {
        const directions = ['west', 'south', 'east', 'north'];

        directions.forEach(dir => {
            const frames = [];
            for (let i = 0; i < 6; i++) frames.push({ key: `player_${dir}_${i}` });
            this.anims.create({ key: `walk_${dir}`, frames, frameRate: 10, repeat: -1 });
        });

        const monsterTypes = ['rat', 'orc', 'vampire'];
        monsterTypes.forEach(type => {
            directions.forEach(dir => {
                const frames = [];
                for (let i = 0; i < 6; i++) frames.push({ key: `${type}_${dir}_${i}` });
                this.anims.create({ key: `${type}_walk_${dir}`, frames, frameRate: 8, repeat: -1 });
            });
        });
    }

   
getMoveDuration() {
    // Base 400ms, reduz 25ms por level (mais rápido que antes)
    const base = 400;
    const reduction = (this.playerLevel - 1) * 25;
    return Math.max(100, base - reduction);
}


    movePlayer(dx, dy, direction) {
        const newX = this.playerGridX + dx;
        const newY = this.playerGridY + dy;

        if (newX < 0 || newX >= this.mapWidth) return;
        if (newY < 0 || newY >= this.mapHeight) return;
        if (this.collisionMap[newY][newX]) return;
        if (this.isMonsterAt(newX, newY)) return;

        this.isMoving = true;
        this.facing = direction;
        this.player.play(`walk_${direction}`, true);

        const targetX = newX * this.gridSize + this.gridSize / 2;
        const targetY = newY * this.gridSize + this.gridSize / 2;

        this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            duration: this.getMoveDuration(),
            ease: 'Linear',
            onComplete: () => {
                this.playerGridX = newX;
                this.playerGridY = newY;
                this.isMoving = false;
                this.player.setDepth(this.player.y);
                this.drawMinimap();
                this.checkHoleCollision();
            }
        });
    }

    // ══════════════════════════════════════
    // UPDATE LOOP
    // ══════════════════════════════════════

    update() {
    // Player UI follow
    if (this.nameText && this.player) {
        this.nameText.setPosition(this.player.x, this.player.y - 42);
    }

    // Chat bubble follows player
    if (this.chatBubble && this.chatBubble.active) {
        this.chatBubble.setPosition(this.player.x, this.player.y - 58);
    }

    if (this.barsGraphics) this.drawBars();
    if (this.player) this.player.setDepth(this.player.y);

    // Target indicator
    this.drawTargetIndicator();

    // Se temos target e não estamos controlando manualmente, persegue/ataca
    if (this.isChasing && this.targetMonster && this.targetMonster.alive && !this.isMoving) {
        const manualInput =
            this.cursors.left.isDown || this.cursors.right.isDown ||
            this.cursors.up.isDown || this.cursors.down.isDown ||
            this.wasd.left.isDown || this.wasd.right.isDown ||
            this.wasd.up.isDown || this.wasd.down.isDown;

        if (!manualInput) {
            this.chaseTarget();
            return;
        } else {
            this.isChasing = false;
        }
    }

    if (this.isMoving) return;

    // Não move se estiver digitando no chat
    const chatInput = document.getElementById('chat-input');
    const isTyping = chatInput && document.activeElement === chatInput;

    if (isTyping) return;

    let dx = 0, dy = 0, direction = null;

    if (this.cursors.left.isDown || this.wasd.left.isDown) { dx = -1; direction = 'west'; }
    else if (this.cursors.right.isDown || this.wasd.right.isDown) { dx = 1; direction = 'east'; }
    else if (this.cursors.up.isDown || this.wasd.up.isDown) { dy = -1; direction = 'north'; }
    else if (this.cursors.down.isDown || this.wasd.down.isDown) { dy = 1; direction = 'south'; }

    if (direction) {
        this.movePlayer(dx, dy, direction);
    } else {
        if (this.player.anims.isPlaying) {
            this.player.anims.stop();
            this.player.setTexture(`player_${this.facing}_0`);
        }
    }
}
}