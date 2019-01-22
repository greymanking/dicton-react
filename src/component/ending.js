import React, { Component } from 'react';
import { ACHIEVE } from '../common/consts.js'

class Ending extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let pl=this.props.puzzles.length;
    let dl=this.props.dictations.length;
    let pg=0,dg=0;
    
    for(let p of this.props.puzzles){
      console.log("p.status",p.status,"calc",p.status&ACHIEVE.puzzleSuccess)
      if((p.status&ACHIEVE.puzzleSuccess)==ACHIEVE.puzzleSuccess){
        pg++;
        console.log("pg",pg);
      }
    }
    for(let d of this.props.dictations){
      if((d.status&ACHIEVE.dictSuccess)==ACHIEVE.dictSuccess){
        dg++;
      }
    }

    console.log("pg final",pg);

    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          <h3>
            你已完成本轮练习！<br />
            {pl!==0 && (<React.Fragment>拼图模式胜率：{pg}/{pl} {(pg/pl*100).toFixed(0)}%<br /></React.Fragment>)}
            听写模式胜率：{dg}/{dl} {(dg/dl*100).toFixed(0)}%<br />
            <br />
            本轮共获得：金币  个，钻石  个<br />
            目前级别：
          </h3>
          <button>再来一轮吧</button>
          <button className='marginleft'>复习易错题</button>
        </div>
      </div>
    )
  }
}

export default Ending;