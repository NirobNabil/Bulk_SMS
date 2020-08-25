import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Preview = (props) => {
  return (
    <div className="preview-container">
      <div className="preview">Preview</div>
      <div className="message">
        { props.message }
      </div>
    </div>
  )
}

Preview.propTypes = {
  message: PropTypes.string,
}

export default Preview;