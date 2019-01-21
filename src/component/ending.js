import React, { Component } from 'react';

class Ending extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          <h3>
            你已完成本轮练习！
            拼图模式：共做{this.props.puzzles.length}题，完美达成  题
            键盘模式：共做{this.props.dictations.length}题，完美达成  题
            
            本轮共获得：金币  个，钻石  个
            目前级别：
          </h3>
          <button>再来一轮吧</button>
          <button>复习易错题</button>
        </div>
      </div>
    )
  }
}

export default Ending;