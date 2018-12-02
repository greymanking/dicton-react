import React, { Component } from 'react';
import shuffle from "./shuffle.js"

class PuzzleSpace extends Component {
    constructor(props){
        super(props);
        this.state={pos:0}

        this.next=this.next.bind(this);
    }

    render(){
        var exercise=this.props.wordsData[this.state.pos];
        return(
            <Puzzle word={exercise.word} meaning={exercise.meaning} go={this.next} />
        )
    }

    next(){
        const len=this.props.wordsData.length;
        var curPos=this.state.pos+1;
        this.setState({pos:curPos%len});
    }
}

const NOERROR = 0, SUCCESS = 1, WRONG = 2;

class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            achieve: NOERROR,
            composed: "",
            shuffled: shuffle(this.props.word, 10),
            version: 0
        }
        this.addChar = this.addChar.bind(this);
        this.reflow = this.reflow.bind(this);
        this.onRetry = this.onRetry.bind(this);
        this.checkComposed = this.checkComposed.bind(this);
    }

    addChar(chr) {
        //setState is async and the second param is the callback function
        //this.setState({ composed: this.state.composed + chr }, this.checkComposed);
        var composed = this.state.composed + chr;
        this.setState({
            composed: composed,
            achieve: this.checkComposed(composed)
        });
    }

    onRetry(e){
        this.reflow(this.props.word);
    }

    reflow(word) {
        var newVer = this.state.version + 1;
        this.setState({
            shuffled: shuffle(word, 10),
            achieve: NOERROR,
            composed: "",
            version: newVer
        })
    }

    checkComposed(composed) {
        var word = this.props.word;

        if (composed == word) {
            return SUCCESS;
        } else if (word.indexOf(composed) == 0) {
            return NOERROR;
        } else {
            return WRONG;
        }
    }

    componentWillReceiveProps(newProps) {
    //    if (newProps.word != this.props.word) {
            this.reflow(newProps.word);
    //    }
    }

    render() {
        const buttonStyle = { padding: 10, backgroundColor: "#336699", color: "white" }
        const composedStyle = {}

        var achieved = this.state.achieve;
        if (achieved == SUCCESS) {
            composedStyle.color = "green";
        } else if (achieved == WRONG) {
            composedStyle.color = "red";
        } else {
            composedStyle.color = "black";
        }

        return (
            <div>
                <h3 style={composedStyle}>{this.state.composed}</h3>
                <div>
                    {this.state.shuffled.map(
                        (chr, idx) => {
                            return <PuzzleSlot version={this.state.version} char={chr} key={idx} sendChar={this.addChar} />
                        }
                    )}
                </div>
                <h3>{this.props.meaning}</h3>
                <button style={{display:this.state.achieve == SUCCESS?"none":"inline"}} onClick={this.onRetry}>
                    {"重 试"}
                </button>
                <button style={{display:this.state.achieve == SUCCESS?"inline":"none"}} onClick={this.props.go}>
                    {"继 续"}
                </button>
            </div>
        );
    }
}

class PuzzleSlot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick = function (e) {
        if (!this.state.clicked) {
            this.props.sendChar(this.props.char);
        }
        this.setState({ clicked: true })
    }

    render() {
        const style = {
            display: "inline-block",
            padding: 5,
            fontSize: 25,
            borderBottom: "1px solid black",
            margin: 5,
            cursor: "pointer"
        }

        style.color = this.state.clicked ? "blue" : "black";

        return (
            <span style={style} onClick={this.onClick}>{this.props.char}</span>
        );
    }

    componentWillReceiveProps(newProps) {
        if (newProps.version != this.props.version) {
            this.setState({ clicked: false })
        }
    }
}

export default PuzzleSpace;