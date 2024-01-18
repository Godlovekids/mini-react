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
function Counter({ num }) {
  function One() {
    return <div>one
      <div>111</div>
      <div>222</div>
    </div>
  }
  let two = <div>two</div>
  let three = <div>three</div>
  function handleClick() {
    toggle = !toggle
    console.log(123)
    React.update()
  }
  return (<div><div>{toggle ? <One /> : two}{toggle && three}</div><button onClick={handleClick}>conuttttttttt</button></div>)
}

let countFoo = 1;
function Foo() {
  console.log("foo rerun");
  let update = React.update();
  function handleClick() {
    countFoo++;
    update()
  }
  return (<div><h1>foo</h1>{countFoo}<button onClick={handleClick}>click</button></div>)
}
let countBar = 1;
function Bar() {
  console.log("bar rerun");
  let update = React.update();
  function handleClick() {
    countBar++;
    update();
  }
  return (<div><h1>bar</h1>{countBar}<button onClick={handleClick}>click</button></div>)
}

function App() {
  return <div id="app">hi-mini <Foo></Foo> <Bar></Bar></div>
}
export default App
