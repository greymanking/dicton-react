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
    var tips=null;

    if(this.props.ready){
      tips=
      <div>
        <h4>我们今天要学习以下单词</h4>
        <ul style={{textAlign:"left"}}>
        {
          this.props.taskData.map(
            (task, idx) => {
              return <li key={idx}>{task.word}</li>
            }
          )
        }
        </ul>
        <button onClick={this.start}>让我们开始吧！</button>
      </div>
    } else {
      tips=<h3>正在载入数据……</h3>
    }

    return (
      <div>
        <h3>欢迎你，金雨璇！</h3>
        {tips}
      </div>
    );
  }
}

export default Starter;