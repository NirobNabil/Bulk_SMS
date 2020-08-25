import React from 'react';
import PropTypes from 'prop-types';
import './index.css'

const Recipents = ({data}) => {
  return (
    <div className="recipents-container">
      <div className="title">Receipents ({data.length})</div>
      <div className="recipents">
        {data.map((info, k) => <div key={k} className="number">{info.name} - {info.mobile}</div>)}
      </div>
    </div>
  )
}

Recipents.propTypes = {
  data: PropTypes.array,
}

export default Recipents;