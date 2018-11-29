import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

var records = [
  { ID:1, word: "build", meaning: "建造" },
  { ID:2, word: "destroy", meaning: "破坏" },
]

function Page(props) {
  return (
    <div>
    <h3>{props.word}</h3>
    <div>{props.meaning}</div>
    </div>
  );
}

function Pages() {
  return records.map((r)=>{
    return <Page key={r.ID} word={r.word} meaning={r.meaning} />
  });
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <Pages />
      </div>
    );
  }
}


export default App;
