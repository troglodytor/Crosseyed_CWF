import React, { useState, useEffect } from "react";
import axios from "axios";

const CrosswordApp = () => {
  const [words, setWords] = useState("");
  const [crossword, setCrossword] = useState(null);
  const [error, setError] = useState(null);
  const [gridSize, setGridSize] = useState(21);
  const [colorized, setColorized] = useState(false);
  const [wordColorMap, setWordColorMap] = useState(new Map());
  const [wordNumbers, setWordNumbers] = useState({});
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (crossword) {
      setGridSize(crossword.grid.length);
    }
  }, [crossword]);

  const colors = ["#FF6B6B", "#6B6BFF", "#FFD93D", "#6BFF6B", "#FF6BFF", "#6BFFD3"];
  let colorIndex = 0;

  const assignWordColors = (words) => {
    const newColorMap = new Map(wordColorMap);
    words.forEach((word) => {
      if (!newColorMap.has(word)) {
        newColorMap.set(word, colors[colorIndex % colors.length]);
        colorIndex++;
      }
    });
    setWordColorMap(newColorMap);
  };

  const handleGenerate = async () => {
    setError(null);
    try {
      const wordList = words.split(",").map((w) => w.trim().toUpperCase());
      const response = await axios.post("http://localhost:5001/generate", { words: wordList, enforce_black_ratio: true });
      console.log("Backend Response:", response.data);
      console.log("Word Positions:", response.data.word_positions);

      if (!response.data.grid) {
        throw new Error("Invalid response from backend");
      }

      assignWordColors(response.data.placed_words);

      const newWordNumbers = {};
      let horizontalCount = 1;
      let verticalCount = 1;

      response.data.placed_words.forEach((word) => {
        const position = response.data.word_positions[word];
        if (position && position.start) {
          const { start, direction } = position;
          const key = `${start[0]},${start[1]}`;
          if (direction === "H") {
            newWordNumbers[key] = horizontalCount++;
          } else {
            newWordNumbers[key] = verticalCount++;
          }
        } else {
          console.error(`Invalid position data for word: ${word}`, position);
        }
      });

      setCrossword(response.data);
      setWordNumbers(newWordNumbers);
    } catch (err) {
      setError("Error generating crossword. Please check input and try again.");
      console.error("Error in handleGenerate:", err);
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6">Crossword Generator</h1>
      <div className="flex flex-col items-center w-full">
        <label className="text-lg font-medium mb-2">Enter words and click generate</label>
        <textarea
          className="border p-4 w-3/4 h-32 text-center text-lg shadow-md bg-gray-50 rounded-lg resize-none"
          placeholder="Enter words separated by commas..."
          value={words}
          onChange={(e) => setWords(e.target.value)}
        />
      </div>
      <div className="mt-6 flex gap-6">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600" onClick={handleGenerate}>
          Generate Crossword
        </button>
        {crossword && crossword.grid && (
          <button className="px-6 py-3 bg-purple-500 text-white rounded-lg text-lg hover:bg-purple-600" onClick={toggleDebugMode}>
            {debugMode ? "Hide Debug Colors" : "Enable Colors"}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {crossword && crossword.grid && (
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Generated Crossword</h2>
          <div
            className="grid border"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              gap: "2px",
              width: "90vw",
              maxWidth: "900px",
              height: "90vw",
              maxHeight: "900px",
            }}
          >
            {crossword.grid.flat().map((cell, index) => {
              const rowIndex = Math.floor(index / gridSize);
              const colIndex = index % gridSize;
              const isBlack = crossword.black_boxes[rowIndex]?.[colIndex] || false;
              let backgroundColor = "white";
              let textColor = "black";
              let fontWeight = "normal";
              if (isBlack) {
                backgroundColor = "black";
                textColor = "white";
                cell = ""; 
              } else if (debugMode && cell) {
                const word = crossword.placed_words.find((w) => w.includes(cell));
                if (word && wordColorMap.has(word)) {
                  textColor = wordColorMap.get(word);
                  backgroundColor = `${wordColorMap.get(word)}40`;
                  fontWeight = "bold";
                }
              }
              const wordNumber = wordNumbers[`${rowIndex},${colIndex}`] || null;
              return (
                <div key={index} className="relative flex items-center justify-center border"
                  style={{ backgroundColor, color: textColor, fontWeight }}>
                  {wordNumber && (
                    <span style={{ position: "absolute", top: "2px", left: "3px", fontSize: "60%", fontWeight: "bold", color: "black" }}>
                      {wordNumber}
                    </span>
                  )}
                  {cell || ""}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordApp;
