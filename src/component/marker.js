import React from 'react';

function Marker(props) {
  return <div className={'marker'+(props.show ? '' : ' invisible_absent')}>
    <div>{props.mark}</div>
  </div>
}

export default Marker;