import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ACHIEVE, ULSTATUS } from '../common/consts.js'

class Ending extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let pl = this.props.puzzles.length;
    let dl = this.props.dictations.length;
    let pg = 0, dg = 0;

    for (let p of this.props.puzzles) {
      if ((p.status & ACHIEVE.puzzleSuccess) === ACHIEVE.puzzleSuccess) {
        pg++;
      }
    }
    for (let d of this.props.dictations) {
      if ((d.status & ACHIEVE.dictSuccess) === ACHIEVE.dictSuccess) {
        dg++;
      }
    }

    let us = this.props.uploadStatus;

    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          {us === ULSTATUS.going && <FontAwesomeIcon icon='spinner' className='load_ani' />}
          {us === ULSTATUS.fail && <FontAwesomeIcon icon='exclamation-triangle' className='colorred' />}
          {us === ULSTATUS.done && <div>
            <h3>
              你已完成本轮练习！<br />
              <br />
              {pl !== 0 && (
                <React.Fragment>
                  <FontAwesomeIcon icon='puzzle-piece' />
                  {pg}/{pl} 胜率{(pg / pl * 100).toFixed(0)}%
                </React.Fragment>
              )}
              <br />
              <FontAwesomeIcon icon='keyboard' />
              {dg}/{dl} 胜率{(dg / dl * 100).toFixed(0)}%
              <br />
              <FontAwesomeIcon icon='yen-sign' />
              <br />
              <FontAwesomeIcon icon='gem' />
              <br />
              目前级别：
            </h3>
            <button className='primary' onClick={this.props.nextrun}>再来一轮吧</button>
            <button className='primary marginleft' onClick={this.props.doFallible}>复习易错题</button>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default Ending;