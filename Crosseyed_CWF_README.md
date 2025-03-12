# **Crosseyed CWF - Crossword Generator**

## **📌 Project Overview**

*This project was generated entirely by ChatGPT and steered by a complete novice.*

Crosseyed CWF is a **React + Flask** application that generates **NYT-style crossword puzzles** using the **Collapsing Wave Function (CWF) algorithm**. It follows strict crossword construction rules to ensure a solvable, well-balanced grid.

### **🔹 Key Features**

- **Generates 21x21 Crossword Grids** 🧩
- **Follows NYT Crossword Rules** ✅
- **Uses the Collapsing Wave Function (CWF) Algorithm** 🧠
- **Supports Debug Mode for Visualizing Word Placement** 🎨
- **Backend: Flask API** 🐍
- **Frontend: React UI** ⚛️

---

## **🛠 Installation & Setup**

### **🔹 Prerequisites**

Before running the project, make sure you have:

- **Python 3.9+** (for the backend)
- **Node.js 16+** (for the frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)

### **🔹 Backend Setup (Flask)**

```bash
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate venv (Windows: venv\Scripts\activate)
pip install -r requirements.txt  # Install dependencies
flask run  # Start the Flask server
```

Backend should now be running at: **http://127.0.0.1:5000**

### **🔹 Frontend Setup (React)**

```bash
cd frontend
npm install  # Install dependencies
npm start  # Start React dev server
```

Frontend should now be running at: **http://localhost:3000**

---

## **📏 Crossword Rules & Constraints**

Crosseyed CWF follows **NYT-style crossword construction rules**, including:

- **180-degree rotational symmetry** 🔄
- **16-18% black squares** ⬛
- **Proper framing of words** (black boxes at word boundaries)
- **Interlocking words** (every word must share letters)
- **Unique words** (no duplicates in the grid)
- **Words must fully fit within their brackets**
- **No isolated sections** – All white squares must be part of a single, continuous area. No group of white squares should be completely separated by black squares.

---

## **🧠 How the Collapsing Wave Function (CWF) Works**

The CWF method is an algorithm inspired by **quantum mechanics** and procedural generation. It places words in the grid by progressively reducing the available options in a way that:

- **Starts with maximum flexibility**, then narrows choices based on constraints
- **Ensures valid word intersections** without violating crossword rules
- **Avoids dead-end placements** that cause unsolvable grids
- **Uses an entropy-based approach** to pick the best placement cell

### **🔹 CWF Steps for Word Placement**

1. **Start with an empty 21x21 grid**
2. **Choose a high-priority placement cell** (lowest entropy)
3. **Select a word from the list that fits all constraints**
4. **Place the word and update constraints for neighboring cells**
5. **Repeat until all words are placed or constraints prevent further placement**

---

## **📂 Folder Structure**

```
Crosseyed_CWF/
│── backend/   # Flask API
│   ├── crossword_backend.py
│   ├── requirements.txt
│   ├── start.sh
│── frontend/  # React UI
│   ├── Crossword_frontend.js
│   ├── package.json
│   ├── public/
│   ├── src/
│── README.md  # Project documentation
│── .gitignore # Ignored files
```

---

## **🚀 Future Goals & Improvements**

🔹 **Implement UI for manual crossword adjustments** 🎨🔹 **Enhance debugging visualization** 📊🔹 **Improve word selection heuristics** 🤖🔹 **Optimize for larger grid sizes (e.g., 25x25 puzzles)** 🔎🔹 **Explore deployment options for public use** 🌍

---

## **🤝 Contributing**

If you’d like to contribute, feel free to submit pull requests or report issues! 🛠️

---

## **📜 License**

This project is licensed under the **GPL-3.0 License**.
