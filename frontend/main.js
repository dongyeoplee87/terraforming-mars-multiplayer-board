const { createApp } = Vue;

// 동적 API URL 설정 - 모바일 접속 시 PC IP로 연결
const getApiBaseUrl = () => {
    // 현재 페이지의 호스트를 사용 (모바일에서 PC IP로 접속한 경우)
    const hostname = window.location.hostname;
    const port = '5000';

    // localhost인 경우 그대로 사용, 아니면 현재 호스트 사용
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        return `http://${hostname}:${port}/api`;
    }
};

const API_BASE_URL = getApiBaseUrl();
console.log('API URL:', API_BASE_URL); // 디버깅용

// 계산기 모달 컴포넌트
const CalculatorModal = {
    props: ['resource', 'currentValue', 'show'],
    emits: ['close', 'spend', 'gain'],
    data() {
        return {
            inputValue: '0'
        };
    },
    template: `
        <div class="modal-overlay" v-if="show" @click="handleOverlayClick">
            <div class="calculator-modal" @click.stop>
                <button class="back-button" @click="close">Back</button>
                <div class="calculator-header">
                    <div class="current-amount">{{ currentValue }} {{ resource.name.toLowerCase() }}</div>
                    <div class="input-display">{{ inputValue }}</div>
                </div>
                <div class="calculator-buttons">
                    <button @click="appendNumber('7')">7</button>
                    <button @click="appendNumber('8')">8</button>
                    <button @click="appendNumber('9')">9</button>
                    <button @click="appendNumber('4')">4</button>
                    <button @click="appendNumber('5')">5</button>
                    <button @click="appendNumber('6')">6</button>
                    <button @click="appendNumber('1')">1</button>
                    <button @click="appendNumber('2')">2</button>
                    <button @click="appendNumber('3')">3</button>
                    <button @click="appendNumber('0')" class="zero-button">0</button>
                    <button @click="clear" class="clear-button">C</button>
                </div>
                <div class="calculator-actions">
                    <button class="spend-button" @click="spend">Spend {{ resource ? resource.name : 'Megacredits' }}</button>
                    <button class="gain-button" @click="gain">Gain {{ resource ? resource.name : 'Megacredits' }}</button>
                </div>
            </div>
        </div>
    `,
    methods: {
        appendNumber(num) {
            if (this.inputValue === '0') {
                this.inputValue = num;
            } else {
                this.inputValue += num;
            }
        },
        clear() {
            this.inputValue = '0';
        },
        spend() {
            const amount = parseInt(this.inputValue);
            if (amount > 0) {
                this.$emit('spend', amount);
                this.inputValue = '0';
                this.close();
            }
        },
        gain() {
            const amount = parseInt(this.inputValue);
            if (amount > 0) {
                this.$emit('gain', amount);
                this.inputValue = '0';
                this.close();
            }
        },
        close() {
            this.inputValue = '0';
            this.$emit('close');
        },
        handleOverlayClick() {
            this.close();
        }
    }
};

// 리소스 카드 컴포넌트
const ResourceCard = {
    props: ['resource', 'playerData', 'playerId'],
    emits: ['update', 'open-calculator'],
    template: `
        <div class="resource-card" :style="{ backgroundColor: resource.color }">
            <div class="resource-header" @click="openCalculator">
                <h3>{{ resource.name }}</h3>
                <div class="resource-main-value">{{ playerData.resources }}</div>
                <div class="resource-info" v-if="resource.info">{{ resource.info }}</div>
            </div>
            <div class="resource-production">
                <button @click="updateProduction(-1)">−</button>
                <span class="production-value">{{ playerData.production }}</span>
                <button @click="updateProduction(1)">+</button>
            </div>
        </div>
    `,
    methods: {
        updateProduction(change) {
            this.$emit('update', { category: 'production', change });
        },
        openCalculator() {
            this.$emit('open-calculator', {
                resource: this.resource,
                playerId: this.playerId,
                currentValue: this.playerData.resources
            });
        }
    }
};

createApp({
    components: {
        ResourceCard,
        CalculatorModal
    },
    data() {
        return {
            playerCount: 1,
            showCalculator: false,
            editingPlayerName: null, // 'player1', 'player2', or null
            editingNameValue: '',
            // 각 플레이어별 히스토리 스택 (최대 10개)
            playerHistory: {
                player1: [],
                player2: []
            },
            calculatorData: {
                resource: null,
                playerId: null,
                currentValue: 0
            },
            gameState: {
                player1: {
                    name: 'Player 1',
                    terraformingRating: 14,
                    generation: 1,
                    megacredits: { production: 0, resources: 0 },
                    steel: { production: 0, resources: 0 },
                    titanium: { production: 0, resources: 0 },
                    plants: { production: 0, resources: 0 },
                    energy: { production: 0, resources: 0 },
                    heat: { production: 0, resources: 0 }
                },
                player2: {
                    name: 'Player 2',
                    terraformingRating: 14,
                    generation: 1,
                    megacredits: { production: 0, resources: 0 },
                    steel: { production: 0, resources: 0 },
                    titanium: { production: 0, resources: 0 },
                    plants: { production: 0, resources: 0 },
                    energy: { production: 0, resources: 0 },
                    heat: { production: 0, resources: 0 }
                }
            },
            resources: [
                {
                    type: 'megacredits',
                    name: 'Megacredits',
                    color: '#FFD700',
                    info: ''
                },
                {
                    type: 'steel',
                    name: 'Steel',
                    color: '#A0826D',
                    info: '1 Steel = 2 Megacredits'
                },
                {
                    type: 'titanium',
                    name: 'Titanium',
                    color: '#A8A8A8',
                    info: '1 Titanium = 3 Megacredits'
                },
                {
                    type: 'plants',
                    name: 'Plants',
                    color: '#7CB342',
                    info: '8 Plants = 1 Greenery Tile'
                },
                {
                    type: 'energy',
                    name: 'Energy',
                    color: '#9C27B0',
                    info: 'Energy → Heat'
                },
                {
                    type: 'heat',
                    name: 'Heat',
                    color: '#F44336',
                    info: '8 Heat = 1 Temperature'
                }
            ]
        };
    },
    computed: {
        currentGeneration() {
            // 모든 플레이어의 세대는 동일하므로 player1의 값을 사용
            return this.gameState.player1.generation;
        }
    },
    async mounted() {
        await this.loadGameState();
    },
    methods: {
        // 플레이어 상태를 히스토리에 저장
        savePlayerState(playerId) {
            const currentState = JSON.parse(JSON.stringify(this.gameState[playerId]));
            this.playerHistory[playerId].push(currentState);
            // 최대 10개까지만 저장
            if (this.playerHistory[playerId].length > 10) {
                this.playerHistory[playerId].shift();
            }
        },
        // Undo 기능
        async undoPlayerAction(playerId) {
            if (this.playerHistory[playerId].length > 0) {
                const previousState = this.playerHistory[playerId].pop();
                try {
                    // 백엔드에 전체 상태 업데이트
                    const response = await fetch(`${API_BASE_URL}/player/${playerId}/restore`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(previousState)
                    });
                    const updatedPlayer = await response.json();
                    this.gameState[playerId] = updatedPlayer;
                } catch (error) {
                    console.error('Failed to undo action:', error);
                    // 실패 시 히스토리에 다시 추가
                    this.playerHistory[playerId].push(previousState);
                }
            }
        },
        async loadGameState() {
            try {
                const response = await fetch(`${API_BASE_URL}/game-state`);
                const data = await response.json();
                this.gameState = {
                    player1: data.player1,
                    player2: data.player2
                };
                this.playerCount = data.playerCount;
            } catch (error) {
                console.error('Failed to load game state:', error);
            }
        },
        async updateResource(playerId, resourceType, { category, change }) {
            // 변경 전 상태 저장
            this.savePlayerState(playerId);

            try {
                const response = await fetch(`${API_BASE_URL}/player/${playerId}/resource/${resourceType}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category, change })
                });
                const updatedPlayer = await response.json();
                this.gameState[playerId] = updatedPlayer;
            } catch (error) {
                console.error('Failed to update resource:', error);
                // 실패 시 저장한 상태 제거
                this.playerHistory[playerId].pop();
            }
        },
        async updateRating(playerId, change) {
            // 변경 전 상태 저장
            this.savePlayerState(playerId);

            try {
                const response = await fetch(`${API_BASE_URL}/player/${playerId}/rating`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ change })
                });
                const updatedPlayer = await response.json();
                this.gameState[playerId] = updatedPlayer;
            } catch (error) {
                console.error('Failed to update rating:', error);
                // 실패 시 저장한 상태 제거
                this.playerHistory[playerId].pop();
            }
        },
        async nextGeneration() {
            try {
                const response = await fetch(`${API_BASE_URL}/generation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                const updatedState = await response.json();
                // 모든 플레이어의 상태 업데이트
                this.gameState.player1 = updatedState.player1;
                this.gameState.player2 = updatedState.player2;
            } catch (error) {
                console.error('Failed to advance generation:', error);
            }
        },
        async updatePlayerCount() {
            try {
                await fetch(`${API_BASE_URL}/player-count`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: this.playerCount })
                });
            } catch (error) {
                console.error('Failed to update player count:', error);
            }
        },
        async resetGame() {
            if (confirm('새 게임을 시작하시겠습니까? 모든 진행 상황이 초기화됩니다.')) {
                try {
                    await fetch(`${API_BASE_URL}/reset`, {
                        method: 'POST'
                    });
                    await this.loadGameState();
                } catch (error) {
                    console.error('Failed to reset game:', error);
                }
            }
        },
        openCalculator(data) {
            this.calculatorData = data;
            this.showCalculator = true;
        },
        closeCalculator() {
            this.showCalculator = false;
        },
        async handleSpend(amount) {
            await this.updateResource(
                this.calculatorData.playerId,
                this.calculatorData.resource.type,
                { category: 'resources', change: -amount }
            );
        },
        async handleGain(amount) {
            await this.updateResource(
                this.calculatorData.playerId,
                this.calculatorData.resource.type,
                { category: 'resources', change: amount }
            );
        },
        startEditingPlayerName(playerId) {
            this.editingPlayerName = playerId;
            this.editingNameValue = this.gameState[playerId].name;
        },
        async savePlayerName(playerId) {
            if (this.editingNameValue.trim()) {
                try {
                    const response = await fetch(`${API_BASE_URL}/player/${playerId}/name`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: this.editingNameValue.trim() })
                    });
                    const updatedPlayer = await response.json();
                    this.gameState[playerId] = updatedPlayer;
                } catch (error) {
                    console.error('Failed to update player name:', error);
                }
            }
            this.editingPlayerName = null;
            this.editingNameValue = '';
        },
        cancelEditingPlayerName() {
            this.editingPlayerName = null;
            this.editingNameValue = '';
        }
    }
}).mount('#app');
