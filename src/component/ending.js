import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ACHIEVE, ULSTATUS } from '../common/consts.js'
import { countPerfect } from "../common/utils.js"

class Ending extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let pl = this.props.puzzles.length;
    let dl = this.props.dictations.length;

    let pg = countPerfect(this.props.puzzles, ACHIEVE.puzzleSuccess);
    let dg = countPerfect(this.props.dictations, ACHIEVE.dictSuccess);;

    let us = this.props.uploadStatus;
    let totalCoins = this.props.savedCoins + this.props.coins;
    let level = Math.floor(Math.sqrt(2500 + 200 * totalCoins - 50) / 100);

    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          {us === ULSTATUS.going && <FontAwesomeIcon icon='spinner' className='load_ani fontextralarge' />}
          {us === ULSTATUS.fail && <FontAwesomeIcon icon='exclamation-triangle' className='colorred fontextralarge' />}
          {us === ULSTATUS.done && <div>
            <h3>你已完成本轮练习！</h3>
            <table cellPadding='10px'><tbody>
              <tr><td>本轮胜率</td></tr>
              <tr>{pl !== 0 && <td><FontAwesomeIcon icon='puzzle-piece' /> {pg}/{pl} {(pg / pl * 100).toFixed(0)}%</td>}
                <td><FontAwesomeIcon icon='keyboard' /> {dg}/{dl} {(dg / dl * 100).toFixed(0)}%</td>
              </tr>
              <tr><td>获得财富</td></tr>
              <tr>
                <td><FontAwesomeIcon icon='coins' /> {this.props.coins}个</td>
                <td><FontAwesomeIcon icon='gem' /> {this.props.diamonds}个</td>
              </tr>
              <tr>
                <td>目前级别</td><td>{level}级</td>
              </tr>
            </tbody></table>
            <button className='primary' onClick={this.props.nextrun}>再来一轮吧</button>
            <button className='primary marginleft' onClick={this.props.doFallible}>复习易错题</button>
          </div>}
        </div>
      </div>
    )
  }
}

export default Ending;