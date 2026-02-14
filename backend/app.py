from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

# Socket.IO 초기화 - CORS 설정 강화
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    ping_timeout=60,
    ping_interval=25
)

# 게임 상태 저장 (간단한 프로토타입용 메모리 저장)
game_state = {
    'player1': {
        'name': 'Player 1',
        'terraformingRating': 20,
        'generation': 1,
        'megacredits': {'production': 0, 'resources': 0},
        'steel': {'production': 0, 'resources': 0},
        'titanium': {'production': 0, 'resources': 0},
        'plants': {'production': 0, 'resources': 0},
        'energy': {'production': 0, 'resources': 0},
        'heat': {'production': 0, 'resources': 0}
    },
    'player2': {
        'name': 'Player 2',
        'terraformingRating': 20,
        'generation': 1,
        'megacredits': {'production': 0, 'resources': 0},
        'steel': {'production': 0, 'resources': 0},
        'titanium': {'production': 0, 'resources': 0},
        'plants': {'production': 0, 'resources': 0},
        'energy': {'production': 0, 'resources': 0},
        'heat': {'production': 0, 'resources': 0}
    },
    'player3': {
        'name': 'Player 3',
        'terraformingRating': 20,
        'generation': 1,
        'megacredits': {'production': 0, 'resources': 0},
        'steel': {'production': 0, 'resources': 0},
        'titanium': {'production': 0, 'resources': 0},
        'plants': {'production': 0, 'resources': 0},
        'energy': {'production': 0, 'resources': 0},
        'heat': {'production': 0, 'resources': 0}
    },
    'playerCount': 3
}

@app.route('/api/game-state', methods=['GET'])
def get_game_state():
    """현재 게임 상태 조회"""
    return jsonify(game_state)

@app.route('/api/game-state', methods=['POST'])
def update_game_state():
    """게임 상태 업데이트"""
    data = request.json
    if data:
        game_state.update(data)
    socketio.emit('game_state_update', game_state)
    return jsonify(game_state)

@app.route('/api/player/<player_id>/resource/<resource_type>', methods=['POST'])
def update_resource(player_id, resource_type):
    """특정 플레이어의 리소스 업데이트"""
    data = request.json
    resource_category = data.get('category', 'resources')  # 'resources' or 'production'
    change = data.get('change', 0)

    if player_id in game_state and resource_type in game_state[player_id]:
        game_state[player_id][resource_type][resource_category] += change
        # 음수 방지
        if game_state[player_id][resource_type][resource_category] < 0:
            game_state[player_id][resource_type][resource_category] = 0

    socketio.emit('game_state_update', game_state)
    return jsonify(game_state[player_id])

@app.route('/api/player/<player_id>/rating', methods=['POST'])
def update_rating(player_id):
    """테라포밍 레이팅 업데이트"""
    data = request.json
    change = data.get('change', 0)

    if player_id in game_state:
        game_state[player_id]['terraformingRating'] += change
        if game_state[player_id]['terraformingRating'] < 0:
            game_state[player_id]['terraformingRating'] = 0

    socketio.emit('game_state_update', game_state)
    return jsonify(game_state[player_id])

@app.route('/api/player/<player_id>/name', methods=['POST'])
def update_player_name(player_id):
    """플레이어 이름 업데이트"""
    data = request.json
    new_name = data.get('name', '')

    if player_id in game_state and new_name:
        game_state[player_id]['name'] = new_name

    socketio.emit('game_state_update', game_state)
    return jsonify(game_state[player_id])

@app.route('/api/player/<player_id>/restore', methods=['POST'])
def restore_player_state(player_id):
    """플레이어 상태 복원 (Undo)"""
    data = request.json

    if player_id in game_state and data:
        # 전체 상태를 복원
        game_state[player_id].update(data)

    socketio.emit('game_state_update', game_state)
    return jsonify(game_state[player_id])

@app.route('/api/generation', methods=['POST'])
def next_generation():
    """다음 세대로 이동 (에너지 -> 히트, 생산 -> 리소스) - 모든 플레이어에게 적용"""
    data = request.json

    # 모든 플레이어에게 적용
    for player_id in ['player1', 'player2', 'player3']:
        if player_id in game_state:
            player = game_state[player_id]

            # 에너지를 히트로 변환
            player['heat']['resources'] += player['energy']['resources']
            player['energy']['resources'] = 0

            # Megacredits는 생산량 + Terraforming Rating 적용
            player['megacredits']['resources'] += (player['megacredits']['production'] + player['terraformingRating'])

            # 나머지 리소스는 생산량만 추가
            for resource in ['steel', 'titanium', 'plants', 'energy', 'heat']:
                player[resource]['resources'] += player[resource]['production']

            # 세대 증가
            player['generation'] += 1

    socketio.emit('game_state_update', game_state)
    return jsonify(game_state)

@app.route('/api/player-count', methods=['POST'])
def set_player_count():
    """플레이어 수 설정"""
    data = request.json
    count = data.get('count', 1)
    game_state['playerCount'] = count
    socketio.emit('game_state_update', game_state)
    return jsonify({'playerCount': count})

@app.route('/api/reset', methods=['POST'])
def reset_game():
    """게임 상태 초기화"""
    global game_state
    # 플레이어 이름 보존
    player1_name = game_state.get('player1', {}).get('name', 'Player 1')
    player2_name = game_state.get('player2', {}).get('name', 'Player 2')
    player3_name = game_state.get('player3', {}).get('name', 'Player 3')

    game_state = {
        'player1': {
            'name': player1_name,
            'terraformingRating': 20,
            'generation': 1,
            'megacredits': {'production': 0, 'resources': 0},
            'steel': {'production': 0, 'resources': 0},
            'titanium': {'production': 0, 'resources': 0},
            'plants': {'production': 0, 'resources': 0},
            'energy': {'production': 0, 'resources': 0},
            'heat': {'production': 0, 'resources': 0}
        },
        'player2': {
            'name': player2_name,
            'terraformingRating': 20,
            'generation': 1,
            'megacredits': {'production': 0, 'resources': 0},
            'steel': {'production': 0, 'resources': 0},
            'titanium': {'production': 0, 'resources': 0},
            'plants': {'production': 0, 'resources': 0},
            'energy': {'production': 0, 'resources': 0},
            'heat': {'production': 0, 'resources': 0}
        },
        'player3': {
            'name': player3_name,
            'terraformingRating': 20,
            'generation': 1,
            'megacredits': {'production': 0, 'resources': 0},
            'steel': {'production': 0, 'resources': 0},
            'titanium': {'production': 0, 'resources': 0},
            'plants': {'production': 0, 'resources': 0},
            'energy': {'production': 0, 'resources': 0},
            'heat': {'production': 0, 'resources': 0}
        },
        'playerCount': game_state.get('playerCount', 1)
    }
    socketio.emit('game_state_update', game_state)
    return jsonify(game_state)

# Socket.IO 이벤트 핸들러
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    # 새로 연결된 클라이언트에게 현재 게임 상태 전송
    emit('game_state_update', game_state)

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

if __name__ == '__main__':
    # 로컬 개발 환경
    # 모든 네트워크 인터페이스에서 접속 가능하도록 host='0.0.0.0' 설정
    # 이렇게 하면 같은 네트워크의 다른 기기(모바일)에서도 접속 가능
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, debug=True, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)
else:
    # 프로덕션 환경 (AWS Elastic Beanstalk, Render 등)
    # Gunicorn이 이 앱을 실행함
