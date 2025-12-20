// /pages/user/appointment-steps/ProblemSelect.jsx
import React, { useState } from 'react';
import './ProblemSelect.css';

const ProblemSelect = ({ onNext }) => {
  const [selectedProblem, setSelectedProblem] = useState('');
  const [showOtherPopup, setShowOtherPopup] = useState(false);
  const [otherDescription, setOtherDescription] = useState('');

  const problems = [
    { id: 'fever', name: 'Fever', emoji: '🤒' },
    { id: 'skin', name: 'Skin Rash', emoji: '🩹' },
    { id: 'headache', name: 'Headache', emoji: '🤕' },
    { id: 'stomach', name: 'Stomach Pain', emoji: '🤢' },
    { id: 'back', name: 'Back Pain', emoji: '💪' },
    { id: 'anxiety', name: 'Anxiety', emoji: '😟' },
    { id: 'eye', name: 'Eye Issue', emoji: '👁️' },
    { id: 'other', name: 'Other', emoji: '📝' }
  ];

  const handleProblemClick = (id) => {
    setSelectedProblem(id);
    if (id === 'other') {
      setShowOtherPopup(true);
    }
  };

  const handleNext = () => {
    if (selectedProblem === 'other') {
      if (otherDescription.trim()) {
        onNext(otherDescription);
      } else {
        setShowOtherPopup(true); // Re-open if empty
      }
    } else if (selectedProblem) {
      onNext(selectedProblem);
    }
  };

  const submitOther = () => {
    if (otherDescription.trim()) {
      setShowOtherPopup(false);
      onNext(otherDescription); // Proceed immediately with description
    }
  };

  return (
    <div className="problem-select-container">
      <div className="problem-header">
        <h1>🔍 What's bothering you?</h1>
        <p>Select your main concern</p>
      </div>

      <div className="problems-grid">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={`problem-card ${selectedProblem === problem.id ? 'selected' : ''}`}
            onClick={() => handleProblemClick(problem.id)}
          >
            <div className="problem-emoji">{problem.emoji}</div>
            <div className="problem-name">{problem.name}</div>
          </div>
        ))}
      </div>

      <button
        className={`next-btn ${selectedProblem ? 'active' : ''}`}
        onClick={handleNext}
        disabled={!selectedProblem}
      >
        Next: Choose Location
      </button>

      {/* Description Popup */}
      {showOtherPopup && (
        <div className="popup-overlay">
          <div className="popup-content classic-theme">
            <h2>Describe your problem</h2>
            <p>Please provide a brief description of what you are experiencing.</p>

            <textarea
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              placeholder="E.g., Severe leg pain while walking..."
              rows={4}
              autoFocus
            />

            <div className="popup-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowOtherPopup(false)}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={submitOther}
                disabled={!otherDescription.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSelect;