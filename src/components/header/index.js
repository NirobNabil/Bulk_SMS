import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Header = (props) => {
  return (
    <div className="header">
      <div className="name">{props.name}</div>
    </div>
  )
}

Header.propTypes = {
  name: PropTypes.node,
}

export default Header;