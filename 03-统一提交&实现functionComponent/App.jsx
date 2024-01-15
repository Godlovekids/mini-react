import React from "./core/React.js"
function Counter ({num}) {
  return <div>conuttttttttt{num}</div>
}
function CounterContanier () {
  return <Counter></Counter>
}
function App () {
  return <div id="app">hi-mini <Counter num={10}></Counter><Counter num={20}></Counter> </div>
}
export default App
