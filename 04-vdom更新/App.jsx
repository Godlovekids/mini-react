import React from "./core/React.js"
let count = 1
function Counter ({num}) {
  return <div onClick={handleClick}>conuttttttttt{count}</div>
}
function handleClick () {
  count++
  console.log(123)
  React.update()
}
function CounterContanier () {
  return <Counter></Counter>
}
function App () {
  return <div id="app">hi-mini <Counter num={10}></Counter> </div>
}
export default App
