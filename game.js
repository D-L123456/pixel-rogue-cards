/**
 * Pixel Rogue Cards - 像素卡牌地牢
 * 一个完整的卡牌构筑类肉鸽游戏
 */

// 游戏配置
const CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    FPS: 60,
    COLORS: {
        background: '#1a1a2e',
        panel: '#16213e',
        border: '#0f3460',
        text: '#e94560',
        textLight: '#eee',
        hp: '#e74c3c',
        energy: '#3498db',
        block: '#95a5a6',
        gold: '#f39c12',
        cardAttack: '#e74c3c',
        cardDefense: '#3498db',
        cardSkill: '#9b59b6',
        cardPower: '#f39c12'
    }
};

// 游戏状态
const GameState = {
    MENU: 'menu',
    MAP: 'map',
    COMBAT: 'combat',
    EVENT: 'event',
    SHOP: 'shop',
    REWARD: 'reward',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

// 卡牌类型
const CardType = {
    ATTACK: 'attack',
    DEFENSE: 'defense',
    SKILL: 'skill',
    POWER: 'power'
};

// 卡牌稀有度
const Rarity = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare'
};

// 敌人意图
const Intent = {
    ATTACK: 'attack',
    DEFEND: 'defend',
    BUFF: 'buff',
    DEBUFF: 'debuff'
};

// 卡牌数据库
const CARD_DATABASE = [
    // 攻击卡
    { id: 'strike', name: '打击', type: CardType.ATTACK, cost: 1, damage: 6, description: '造成6点伤害', rarity: Rarity.COMMON },
    { id: 'bash', name: '重击', type: CardType.ATTACK, cost: 2, damage: 8, vulnerable: 2, description: '造成8点伤害，给予2层易伤', rarity: Rarity.COMMON },
    { id: 'cleave', name: '顺劈斩', type: CardType.ATTACK, cost: 1, damage: 5, aoe: true, description: '对所有敌人造成5点伤害', rarity: Rarity.COMMON },
    { id: 'heavy_blade', name: '重刃', type: CardType.ATTACK, cost: 2, damage: 14, description: '造成14点伤害', rarity: Rarity.UNCOMMON },
    { id: 'clothesline', name: '套索攻击', type: CardType.ATTACK, cost: 2, damage: 12, weak: 2, description: '造成12点伤害，给予2层虚弱', rarity: Rarity.UNCOMMON },
    { id: 'bludgeon', name: '棒击', type: CardType.ATTACK, cost: 3, damage: 32, description: '造成32点伤害', rarity: Rarity.RARE },
    
    // 防御卡
    { id: 'defend', name: '防御', type: CardType.DEFENSE, cost: 1, block: 5, description: '获得5点护甲', rarity: Rarity.COMMON },
    { id: 'shield_bash', name: '盾击', type: CardType.DEFENSE, cost: 2, block: 8, damage: 8, description: '获得8点护甲，造成8点伤害', rarity: Rarity.COMMON },
    { id: 'entrench', name: '固守', type: CardType.DEFENSE, cost: 2, blockMultiplier: 1.5, description: '护甲翻倍', rarity: Rarity.UNCOMMON },
    { id: 'barricade', name: '路障', type: CardType.POWER, cost: 3, barricade: true, description: '本回合护甲不会消失', rarity: Rarity.RARE },
    
    // 技能卡
    { id: 'draw', name: '抽牌', type: CardType.SKILL, cost: 1, draw: 2, description: '抽2张牌', rarity: Rarity.COMMON },
    { id: 'flex', name: ' flex', type: CardType.SKILL, cost: 0, strength: 2, strengthDown: 2, description: '获得2点力量，下回合失去2点力量', rarity: Rarity.COMMON },
    { id: 'battle_trance', name: '战斗专注', type: CardType.SKILL, cost: 0, draw: 3, noDrawNext: true, description: '抽3张牌，本回合不能再抽牌', rarity: Rarity.UNCOMMON },
    { id: 'offering', name: '献祭', type: CardType.SKILL, cost: 0, draw: 3, energy: 2, hpLoss: 3, description: '失去3点生命，获得2点能量，抽3张牌', rarity: Rarity.RARE }
];

// 敌人类型
const ENEMY_TYPES = [
    { name: '绿史莱姆', hp: 25, damage: 5, gold: 10, exp: 10, color: '#2ecc71' },
    { name: '红史莱姆', hp: 35, damage: 7, gold: 15, exp: 15, color: '#e74c3c' },
    { name: '骷髅战士', hp: 40, damage: 8, block: 5, gold: 20, exp: 20, color: '#ecf0f1' },
    { name: '暗影刺客', hp: 30, damage: 12, gold: 25, exp: 25, color: '#8e44ad' },
    { name: '兽人战士', hp: 50, damage: 10, gold: 30, exp: 30, color: '#27ae60' },
    { name: '精英骑士', hp: 70, damage: 12, block: 10, gold: 50, exp: 50, isElite: true, color: '#f39c12' }
];

// 遗物列表
const RELICS = [
    { name: '燃烧之血', description: '战斗结束时恢复6点生命', effect: 'heal_end_combat', value: 6, rarity: Rarity.COMMON },
    { name: '红石头', description: '每回合开始时获得1点能量', effect: 'energy_per_turn', value: 1, rarity: Rarity.COMMON },
    { name: '金刚杵', description: '每回合开始时获得3点护甲', effect: 'block_per_turn', value: 3, rarity: Rarity.COMMON },
    { name: '纸鹤', description: '每打出3张牌，抽1张牌', effect: 'draw_on_cards', value: 3, rarity: Rarity.UNCOMMON },
    { name: '手里剑', description: '每打出3张攻击牌，获得1点力量', effect: 'strength_on_attack', value: 3, rarity: Rarity.UNCOMMON },
    { name: '纯净之瓶', description: '每场战斗开始时，添加1张净化到手牌', effect: 'add_purify', rarity: Rarity.RARE }
];

// 游戏主类
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.MENU;
        this.player = null;
        this.currentEnemy = null;
        this.map = null;
        this.currentNode = null;
        this.floor = 1;
        this.gold = 0;
        this.relics = [];
        this.deck = [];
        this.hand = [];
        this.discardPile = [];
        this.exhaustPile = [];
        this.turn = 1;
        this.selectedCard = null;
        this.hoverCard = null;
        this.animations = [];
        this.particles = [];
        
        this.init();
    }
    
    init() {
        document.getElementById('loading').style.display = 'none';
        this.setupInput();
        this.gameLoop();
    }
    
    setupInput() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    startNewGame() {
        this.player = {
            maxHp: 80,
            hp: 80,
            energy: 3,
            maxEnergy: 3,
            block: 0,
            strength: 0,
            dexterity: 0,
            vulnerable: 0,
            weak: 0
        };
        this.gold = 99;
        this.floor = 1;
        this.relics = [{ ...RELICS[0] }]; // 初始遗物
        this.deck = this.createStarterDeck();
        this.map = this.generateMap();
        this.currentNode = this.map[0][0];
        this.state = GameState.MAP;
    }
    
    createStarterDeck() {
        const deck = [];
        // 5张打击
        for (let i = 0; i < 5; i++) {
            deck.push(this.createCard('strike'));
        }
        // 4张防御
        for (let i = 0; i < 4; i++) {
            deck.push(this.createCard('defend'));
        }
        // 1张抽牌
        deck.push(this.createCard('draw'));
        return deck;
    }
    
    createCard(cardId) {
        const template = CARD_DATABASE.find(c => c.id === cardId);
        return { ...template, uuid: Math.random().toString(36).substr(2, 9) };
    }
    
    generateMap() {
        const map = [];
        const floors = 10;
        const nodesPerFloor = [1, 2, 3, 3, 3, 3, 2, 2, 1, 1];
        
        for (let f = 0; f < floors; f++) {
            const floorNodes = [];
            const count = nodesPerFloor[f];
            
            for (let i = 0; i < count; i++) {
                let type = 'combat';
                if (f === 0) type = 'start';
                else if (f === floors - 1) type = 'boss';
                else if (Math.random() < 0.2) type = 'elite';
                else if (Math.random() < 0.2) type = 'shop';
                else if (Math.random() < 0.15) type = 'rest';
                else if (Math.random() < 0.15) type = 'event';
                
                floorNodes.push({
                    id: `${f}-${i}`,
                    floor: f,
                    index: i,
                    type: type,
                    x: 200 + (i * 200) + (3 - count) * 100,
                    y: 100 + f * 70,
                    visited: false,
                    connections: []
                });
            }
            
            // 创建连接
            if (f > 0) {
                const prevFloor = map[f - 1];
                floorNodes.forEach(node => {
                    prevFloor.forEach(prevNode => {
                        if (Math.abs(prevNode.index - node.index) <= 1 || 
                            (prevFloor.length === 1) || 
                            (floorNodes.length === 1)) {
                            if (Math.random() < 0.7) {
                                node.connections.push(prevNode);
                            }
                        }
                    });
                });
            }
            
            map.push(floorNodes);
        }
        
        return map;
    }
    
    startCombat(enemyType = null) {
        this.state = GameState.COMBAT;
        this.turn = 1;
        this.hand = [];
        this.discardPile = [];
        this.exhaustPile = [];
        this.player.block = 0;
        
        // 创建敌人
        if (!enemyType) {
            const availableEnemies = ENEMY_TYPES.filter(e => !e.isElite || this.currentNode?.type === 'elite');
            enemyType = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        }
        
        this.currentEnemy = {
            ...enemyType,
            maxHp: enemyType.hp,
            block: 0,
            strength: 0,
            vulnerable: 0,
            weak: 0,
            intent: this.generateIntent(enemyType)
        };
        
        this.startTurn();
    }
    
    generateIntent(enemy) {
        const intents = [Intent.ATTACK];
        if (enemy.block) intents.push(Intent.DEFEND);
        return intents[Math.floor(Math.random() * intents.length)];
    }
    
    startTurn() {
        this.player.energy = this.player.maxEnergy;
        this.drawCards(5);
        this.processStartOfTurnEffects();
        this.currentEnemy.intent = this.generateIntent(this.currentEnemy);
    }
    
    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.deck.length === 0) {
                if (this.discardPile.length === 0) break;
                this.deck = this.shuffle([...this.discardPile]);
                this.discardPile = [];
            }
            if (this.deck.length > 0 && this.hand.length < 10) {
                this.hand.push(this.deck.pop());
            }
        }
    }
    
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    processStartOfTurnEffects() {
        // 应用遗物效果
        this.relics.forEach(relic => {
            if (relic.effect === 'block_per_turn') {
                this.player.block += relic.value;
            }
        });
        
        // 减少负面状态
        if (this.player.vulnerable > 0) this.player.vulnerable--;
        if (this.player.weak > 0) this.player.weak--;
    }
    
    playCard(cardIndex) {
        const card = this.hand[cardIndex];
        if (!card || card.cost > this.player.energy) return false;
        
        this.player.energy -= card.cost;
        this.hand.splice(cardIndex, 1);
        
        // 执行卡牌效果
        this.executeCardEffect(card);
        
        // 处理遗物效果
        this.processCardPlayEffects(card);
        
        this.discardPile.push(card);
        
        // 检查战斗结束
        this.checkCombatEnd();
        
        return true;
    }
    
    executeCardEffect(card) {
        // 造成伤害
        if (card.damage) {
            let damage = card.damage;
            if (this.player.strength > 0) damage += this.player.strength;
            if (this.player.weak > 0) damage = Math.floor(damage * 0.75);
            if (this.currentEnemy.vulnerable > 0) damage = Math.floor(damage * 1.5);
            
            this.dealDamageToEnemy(damage);
            
            if (card.vulnerable) this.currentEnemy.vulnerable += card.vulnerable;
            if (card.weak) this.currentEnemy.weak += card.weak;
        }
        
        // 获得护甲
        if (card.block) {
            let block = card.block;
            if (this.player.dexterity > 0) block += this.player.dexterity;
            this.player.block += block;
        }
        
        // 抽牌
        if (card.draw) {
            this.drawCards(card.draw);
        }
        
        // 获得力量
        if (card.strength) {
            this.player.strength += card.strength;
        }
        
        // 获得能量
        if (card.energy) {
            this.player.energy += card.energy;
        }
        
        // 失去生命
        if (card.hpLoss) {
            this.player.hp -= card.hpLoss;
        }
        
        // 护甲翻倍
        if (card.blockMultiplier) {
            this.player.block = Math.floor(this.player.block * card.blockMultiplier);
        }
    }
    
    processCardPlayEffects(card) {
        // 这里可以处理遗物触发的额外效果
    }
    
    dealDamageToEnemy(damage) {
        const actualDamage = Math.max(1, damage - this.currentEnemy.block);
        this.currentEnemy.block = Math.max(0, this.currentEnemy.block - damage);
        this.currentEnemy.hp -= actualDamage;
        
        // 添加伤害动画
        this.addAnimation('damage', 800, 300, actualDamage);
        this.addParticles(800, 300, this.currentEnemy.color, 10);
    }
    
    dealDamageToPlayer(damage) {
        let actualDamage = damage;
        if (this.player.vulnerable > 0) actualDamage = Math.floor(actualDamage * 1.5);
        if (this.currentEnemy.weak > 0) actualDamage = Math.floor(actualDamage * 0.75);
        
        actualDamage = Math.max(1, actualDamage - this.player.block);
        this.player.block = Math.max(0, this.player.block - damage);
        this.player.hp -= actualDamage;
        
        this.addAnimation('damage', 200, 300, actualDamage);
        this.addParticles(200, 300, '#e74c3c', 10);
    }
    
    endTurn() {
        // 丢弃手牌
        this.discardPile.push(...this.hand);
        this.hand = [];
        
        // 敌人行动
        this.enemyAction();
        
        // 检查战斗结束
        if (!this.checkCombatEnd()) {
            this.turn++;
            this.player.block = 0; // 回合结束护甲消失（除非有遗物）
            this.startTurn();
        }
    }
    
    enemyAction() {
        if (this.currentEnemy.hp <= 0) return;
        
        switch (this.currentEnemy.intent) {
            case Intent.ATTACK:
                let damage = this.currentEnemy.damage;
                if (this.currentEnemy.strength > 0) damage += this.currentEnemy.strength;
                this.dealDamageToPlayer(damage);
                break;
            case Intent.DEFEND:
                this.currentEnemy.block += this.currentEnemy.block || 5;
                break;
        }
    }
    
    checkCombatEnd() {
        if (this.currentEnemy.hp <= 0) {
            this.winCombat();
            return true;
        }
        if (this.player.hp <= 0) {
            this.gameOver();
            return true;
        }
        return false;
    }
    
    winCombat() {
        const goldReward = this.currentEnemy.gold;
        this.gold += goldReward;
        
        // 战斗结束后回血
        this.relics.forEach(relic => {
            if (relic.effect === 'heal_end_combat') {
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + relic.value);
            }
        });
        
        this.state = GameState.REWARD;
        this.generateRewards();
    }
    
    generateRewards() {
        this.currentRewards = {
            gold: this.currentEnemy.gold,
            cards: []
        };
        
        // 生成卡牌奖励
        const rewardCount = Math.random() < 0.3 ? 3 : 2;
        for (let i = 0; i < rewardCount; i++) {
            const rarity = Math.random() < 0.1 ? Rarity.RARE : 
                          Math.random() < 0.3 ? Rarity.UNCOMMON : Rarity.COMMON;
            const availableCards = CARD_DATABASE.filter(c => c.rarity === rarity);
            const card = availableCards[Math.floor(Math.random() * availableCards.length)];
            this.currentRewards.cards.push(this.createCard(card.id));
        }
    }
    
    gameOver() {
        this.state = GameState.GAME_OVER;
    }
    
    // 渲染方法
    render() {
        this.ctx.fillStyle = CONFIG.COLORS.background;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        switch (this.state) {
            case GameState.MENU:
                this.renderMenu();
                break;
            case GameState.MAP:
                this.renderMap();
                break;
            case GameState.COMBAT:
                this.renderCombat();
                break;
            case GameState.REWARD:
                this.renderReward();
                break;
            case GameState.GAME_OVER:
                this.renderGameOver();
                break;
        }
        
        this.renderAnimations();
        this.renderParticles();
    }
    
    renderMenu() {
        this.ctx.fillStyle = CONFIG.COLORS.text;
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PIXEL ROGUE CARDS', CONFIG.CANVAS_WIDTH / 2, 250);
        
        this.ctx.fillStyle = CONFIG.COLORS.textLight;
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText('像素卡牌地牢', CONFIG.CANVAS_WIDTH / 2, 320);
        
        // 开始按钮
        this.drawButton(CONFIG.CANVAS_WIDTH / 2 - 150, 450, 300, 60, '开始游戏', '#e94560');
        
        this.ctx.font = '14px "Press Start 2P"';
        this.ctx.fillStyle = '#888';
        this.ctx.fillText('点击开始游戏', CONFIG.CANVAS_WIDTH / 2, 600);
    }
    
    renderMap() {
        // 标题
        this.ctx.fillStyle = CONFIG.COLORS.text;
        this.ctx.font = 'bold 24px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`第 ${this.floor} 层`, 50, 50);
        
        // 玩家信息
        this.renderPlayerInfo(50, 80);
        
        // 渲染地图节点
        this.map.forEach((floor, floorIndex) => {
            floor.forEach(node => {
                this.renderMapNode(node);
            });
        });
        
        // 提示文字
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.fillStyle = '#888';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('点击节点选择路线', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 50);
    }
    
    renderMapNode(node) {
        const size = 30;
        const x = node.x;
        const y = node.y;
        
        // 渲染连接线
        node.connections.forEach(prevNode => {
            this.ctx.strokeStyle = node.visited || prevNode.visited ? '#e94560' : '#444';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(prevNode.x, prevNode.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        });
        
        // 节点颜色
        let color = '#555';
        if (node.visited) color = '#27ae60';
        else if (node === this.currentNode) color = '#e94560';
        else if (node.connections.some(c => c.visited)) color = '#f39c12';
        
        // 节点图标
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 节点类型图标
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        let icon = '?';
        switch (node.type) {
            case 'start': icon = 'S'; break;
            case 'combat': icon = '⚔'; break;
            case 'elite': icon = '👹'; break;
            case 'boss': icon = '💀'; break;
            case 'shop': icon = '🏪'; break;
            case 'rest': icon = '💤'; break;
            case 'event': icon = '❓'; break;
        }
        this.ctx.fillText(icon, x, y);
    }
    
    renderCombat() {
        // 背景
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 渲染敌人
        this.renderEnemy();
        
        // 渲染玩家
        this.renderPlayer();
        
        // 渲染手牌
        this.renderHand();
        
        // 渲染UI
        this.renderCombatUI();
    }
    
    renderEnemy() {
        const x = 800;
        const y = 200;
        
        // 敌人精灵（像素风格）
        this.ctx.fillStyle = this.currentEnemy.color;
        const size = 120;
        this.ctx.fillRect(x - size/2, y, size, size);
        
        // 像素细节
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x - 30, y + 30, 15, 15);
        this.ctx.fillRect(x + 15, y + 30, 15, 15);
        this.ctx.fillRect(x - 20, y + 70, 40, 10);
        
        // 血条
        const hpPercent = this.currentEnemy.hp / this.currentEnemy.maxHp;
        this.renderBar(x - 60, y - 40, 120, 15, hpPercent, '#e74c3c', `HP: ${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`);
        
        // 护甲
        if (this.currentEnemy.block > 0) {
            this.ctx.fillStyle = '#95a5a6';
            this.ctx.fillRect(x + 70, y - 40, 25, 25);
            this.ctx.fillStyle = '#000';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.currentEnemy.block, x + 82, y - 27);
        }
        
        // 意图
        this.renderIntent(x, y - 80);
        
        // 名字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.currentEnemy.name, x, y - 100);
    }
    
    renderIntent(x, y) {
        const intent = this.currentEnemy.intent;
        this.ctx.fillStyle = '#f39c12';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        let icon = '⚔';
        if (intent === Intent.DEFEND) icon = '🛡';
        this.ctx.fillText(icon, x, y);
        
        // 伤害数值
        if (intent === Intent.ATTACK) {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = '14px "Press Start 2P"';
            this.ctx.fillText(this.currentEnemy.damage, x, y + 35);
        }
    }
    
    renderPlayer() {
        const x = 200;
        const y = 300;
        
        // 玩家精灵
        this.ctx.fillStyle = '#3498db';
        const size = 100;
        this.ctx.fillRect(x - size/2, y, size, size);
        
        // 像素细节
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x - 25, y + 25, 12, 12);
        this.ctx.fillRect(x + 13, y + 25, 12, 12);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x - 20, y + 65, 40, 8);
        
        // 血条
        const hpPercent = this.player.hp / this.player.maxHp;
        this.renderBar(x - 60, y - 40, 120, 15, hpPercent, '#e74c3c', `HP: ${this.player.hp}/${this.player.maxHp}`);
        
        // 能量
        this.ctx.fillStyle = '#3498db';
        this.ctx.beginPath();
        this.ctx.arc(x - 80, y + 50, 25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.player.energy, x - 80, y + 50);
        
        // 护甲
        if (this.player.block > 0) {
            this.ctx.fillStyle = '#95a5a6';
            this.ctx.beginPath();
            this.ctx.arc(x + 80, y + 50, 25, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(this.player.block, x + 80, y + 50);
        }
    }
    
    renderBar(x, y, width, height, percent, color, text) {
        // 背景
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, width, height);
        
        // 填充
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width * percent, height);
        
        // 文字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    renderHand() {
        const cardWidth = 140;
        const cardHeight = 200;
        const spacing = 20;
        const startX = (CONFIG.CANVAS_WIDTH - (this.hand.length * (cardWidth + spacing) - spacing)) / 2;
        const y = 550;
        
        this.hand.forEach((card, index) => {
            const x = startX + index * (cardWidth + spacing);
            const isSelected = this.selectedCard === index;
            const canPlay = card.cost <= this.player.energy;
            
            this.renderCard(card, x, y, cardWidth, cardHeight, isSelected, canPlay, index);
        });
    }
    
    renderCard(card, x, y, width, height, isSelected, canPlay, index) {
        const yOffset = isSelected ? -30 : 0;
        
        // 卡牌背景
        let bgColor = CONFIG.COLORS.panel;
        switch (card.type) {
            case CardType.ATTACK: bgColor = CONFIG.COLORS.cardAttack; break;
            case CardType.DEFENSE: bgColor = CONFIG.COLORS.cardDefense; break;
            case CardType.SKILL: bgColor = CONFIG.COLORS.cardSkill; break;
            case CardType.POWER: bgColor = CONFIG.COLORS.cardPower; break;
        }
        
        if (!canPlay) bgColor = '#444';
        
        // 阴影
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(x + 5, y + yOffset + 5, width, height);
        
        // 卡牌主体
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y + yOffset, width, height);
        
        // 边框
        this.ctx.strokeStyle = canPlay ? '#fff' : '#666';
        this.ctx.lineWidth = isSelected ? 4 : 2;
        this.ctx.strokeRect(x, y + yOffset, width, height);
        
        // 费用
        this.ctx.fillStyle = '#f39c12';
        this.ctx.beginPath();
        this.ctx.arc(x + 20, y + yOffset + 25, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 18px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(card.cost, x + 20, y + yOffset + 25);
        
        // 名字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px "Press Start 2P"';
        this.ctx.fillText(card.name, x + width / 2, y + yOffset + 30);
        
        // 类型
        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.font = '8px "Press Start 2P"';
        const typeText = {
            [CardType.ATTACK]: '攻击',
            [CardType.DEFENSE]: '防御',
            [CardType.SKILL]: '技能',
            [CardType.POWER]: '能力'
        };
        this.ctx.fillText(typeText[card.type], x + width / 2, y + yOffset + 50);
        
        // 描述
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '8px "Press Start 2P"';
        this.wrapText(card.description, x + 10, y + yOffset + 80, width - 20, 14);
        
        // 快捷键数字
        if (index < 5) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.font = '24px "Press Start 2P"';
            this.ctx.fillText(index + 1, x + width - 25, y + yOffset + height - 20);
        }
    }
    
    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n];
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, y);
    }
    
    renderCombatUI() {
        // 结束回合按钮
        this.drawButton(1000, 600, 150, 50, '结束回合', '#e74c3c');
        
        // 回合数
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`回合 ${this.turn}`, 50, 50);
        
        // 牌堆信息
        this.ctx.fillStyle = '#888';
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.fillText(`抽牌堆: ${this.deck.length}`, 50, CONFIG.CANVAS_HEIGHT - 100);
        this.ctx.fillText(`弃牌堆: ${this.discardPile.length}`, 50, CONFIG.CANVAS_HEIGHT - 80);
    }
    
    renderReward() {
        this.ctx.fillStyle = CONFIG.COLORS.background;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        this.ctx.fillStyle = CONFIG.COLORS.text;
        this.ctx.font = 'bold 36px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('战斗胜利！', CONFIG.CANVAS_WIDTH / 2, 150);
        
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = '24px "Press Start 2P"';
        this.ctx.fillText(`获得 ${this.currentRewards.gold} 金币`, CONFIG.CANVAS_WIDTH / 2, 220);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.fillText('选择一张卡牌加入你的卡组：', CONFIG.CANVAS_WIDTH / 2, 300);
        
        // 渲染奖励卡牌
        const cardWidth = 180;
        const cardHeight = 260;
        const spacing = 40;
        const startX = (CONFIG.CANVAS_WIDTH - (this.currentRewards.cards.length * (cardWidth + spacing) - spacing)) / 2;
        
        this.currentRewards.cards.forEach((card, index) => {
            const x = startX + index * (cardWidth + spacing);
            const y = 380;
            this.renderCard(card, x, y, cardWidth, cardHeight, false, true, index);
        });
        
        // 跳过按钮
        this.drawButton(CONFIG.CANVAS_WIDTH / 2 - 75, 700, 150, 50, '跳过', '#666');
    }
    
    renderGameOver() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = 'bold 48px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', CONFIG.CANVAS_WIDTH / 2, 300);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`你在第 ${this.floor} 层倒下了`, CONFIG.CANVAS_WIDTH / 2, 400);
        
        this.drawButton(CONFIG.CANVAS_WIDTH / 2 - 150, 500, 300, 60, '重新开始', '#e94560');
    }
    
    renderPlayerInfo(x, y) {
        // HP
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(x, y, 150, 20);
        const hpPercent = this.player.hp / this.player.maxHp;
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(x, y, 150 * hpPercent, 20);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.player.hp}/${this.player.maxHp}`, x + 75, y + 13);
        
        // 金币
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = '14px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`💰 ${this.gold}`, x, y + 45);
        
        // 卡组数量
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillText(`🃏 ${this.deck.length}`, x + 100, y + 45);
    }
    
    drawButton(x, y, width, height, text, color) {
        // 阴影
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(x + 4, y + 4, width, height);
        
        // 按钮主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        
        // 边框
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // 文字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    // 动画系统
    addAnimation(type, x, y, value) {
        this.animations.push({
            type,
            x,
            y,
            value,
            life: 60,
            maxLife: 60
        });
    }
    
    renderAnimations() {
        this.animations = this.animations.filter(anim => {
            anim.life--;
            
            if (anim.type === 'damage') {
                const alpha = anim.life / anim.maxLife;
                const yOffset = (anim.maxLife - anim.life) * 2;
                
                this.ctx.fillStyle = `rgba(231, 76, 60, ${alpha})`;
                this.ctx.font = 'bold 32px "Press Start 2P"';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`-${anim.value}`, anim.x, anim.y - yOffset);
            }
            
            return anim.life > 0;
        });
    }
    
    // 粒子系统
    addParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color,
                size: Math.random() * 5 + 2
            });
        }
    }
    
    renderParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.vy += 0.3; // 重力
            
            const alpha = p.life / 30;
            this.ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            if (!this.ctx.fillStyle.includes('rgba')) {
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = p.color;
            }
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
            this.ctx.globalAlpha = 1;
            
            return p.life > 0;
        });
    }
    
    // 输入处理
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch (this.state) {
            case GameState.MENU:
                // 开始按钮
                if (x >= 450 && x <= 750 && y >= 450 && y <= 510) {
                    this.startNewGame();
                }
                break;
                
            case GameState.MAP:
                // 检查点击的节点
                this.map.forEach(floor => {
                    floor.forEach(node => {
                        if (node.connections.some(c => c.visited) || node === this.currentNode) {
                            const dx = x - node.x;
                            const dy = y - node.y;
                            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                                this.visitNode(node);
                            }
                        }
                    });
                });
                break;
                
            case GameState.COMBAT:
                // 检查卡牌点击
                const cardWidth = 140;
                const cardHeight = 200;
                const spacing = 20;
                const startX = (CONFIG.CANVAS_WIDTH - (this.hand.length * (cardWidth + spacing) - spacing)) / 2;
                const cardY = 550;
                
                this.hand.forEach((card, index) => {
                    const cardX = startX + index * (cardWidth + spacing);
                    if (x >= cardX && x <= cardX + cardWidth && 
                        y >= cardY - 30 && y <= cardY + cardHeight) {
                        this.playCard(index);
                    }
                });
                
                // 结束回合按钮
                if (x >= 1000 && x <= 1150 && y >= 600 && y <= 650) {
                    this.endTurn();
                }
                break;
                
            case GameState.REWARD:
                // 选择奖励卡牌
                const rewardCardWidth = 180;
                const rewardCardHeight = 260;
                const rewardSpacing = 40;
                const rewardStartX = (CONFIG.CANVAS_WIDTH - (this.currentRewards.cards.length * (rewardCardWidth + rewardSpacing) - rewardSpacing)) / 2;
                
                this.currentRewards.cards.forEach((card, index) => {
                    const cardX = rewardStartX + index * (rewardCardWidth + rewardSpacing);
                    if (x >= cardX && x <= cardX + rewardCardWidth && 
                        y >= 380 && y <= 380 + rewardCardHeight) {
                        this.deck.push(card);
                        this.currentNode.visited = true;
                        this.floor++;
                        if (this.floor > 10) {
                            this.state = GameState.VICTORY;
                        } else {
                            this.state = GameState.MAP;
                        }
                    }
                });
                
                // 跳过按钮
                if (x >= 525 && x <= 675 && y >= 700 && y <= 750) {
                    this.currentNode.visited = true;
                    this.floor++;
                    this.state = GameState.MAP;
                }
                break;
                
            case GameState.GAME_OVER:
                // 重新开始按钮
                if (x >= 450 && x <= 750 && y >= 500 && y <= 560) {
                    this.startNewGame();
                }
                break;
        }
    }
    
    visitNode(node) {
        this.currentNode = node;
        
        switch (node.type) {
            case 'combat':
            case 'elite':
                this.startCombat();
                break;
            case 'boss':
                this.startCombat(ENEMY_TYPES.find(e => e.name === '暗影领主') || ENEMY_TYPES[5]);
                break;
            case 'rest':
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + 30);
                node.visited = true;
                this.floor++;
                break;
            default:
                this.startCombat();
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.state === GameState.COMBAT) {
            const cardWidth = 140;
            const spacing = 20;
            const startX = (CONFIG.CANVAS_WIDTH - (this.hand.length * (cardWidth + spacing) - spacing)) / 2;
            const cardY = 550;
            
            this.selectedCard = null;
            this.hand.forEach((card, index) => {
                const cardX = startX + index * (cardWidth + spacing);
                if (x >= cardX && x <= cardX + cardWidth && 
                    y >= cardY - 30 && y <= cardY + 200) {
                    this.selectedCard = index;
                }
            });
        }
    }
    
    handleKeyDown(e) {
        if (this.state === GameState.COMBAT) {
            // 数字键 1-5 出牌
            if (e.key >= '1' && e.key <= '5') {
                const index = parseInt(e.key) - 1;
                if (index < this.hand.length) {
                    this.playCard(index);
                }
            }
            // 空格结束回合
            else if (e.key === ' ') {
                e.preventDefault();
                this.endTurn();
            }
        }
        
        // R键重新开始
        if (e.key === 'r' || e.key === 'R') {
            if (this.state === GameState.GAME_OVER || this.state === GameState.VICTORY) {
                this.startNewGame();
            }
        }
    }
    
    // 游戏循环
    gameLoop() {
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.onload = () => {
    new Game();
};