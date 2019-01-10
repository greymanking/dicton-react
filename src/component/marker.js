import React from 'react';

function Marker(props) {
  return <div className={'shadow' + (props.show ? '' : ' invisible_absent')}>
    <div className='marker'>
      <div>{props.mark}</div>
    </div>
  </div>
}

export default Marker;