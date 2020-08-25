/*
 * ERROR 0
 * WARN  1
 * INFO  2
 * DEBUG 3
 */

const log = async (level, msg) => {
  let data = JSON.stringify(msg)
  let resp = await fetch(`http://127.0.0.1:8889/127.0.0.1:8887/log/${level}/${data}`);
  console.log(await resp.text())
}

export default log;