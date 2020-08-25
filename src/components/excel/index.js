import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUpload from '../../utils/uploader';
import log from '../logger';
import './index.css'
import { Workbook } from 'exceljs';
import { Select, Popover } from 'antd';
import notification from '../error'

const { Option } = Select

const getSheets = (workbook) => workbook.worksheets.map((sheet) => sheet.name)

const getHeaders = (sheet) => {
  let headers = sheet.getRow(1).values;
  headers.shift()
  return headers
          .map((x) => x.toLowerCase())
          .map(header => {
            if (header.includes('mobile') || header.includes('contact') || header.includes('phone'))
              return 'mobile'
            else if (header.includes('student'))
              return 'name'
            else
              return header
          })
}

const parseSheet = (sheet) => {
  if (!sheet){
    return {
      data: [],
      headers: [],
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Do format checking here. in case people upload excel of HR instead of result         //
  //////////////////////////////////////////////////////////////////////////////////////////

  let headers = getHeaders(sheet)
  
  if (!headers.includes('name') || !headers.includes('mobile')) {
    throw Error('`name` or `mobile` field not found in sheet!')
  }

  let data = []
  sheet.eachRow((row, rowNum) => {
    //////////////////////////////////////////////////////////////////////////////////////////
    //check if the row is the first row? otherwise dont go throw all the ifs for each column//
    //////////////////////////////////////////////////////////////////////////////////////////
    if (rowNum === 1)
      return

    let student = {};
    row.values.forEach((val, idx) => {
      let curHeader = headers[idx-1]
      if (curHeader !== 'mobile' && !isNaN(parseInt(val)))
        val = parseInt(val)

      student[curHeader] = val
    });

    data.push(student)
  });

  return {
    headers: headers,
    data: data,
  }
}

const Excel = (props) => {
  const [workbook, workbookSetter] = useState(new Workbook());
  const [sheet, sheetSetter] = useState();
  const [popoverVisible, popoverVisibleSetter] = useState(false);
  const [popoverContent, popoverContentSetter] = useState(<div></div>)

  const handleSheetSelect = (sheetName) => {
    popoverVisibleSetter(false)
    let cur_sheet = workbook.getWorksheet(sheetName);
    sheetSetter(cur_sheet)
    try {
      let data = parseSheet(cur_sheet)
      props.onData(data)
      notification({success: "Sheet parsed successfully!"})
    } catch(err) {
      notification({error: err.toString(), errorLog: err})
      props.onData({
        data: [],
        headers: [],
      })
    }
  }

  const onFile = async (fileData) => {
    try{
      workbookSetter(await workbook.xlsx.load(fileData))
      notification({success: 'Excel file loaded successfully'})
    }catch(e){
      console.log(e);
      notification({error: "provide a valid excel file", errorLog: e})
      return
    }

    const sheets = getSheets(workbook)
    if(sheets.length === 0){
      notification({error: "provide a valid excel file", errorLog: "sheet length zero"})    //this one is because exceljs doesnt throw error if you select a zip file
      return
    }
    
    const options = sheets.map((sheet, id) => <Option key={id} value={sheet}>{sheet}</Option>)
    console.log(options)
    log(3, options)
    popoverContentSetter(
      <div>
        <Select placeholder='Select A sheet!' style={{ width: 140}} onChange={handleSheetSelect}>
          {options}
        </Select>
      </div>
    );
    popoverVisibleSetter(true)
  }

  return (
    <div className="excel-contianer">
      <Popover placement='bottom' content={popoverContent} visible={popoverVisible}>
      <FileUpload onFile={onFile} text={(sheet) ? sheet.name : "Choose Excel file"}/>
      </Popover>
      <div className="columns">
        {sheet && getHeaders(sheet).map((col, key) => <div key={key} className="column">{col}</div>)}
      </div>
    </div>
  )
}

Excel.propTypes = {
  onData: PropTypes.func,
}

export default Excel;