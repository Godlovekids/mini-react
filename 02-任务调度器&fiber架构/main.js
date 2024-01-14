// v1原生

// const dom = document.createElement('div')
// dom.id = 'app'

// const textNode = document.createTextNode('')
// textNode.nodeValue = 'app'
// dom.append(textNode)

// document.querySelector('#root').append(dom)


// v2 虚拟DOM
// const textEl = {
//   type: 'TEXT_NODE',
//   props: {
//     nodeValue: 'app'
//   },
//   children: []
// }

// const app = {
//   type: 'DIV',
//   props: {
//     id: 'app'
//   },
//   children: [textEl]
// }

// const dom = document.createElement(app.type)
// dom.id = app.props.id

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// document.querySelector('#root').append(dom)

// v3
// const createElement = (type, props, ...children) => {
//   return {
//     type,
//     props:{
//       ...props,
//       children: children.map(child => {
//         return typeof child === 'string' ? createTextNode(child) : child
//       })
//     }
    
//   }
// }
// const createTextNode = (text) => {
//   return {
//     type: 'TEXT_NODE',
//     props: {
//       nodeValue: text,
//       children: []
//     },
//   }
// }

// // v4
// const App = createElement('div', {id: 'app'}, 'hi-', 'mini-react')
// const render = (el, container) => {
//   let dom = el.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(el.type) 
  

//   Object.keys(el.props).forEach(key => {
//     if(key !== 'children') {
//       dom[key] = el.props[key]
//     }
//   })

//   el.props.children.forEach(child => {
//     render(child, dom)
//   })

//   container.append(dom)
// }

// render(App, document.querySelector('#root'))

// v5

// const ReactDom = {
//   createRoot(container){
    
//     return {
//       render(app){
//         render(app, container)
//       }
//     }
//   }
// }

// ReactDom.createRoot(document.querySelector('#root')).render(App)

// v6
import ReactDom from './core/ReactDom.js'
import App from './App.js'

ReactDom.createRoot(document.querySelector('#root')).render(App)
