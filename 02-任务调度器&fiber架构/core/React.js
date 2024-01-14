const createElement = (type, props, ...children) => {
  return {
    type,
    props:{
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    }
    
  }
}
const createTextNode = (text) => {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: []
    },
  }
}

const createDom = (type) => {
  return type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)
}

const updateProps = (dom, props) => {
  Object.keys(props).forEach(key => {
    if(key !== 'children') {
      dom[key] = props[key]
    }
  })
}

const initChildren = (fiber) => {
  let children = fiber.props.children
  let prevChild = null
  children.forEach((child,index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if(index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

const render = (el, container) => {

  nextWorkUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }

}

let nextWorkUnit = null
function workLoop (IdleDeadline) {
  let shouldYield = false
  while(!shouldYield && nextWorkUnit) {
    nextWorkUnit = performanceWorkUnit(nextWorkUnit)
    shouldYield = IdleDeadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

function performanceWorkUnit(fiber) {
  if(!fiber.dom) {
    // 1.创建DOM
    let dom = (fiber.dom = createDom(fiber.type)) 

    fiber.parent.dom.append(dom)
    // 2.处理props
    updateProps(dom, fiber.props)
  }
  // 3.转换链表
  initChildren(fiber)
  // 4.返回下一个执行任务
  if(fiber.child) {
    return fiber.child
  } else if(fiber.sibling) {
    return fiber.sibling
  } else {
    return fiber.parent && fiber.parent.sibling
  }
}


requestIdleCallback(workLoop)





const React = {
  render,
  createElement
}
export default React
