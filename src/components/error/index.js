import { message } from 'antd';
import log from '../logger'

const notification = (props) => {
  if(props.error){
    message.error(props.error, (props.duration ? props.duration : 5))
    log(0, props.errorLog)
  }
  if(props.success){
    message.success(props.success, (props.duration ? props.duration : 2))
  }
}

export default notification;