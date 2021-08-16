
import NetGraphD3 from './component/networkGraphD3'
import { groupData } from './data.js'

let newIndex = 1

const graph = new NetGraphD3('#app', {
  graphData: groupData,
  onNodeClick: (d) => {
    console.log(`click ${d.id}`)
  },
  /**
   * 双击节点动态新增其关系节点
   * 模拟异步请求获取新增数据
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

export default graph
