import React from 'react';

function Pager(props){
  const els=new Array(props.total);
  for(let i=0;i<props.total;i++){
    els[i]=<span key={'el'+i} className={props.cur===i?'pagerel_active':'pagerel_blur'}>●</span>
  }
  return <div className='pager_box'>{els}</div>
}

export default Pager;