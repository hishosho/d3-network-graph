# D3 Network Graph

 force-directed graph realized by [D3.js (v4)](https://github.com/d3/d3).

## Live Demo
 [Demo](https://hishosho.github.io/d3-network-graph/dist/index.html)

## Features

* Force simulation.
* Click callbacks.
* Support more than one relationship between two nodes.
* Customize the value of height, width, force collide radius and svg background color.
* Customize the color of nodes and lines.
* Customize the node's radius.
* The node's border and node's relationship lines will change color when mouseover.
* The node's name will display when mouseover.
* When a node is double-clicked, it's child node will be added asynchronously
* Zoom.

## Running

First of all, make sure you have webpack installed. Then, clone the repository, install all dependencies, build and serve the project.

```bash
> git clone https://github.com/hishosho/d3-network-graph.git
> npm install
> npm run dev
```

Open `http://localhost:8080` in your favorite browser.

## Documentation

```javascript
const netGraph = new NetGraphD3('#app', options);
```

### Options

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| **graphData** | *object* | Graph data in [Network Graph data format](#NetGraph-data-format). |
| **width** | *int* | svg's width. Default: 1200. |
| **height** | *int* | svg's height. Default: 1000. |
| **radius** | *int* | force collide radius. Default: 10. |
| **nodeColor** | *string* | node's color. Default: #00e0fb. |
| **linkColor** | *string* | link's color. Default: #a5e6ef. |
| **focusColor** | *string* | focus's color. Default: #fc7485. |
| **arrowColor** | *string* | arrow's color. Default: #a5e6ef. |
| **textColor** | *string* | text's color. Default: #a5e6ef. |
| **svgBackground** | *string[]* | svg's background color. Default: ['#182c69', '#091634']. |
| **defaultLinkDistance** | *number* | link's default distance. Default: 100. |
| **onNodeCilck** | *function* | Callback function to be executed when the user clicks a node. |
| **dbClickNode** | *function* | Callback function to be executed when the user double clicks a node. |
| **mouseenterNode** | *function* | Callback function to be executed when the mouse enters a node. |

### Documentation

#### NetGraph data format

```
{
  nodes: [
    {
      id: 'n1',
      r: 20,
      color: '#173ca7'
    },
    {
      id: 'n2',
    },
     {
      id: 'n3',
    },
  ],
  links: [
    {
      id: 'l1',
      type: '附属于',
      source: 'n1',
      target: 'n2',
    },
    {
      id: 'l2',
      type: '附属于',
      source: 'n1',
      target: 'n3',
    },
  ]
}

```

### Example

Live example @ [https://hishosho.github.io/d3-network-graph/](https://hishosho.github.io/d3-network-graph/)

```javascript
const groupData = {
  nodes: [
    {
      id: 'n1',
      r: 20,
      color: '#173ca7'
    },
    {
      id: 'n2',
    },
    {
      id: 'n3',
    },
    {
      id: 'n4',
    },
    {
      id: 'n5',
      r: 10,
      color: '#7633bf',
    },
    {
      id: 'n6',
    },
    {
      id: 'n7',
    },
    {
      id: 'n8',
      r: 30
    },
    {
      id: 'n9',
    },
    {
      id: 'n10',
    },
    {
      id: 'n11',
    },
    {
      id: 'n12',
    },
    {
      id: 'n13',
    },
    {
      id: 'n14',
    },
    {
      id: 'n15',
    }
  ],
  links: [
    {
      id: 'l1',
      type: '附属于',
      source: 'n1',
      target: 'n2',
      
    },
    {
      id: 'l2',
      type: '附属于',
      source: 'n1',
      target: 'n3',
      
    },
    {
      id: 'l3',
      type: '附属于',
      source: 'n1',
      target: 'n5',
      ng: 400,
      
    },
    {
      id: 'l4',
      type: '附属于',
      source: 'n1',
      target: 'n4',
      
    },
    {
      id: 'l5',
      type: '附属于',
      source: 'n5',
      target: 'n6',
      
    },
    {
      id: 'l6',
      type: '附属于',
      source: 'n5',
      target: 'n7',
      
    },
    {
      id: 'l7',
      type: '附属于',
      ng: 600,
      source: 'n5',
      target: 'n8',
      
    },
    {
      id: 'l8',
      type: '附属于',
      source: 'n5',
      target: 'n9',
      
    },
    {
      id: 'l9',
      type: '附属于',
      source: 'n5',
      target: 'n10',
      
    },
    {
      id: 'l10',
      type: '附属于',
      source: 'n5',
      target: 'n9',
    },
    {
      id: 'l11',
      type: '附属于',
      source: 'n10',
      target: 'n5',
    },
    {
      id: 'l12',
      type: '附属于',
      source: 'n2',
      target: 'n3',
    },
    {
      id: 'l14',
      type: '附属于',
      source: 'n8',
      target: 'n11',
    },
    {
      id: 'l15',
      type: '附属于',
      source: 'n8',
      target: 'n12',
    },
    {
      id: 'l16',
      type: '附属于',
      source: 'n8',
      target: 'n13',
    },
    {
      id: 'l17',
      type: '附属于',
      source: 'n8',
      target: 'n14',
    },
    {
      id: 'l18',
      type: '附属于',
      source: 'n8',
      target: 'n15',
    }
  ]
}

let newIndex = 1

const graph = new NetGraphD3('#app', {
  width: window.innerWidth,
  height: window.innerHeight,
  graphData: groupData,
  onNodeClick: (d) => {
    console.log(`click ${d.id}`)
  },
  /**
   * 双击节点动态新增其关系节点
   * 模拟异步请求获取新增数据
   * When a node is double-clicked, 
   * it's child node will be added asynchronously
   */
  dbClickNode: (d) => {
    setTimeout(() => {
      let i = newIndex++
      const data = {
        node: {
          id: `n_new_${i}`,
          r: 10,
          color: '#1a8436'
        },
        link: {
          id: `l_new_${i}`,
          type: '附属于',
          source: `${d.id}`,
          target: `n_new_${i}`,
        }
      }
      graph.updateNodeAndLinks(data)
    }, 200)
  }
})
```

## What's coming?
* Performance optimization.
* Testing.
