import React from "./core/React.js"
// let toggle = false
// function Counter ({num}) {
//   function One () {
//     return <div>one</div>
//   }
//   let two = <div>two</div>
//   function handleClick () {
//     toggle = !toggle
//     console.log(123)
//     React.update()
//   }
//   return (<div><div>{toggle ? <One/> : two}</div><button onClick={handleClick}>conuttttttttt</button></div>)
// }

let toggle = false
function Counter ({num}) {
  function One () {
    return <div>one
      <div>111</div>
      <div>222</div>
    </div>
  }
  let two = <div>two</div>
  let three = <div>three</div>
  function handleClick () {
    toggle = !toggle
    console.log(123)
    React.update()
  }
  return (<div><div>{toggle ? <One/> : two}{toggle && three}</div><button onClick={handleClick}>conuttttttttt</button></div>)
}

function App () {
  return <div id="app">hi-mini <Counter></Counter> </div>
}
export default App
