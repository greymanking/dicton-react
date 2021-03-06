import React, { PureComponent } from 'react';

class Starter extends PureComponent {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.toggleAnim = () => this.setState({ anim: !this.state.anim })
  }

  start() {
    this.props.start();
  }

  render() {
    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          <h3 style={{ color: '#A26273' }}>欢迎你，{this.props.userName}</h3>
          <h4>
            你已经学习{this.props.learned}个，还需学习{802 - this.props.learned}个<br /><br />
            本次要学习{this.props.newTasks.length}个新单词:<br />
            {this.props.newTasks.map((t) => { return t.keys }).join(' / ')}<br /><br />
            复习{this.props.allTasks.length - this.props.newTasks.length}个单词。
          </h4>
          <div className='margintop'>
            <button className='primary' onClick={this.start}>Let's Go！</button>
            <button className='marginleft primary' onClick={this.props.changeUser}>切换用户</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Starter;