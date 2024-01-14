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

function performanceWorkUnit(work) {
  if(!work.dom) {
    // 1.创建DOM
    let dom = (work.dom = work.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(work.type)) 

    work.parent.dom.append(dom)
    // 2.处理props
    Object.keys(work.props).forEach(key => {
      if(key !== 'children') {
        dom[key] = work.props[key]
      }
    })
  }
  // 3.转换链表
  let children = work.props.children
  let prevChild = null
  children.forEach((child,index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null
    }
    if(index === 0) {
      work.child = newWork
    } else {
      prevChild.sibling = newWork
    }
    prevChild = newWork
  })
  // 4.返回下一个执行任务
  if(work.child) {
    return work.child
  } else if(work.sibling) {
    return work.sibling
  } else {
    return work.parent && work.parent.sibling
  }
}


requestIdleCallback(workLoop)





const React = {
  render,
  createElement
}
export default React
