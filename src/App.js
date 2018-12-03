import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'

import './custom.css';

var wordsData = [
  { ID: 1, word: "after", meaning: "在……之后", audio: "after.mp3" },
  { ID: 2, word: "afraid", meaning: "害怕，恐怕", audio: "afraid.mp3" },
  { ID: 3, word: "active", meaning: "积极的，活跃的", audio: "active.mp3" },
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <Puzzle wordsData={wordsData} />
      </div>
    );
  }
}


export default App;
