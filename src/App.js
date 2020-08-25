import React, { useState } from 'react';
import Excel from './components/excel/';
import SMS from './components/sms/';
import Preivew from './components/preview/';
import Balance from './components/balance/'
import Header from './components/header/';
import Filter from './components/filter';
import Recipents from './components/reciepents';
import Mustache from 'mustache';
import { Spin } from 'antd';
import { apikey } from './config.json';
import log from './components/logger';
import './App.css';
import notification from './components/error';

const App = () => {
  const [text, textSetter] = useState('')
  const [studentData, dataSetter] = useState([])
  const [headers, headerSetter] = useState([])
  const [filters, filtersSetter] = useState([])
  const [sendButtonDisabled, sendButtonStateUpdater] = useState(false);

  const handleData = (d) => {
    if (d) {
      d.data.forEach((data) => {
        Object.keys(data).forEach((key) => {
          if(typeof data[key] === 'string')
            data[key] = data[key].trim().replace(',', '')
        })
      })
      dataSetter(d.data)
      headerSetter(d.headers)
    } else {
      dataSetter([])
      headerSetter([])
    }
  }

  let result = [...studentData];
  filters.forEach(filter => {
    switch (filter.type) {
      case 'greater than':
        result = result.filter(item => item[filter.column] > filter.val)
        break
      case 'less than':
        result = result.filter(item => item[filter.column] < filter.val)
        break
      case 'equal to':
        result = result.filter(item => item[filter.column] === filter.val)
        break
      default:
        break
    }
  })

  const addFilter = (filter) => {
    filtersSetter([filter, ...filters])
  }

  const removeFilter = (key) => {
    let new_filters = [...filters.slice(0, key), ...filters.slice(key+1)]
    filtersSetter(new_filters)
  }

  const sendBulkSms = async () => {
    sendButtonStateUpdater(true);
    if (studentData.length === 0) {
      notification({
        error: 'No data loaded',
        errorLog: 'No data loaded',
      })
      sendButtonStateUpdater(false);
      return;
    }

    let texts;
    try {
      texts = result.map(student => Mustache.render(text, student))
    } catch (err) {
      notification({
        error: 'Malformed template!',
        errorLog: err,
      })
      sendButtonStateUpdater(false);
      return;
    }
    let smsList = texts.map((text, idx) => {
      let phone = result[idx].mobile
      return {
        'MobileNumber': phone,
        'SmsText': text,
      }
    })
    console.log(smsList);
    log(2, smsList);
    let sms = JSON.stringify(smsList);
    let url = `http://127.0.0.1:8889/api2.onnorokomsms.com/HttpSendSms.ashx?op=ListSms&apiKey=${apikey}&type=TEXT&smsListJson=${sms}&maskName=&campaignName=`;
    try {
      let resp = await fetch(url);
      let text = await resp.text();
    } catch (err) {
      // TODO: show a popup
      notification({
        error: "APIerror", 
        errorLog: err
      })
      sendButtonStateUpdater(false);
      return;
    }
    let persons = text.split('/')
    persons.pop()
    let successfull = persons.map(person => person.split('||')[0])
                              .filter(status => status === '1900')
                              .length;
    notification({'success': `${successfull}/${persons.length} messages were send successfully`})
    sendButtonStateUpdater(false);
  }

  let renderedPreview = ''
  let previewLoader = false;
  if(studentData.length > 0){
    try{
      previewLoader = false
      renderedPreview = Mustache.render(text, studentData[0])
    } catch (e) {
      previewLoader = true
    }
  } else {
    previewLoader = false
    renderedPreview = 'No data loaded'
  }

  return (
    <div className="App">
      <Header name="SMS"/>
      <div className="ggcontainer">
        <div className="phonebook-contianer">
          <Filter columnNames={headers} filters={filters} onAdd={addFilter} handleRemove={removeFilter}/>
          <Recipents data={result}/>
        </div>
        <div>
          <Excel onData={handleData}/>
          <SMS onChange={textSetter} onSubmit={sendBulkSms} sendButtonDisabled={sendButtonDisabled}/>
        </div>
        <div>
          <Spin spinning={previewLoader}>
            <Preivew message={renderedPreview} />
          </Spin>
          <Balance apikey={apikey}/>
        </div>
      </div>
    </div>
  );
}

export default App;
