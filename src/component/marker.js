import React from 'react';

function Marker(props) {
  return <div className={'shade' + (props.show ? '' : ' invisible_absent')}>
    <div className='marker_box'>
      {props.mark}
    </div>
  </div>
}

export default Marker;