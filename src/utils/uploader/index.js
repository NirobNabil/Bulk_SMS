import React from 'react'
import PropTypes from 'prop-types'
import './index.css'
import { Icon } from 'antd';
import notification from '../../components/error';


const FileUpload = (props) => {
  const readFile = ({target}) => {
    let files = target.files || []
    if (!files.length)
      return
    let file = files[0];

    let reader = new FileReader();
    reader.onloadend = () => {
      props.onFile(reader.result)
    }
    reader.onerror = (err) => {
      notification({error: 'Error while reading file', errorLog: err})
      console.log(err)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="file-upload">  
      <input type="file" id="file" onClick={readFile} onChange={readFile} />
      <label htmlFor="file"><Icon type='file-excel'></Icon>{props.text}</label>
    </div>
  )
}

FileUpload.propTypes = {
  onFile: PropTypes.func,
  text: PropTypes.string,
}

export default FileUpload;