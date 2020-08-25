import React, { useState } from 'react';
import { Spin, Button, Icon } from 'antd';
import log from '../logger';
import './index.css';
import PropTypes from 'prop-types';

const Balance = (props) => {
  let [balance, balanceSetter] = useState(<span>Check balance</span>)

  const checkBalance = async () => {
    balanceSetter(<Spin />)
    try {
      let url = `http://127.0.0.1:8889/api2.onnorokomsms.com/HttpSendSms.ashx?op=GetCurrentBalance&apiKey=${props.apikey}`
      let resp = await fetch(url)
      let data = await resp.json()
      balanceSetter(<span>{data} bdt</span>)
    } catch (err) {
      console.log(err)
      log(0, err)
      balanceSetter(<span>Invalid API key</span>)
    }
  }

  return (
    <div className="balance-container">
      <div className="label">Remaining Balance:</div>
      <div id="balancetext">{balance} <Button onClick={checkBalance}><Icon type='reload'></Icon></Button></div>
    </div>
  )
}

Balance.propTypes = {
  apikey : PropTypes.string,
}

export default Balance;