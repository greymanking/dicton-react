import React, { Component } from 'react';
import '../css/custom.css';

function Marker(props) {
  return <div className='marker' style={{ display: props.show ? 'block' : 'none' }}>
    <div>{props.mark}</div>
  </div>
}

export default Marker;