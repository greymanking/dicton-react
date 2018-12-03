import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import PuzzleSpace from './puzzle.js'

var wordsData = [
  { ID:1, word: "build", meaning: "建造" },
  { ID:2, word: "destroy", meaning: "破坏" },
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <PuzzleSpace wordsData={wordsData} />
      </div>
    );
  }
}


export default App;
