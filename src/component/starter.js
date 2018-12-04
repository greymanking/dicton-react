import React, { Component } from 'react';

class Starter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    
    this.start=this.start.bind(this);
  }

  start() {
    this.props.start();
  }

  render() {
    const loadingTip = <h3>正在载入数据……</h3>
    const readyTip =
      <div>
        <h4>我们今天要学习以下单词</h4>
        <ul style={{textAlign:"left"}}>
        {
          this.props.wordsData.map(
            (task, idx) => {
              return <li>{task.word}</li>
            }
          )
        }
        </ul>
        <button onClick={this.start}>让我们开始吧！</button>
      </div>

    return (
      <div>
        <h3>欢迎你，金雨璇！</h3>
        {this.props.ready ? readyTip : loadingTip}
      </div>
    );
  }
}

export default Starter;