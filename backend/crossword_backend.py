from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

def enforce_black_white_ratio(grid, target_ratio=0.16):
    """ Ensures the grid maintains an appropriate black-to-white ratio """
    total_cells = len(grid) * len(grid[0])
    target_black_count = int(total_cells * target_ratio)
    current_black_count = sum(row.count('#') for row in grid)
    
    while current_black_count < target_black_count:
        row, col = random.randint(0, len(grid)-1), random.randint(0, len(grid[0])-1)
        if grid[row][col] == " ":
            grid[row][col] = "#"
            current_black_count += 1
    return grid

@app.route('/generate', methods=['POST'])
def generate_crossword():
    data = request.get_json()
    words = data.get("words", [])
    enforce_black_ratio = data.get("enforce_black_ratio", False)
    
    grid_size = 21  # Standard NYT Crossword size
    grid = [[" " for _ in range(grid_size)] for _ in range(grid_size)]
    
    placed_words = []
    word_positions = {}
    
    for word in words:
        row, col = random.randint(0, grid_size-1), random.randint(0, grid_size-1)
        direction = random.choice(["H", "V"])
        
        if direction == "H" and col + len(word) <= grid_size:
            grid[row][col:col+len(word)] = list(word)
            placed_words.append(word)
            word_positions[word] = {"start": [row, col], "direction": direction, "positions": [[row, c] for c in range(col, col + len(word))]}
        elif direction == "V" and row + len(word) <= grid_size:
            for r in range(row, row + len(word)):
                grid[r][col] = word[r - row]
            placed_words.append(word)
            word_positions[word] = {"start": [row, col], "direction": direction, "positions": [[r, col] for r in range(row, row + len(word))]}
    
    if enforce_black_ratio:
        grid = enforce_black_white_ratio(grid)
    
    black_boxes = [[cell == "#" for cell in row] for row in grid]
    
    return jsonify({
        "grid": grid,
        "black_boxes": black_boxes,
        "placed_words": placed_words,
        "word_positions": word_positions
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
