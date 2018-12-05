import React, { Component } from 'react';

const READY=0, LOADING=1, FAIL=2;

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
    let info=null;
    const ds=this.props.datas;

    if(ds===READY){
      const lst=this.props.taskLists;

      info=
      <div>
        <h4>
          我们今天要学习{lst.learn.length}个新单词:<br />
          {lst.learn.map((t)=>{return t.word}).join(" / ")}<br /><br />
          复习{lst.dictation.length-lst.learn.length}个单词。
        </h4>
        <button onClick={this.start}>让我们开始吧！</button>
      </div>
    } else if(ds===LOADING){
      info=<h3>正在载入数据……</h3>
    } else if(ds===FAIL){
      info=<h3>抱歉，读取数据失败，今天无法学习了 :( </h3>
    }

    return (
      <div>
        <h3 style={{color:'#A26273'}}>欢迎你，金雨璇！</h3>
        {info}
      </div>
    );
  }
}

export default Starter;