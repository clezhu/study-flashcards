import { useState } from "react";
import "./App.css";

function Sidebar({ currentPage, onChangePage }) {
  return (
    <div className="sidebar">
      <button
        className={currentPage === "content" ? "active" : ""}
        onClick={() => onChangePage("content")}
      >
        Content
      </button>
      <button
        className={currentPage === "flashcards" ? "active" : ""}
        onClick={() => onChangePage("flashcards")}
      >
        Flashcards
      </button>
    </div>
  );
}

function ContentPage({ onAddFlashcard }) {
  // Tiny fake SoR-style text.
  // Some terms are "flashcardable" with definitions.
  const tokens = [
    { text: "The study of ", type: "plain" },
    { 
      text: "Hasidism", 
      type: "term", 
      term: "Hasidism", 
      definition: "A Jewish mystical movement emphasising joy, prayer, and closeness to God."
    },
    { text: " in modern ", type: "plain" },
    { 
      text: "Judaism", 
      type: "term", 
      term: "Judaism", 
      definition: "The monotheistic religion of the Jewish people, based on covenant with God."
    },
    { text: " reveals how ", type: "plain" },
    { 
      text: "spiritual renewal", 
      type: "term", 
      term: "Spiritual renewal", 
      definition: "A movement or period focused on revitalising religious practice and belief."
    },
    { text: " can shape both individual and communal identity.", type: "plain" },
  ];

  function handleTermClick(term, definition) {
    onAddFlashcard(term, definition);
  }

  return (
    <div className="page">
      <h2>Studies of Religion Content</h2>
      <p>
        {tokens.map((token, index) => {
          if (token.type === "plain") {
            return <span key={index}>{token.text}</span>;
          }

          // term token
          return (
            <span
              key={token.text + index}
              className="flashcard-term"
              title="Add this term as a flashcard"
              onClick={() => handleTermClick(token.term, token.definition)}
            >
              {token.text}
            </span>
          );
        })}
      </p>
      <p style={{ marginTop: "16px", fontSize: "14px", color: "#6b7280" }}>
        Tip: Click the highlighted green terms to add them to your flashcards.
      </p>
    </div>
  );
}

function Flashcard({ term, definition }) {
  const [showFront, setShowFront] = useState(true);

  function handleFlip() {
    setShowFront(!showFront);
  }

  return (
    <div className="flashcard" onClick={handleFlip}>
      {showFront ? (
        <>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>Term</p>
          <strong>{term}</strong>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
            Click to show definition
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>Definition</p>
          <p>{definition}</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
            Click to show term again
          </p>
        </>
      )}
    </div>
  );
}

function FlashcardsPage({ flashcards }) {
  return (
    <div className="page">
      <h2>Your Flashcards</h2>
      {flashcards.length === 0 && (
        <p>No flashcards yet. Click the highlighted terms in the content to add some.</p>
      )}
      {flashcards.map(card => (
        <Flashcard
          key={card.term}
          term={card.term}
          definition={card.definition}
        />
      ))}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("content");

  // This is where we LIFT STATE UP:
  // All flashcards live here so every page can see them.
  const [flashcards, setFlashcards] = useState([]);

  function handleAddFlashcard(term, definition) {
    // Avoid duplicates: if term already exists, do nothing
    const exists = flashcards.some(card => card.term === term);
    if (exists) return;

    setFlashcards([
      ...flashcards,
      { term, definition }
    ]);
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onChangePage={setCurrentPage} />

      {currentPage === "content" ? (
        <ContentPage onAddFlashcard={handleAddFlashcard} />
      ) : (
        <FlashcardsPage flashcards={flashcards} />
      )}
    </div>
  );
}

export default App;
