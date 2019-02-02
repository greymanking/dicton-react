import React, { PureComponent } from 'react';
import Anim from './Anim.js'

class Starter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.start = this.start.bind(this);
  }

  start() {
    this.props.start();
  }

  render() {
    return (
      <Anim classes='fade' in={true}><div className='content bgpeace'>
        <div className='min_page'>
          <h3 style={{ color: '#A26273' }}>欢迎你，{this.props.userName}</h3>
          <h4>
            你已经学习{this.props.learned}个，还需学习{802 - this.props.learned}个<br /><br />
            本次要学习{this.props.newTasks.length}个新单词:<br />
            {this.props.newTasks.map((t) => { return t.keys }).join(' / ')}<br /><br />
            复习{this.props.allTasks.length - this.props.newTasks.length}个单词。
          </h4>
          <div className='margintop'>
            <button className='primary' onClick={this.start}>让我们开始吧！</button>
            <span className='marginleft fontsmall cursordefault' onClick={this.props.changeUser}>
              {'我不是' + this.props.userName}</span>
          </div>
        </div>
      </div></Anim>
    )
  }
}

export default Starter;