import React, { useState } from "react";
import "./Dictionary.css";

const Dictionary = () => {
  const [extension, setExtension] = useState("");
  const [output, setOutput] = useState(null);

  const api_url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  const data_fetching = async () => {
    const data = await fetch(api_url + extension);
    if (!data.ok) {
      throw new Error("Word not found");
    }

    const result = await data.json();
    const item = result[0];

    const formattedData = {
      word: item.word,
      phonetics: item.phonetics[1] || item.phonetics[0],
      definition: item.meanings[0].definitions[1]?.definition,
      example: item.meanings[0].definitions[1]?.example,
      synonym: item.meanings[0].synonyms[0],
    };

    setOutput(formattedData);
  };

  return (
    <div className="dictionary-container">
      <h1 className="title">Dictionary </h1>
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
      {output && (
        <div className="results-container">
          <h2 className="word">Word: {output.word}</h2>
          <p className="phonetic">Phonetic: {output.phonetics.text}</p>
          {output.phonetics.audio && (
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
