import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input} from 'antd';
import './index.css';

const { TextArea } = Input;

const SMS = (props) => {
  return (
    <div className="sms-container">
      <div className="label" >SMS template</div>
      <TextArea rows={12} onChange={(evt) => props.onChange(evt.target.value)}/>
      <Button type="primary" disabled={props.sendButtonDisabled} onClick={props.onSubmit}>Send</Button>
    </div>
  )
}

SMS.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onKeyChange: PropTypes.func,
  sendButtonDisabled: PropTypes.bool,
}

export default SMS;

