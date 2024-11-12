import React, { useState } from "react";
import "./Dictionary.css";

const Dictionary = () => {
  const [extension, setExtension] = useState(""); // Word input state
  const [output, setOutput] = useState(null); // Results state
  const [error, setError] = useState(""); // Error message state

  const api_url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const data_fetching = async () => {
    try {
      const data = await fetch(api_url + extension);
      if (!data.ok) {
        throw new Error("Word not found");
      }

      const result = await data.json();
      const item = result[0];

      const formattedData = {
        word: item.word,
        phonetics: item.phonetics && (item.phonetics[1] || item.phonetics[0]), // Ensure phonetics exists
        definition:
          item.meanings[0]?.definitions[1]?.definition ||
          item.meanings[0]?.definitions[0]?.definition, // Default to the first definition if second is missing
        example:
          item.meanings[0]?.definitions[1]?.example ||
          item.meanings[0]?.definitions[0]?.example, // Default to the first example if second is missing
        synonym: item.meanings[0]?.synonyms[0], // Check for synonym
      };

      setOutput(formattedData);
      setError(""); // Clear error if word is found
    } catch (err) {
      setError("Word not found"); // Set error message if word is not found
      setOutput(null); // Clear any previous results
    }
    setExtension(""); // Clear the input field after clicking the button
  };

  return (
    <div className="dictionary-container">
      <h1 className="title">Dictionary</h1>
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={extension}
          onChange={(e) => setExtension(e.target.value)}
          placeholder="Enter a word..."
        />
        <button className="search-button" onClick={data_fetching}>
          Search
        </button>
      </div>

      {/* Show error message if no word is found */}
      {error && <div className="error-message">{error}</div>}

      {output && (
        <div className="results-container">
          <h2 className="word">Word: {output.word}</h2>
          {/* Check if phonetics is available */}
          {output.phonetics && (
            <p className="phonetic">
              Phonetic: {output.phonetics.text || "No phonetic available"}
            </p>
          )}
          {output.phonetics && output.phonetics.audio && (
            <audio controls className="audio-player">
              <source src={output.phonetics.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <h3 className="definition">Definition: {output.definition}</h3>
          {output.example && (
            <p className="example">Example: {output.example}</p>
          )}
          {output.synonym && (
            <p className="synonym">Synonym: {output.synonym}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dictionary;
