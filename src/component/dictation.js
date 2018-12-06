import React, { Component } from 'react';

const NOERROR = "noerror", SUCCESS = "right", WRONG = "wrong";

class Dictation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: NOERROR,
      composed: "",
    }
    
    this.player=React.createRef();

    this.onInput = this.onInput.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  onInput(event) {
    const composed = event.target.value;
    this.setState({
      composed: composed,
      achieve: this.checkComposed(composed)
    });
  }

  onKeyPress(event) {
    if (event.charCode === 13) {
      console.log("enter")
      if (this.state.achieve === SUCCESS) {
        console.log("ss");
        this.next();
      } else {
        console.log("re");
        this.reflow();
      }
    }
  }

  playSound() {
    setTimeout(() => {
      let pl=this.player.current;
      if(pl){
        pl.play(); 
      }
    },700)
  }

  reflow() {
    this.setState({
      achieve: NOERROR,
      composed: "",
    })
    this.playSound();
    document.getElementById("text-input").focus();
  }

  checkComposed(composed) {
    const keys = this.props.taskData[this.state.pos].keys;

    if (composed === keys) {
      return SUCCESS;
    } else if (keys.indexOf(composed) === 0) {
      return NOERROR;
    } else {
      return WRONG;
    }
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
    document.getElementById("text-input").focus();
  }

  render() {
    const success = this.state.achieve === SUCCESS

    return (
      <div className="container">
        <audio ref={this.player} src={"sounds/" + this.props.taskData[this.state.pos].audio} />
        <input id="text-input" value={this.state.composed} className={this.state.achieve}
          onChange={this.onInput} onKeyPress={this.onKeyPress} />
        <h3 className="info-display">{this.props.taskData[this.state.pos].info}</h3>
        <button style={{ display: success ? "none" : "inline" }} onClick={this.reflow}>
          {"清 空"}
        </button>
        <button style={{ display: success ? "inline" : "none" }} onClick={this.next}>
          {"继 续"}
        </button>
      </div>
    );
  }
}

export default Dictation;