
import * as d3 from 'd3'
import { Intersection, ShapeInfo } from 'kld-intersections'

class NetGraphD3 {
  constructor (selector, options) {
    this.selector = selector

    const {
      width=1200,
      height=1000,
      graphData,
      radius=10,
      nodeColor='#00e0fb',
      linkColor='#a5e6ef',
      foucsColor='#fc7485',
      arrowColor='#a5e6ef',
      textColor='#a5e6ef',
      svgBackground=['#182c69', '#091634'],
      defaultLinkDistance=100,
      onNodeClick,
      mouseenterNode,
      dbClickNode
    } = options

    this.options = {
      width,
      height,
      graphData,
      radius,
      nodeColor,
      linkColor,
      foucsColor,
      arrowColor,
      textColor,
      defaultLinkDistance,
      onNodeClick,
      mouseenterNode,
      dbClickNode,
      svgBackground
    }

    this.init()
    this.render()
  }
 
  init () {
    this.nodes = this.options.graphData.nodes.map(d => Object.create(d))
    this.links = this.options.graphData.links.map(l => Object.create(l))

    this.multiLinkGroup(this.links)

    this.simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links)
                         .distance(d => d.ng || this.options.defaultLinkDistance)
                         .id(d => d.id))
        .force('collide',d3.forceCollide().radius(this.options.radius))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
  }
  render () {
    const svg = d3.select(this.selector)
          .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('background-image', `radial-gradient(${this.options.svgBackground[0]} 25%,  ${this.options.svgBackground[1]} 75%)`)
            .attr('viewBox', [-this.options.width / 2, -this.options.height / 2, this.options.width, this.options.height])
            .call(d3.zoom()
                    .extent([[0, 0], [this.options.width, this.options.height]])
                    .scaleExtent([1, 8])
                    .on('zoom', () => { 
                      const transform = d3.event.transform
                      svg.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`) 
                    }))
                    .on('dblclick.zoom', null)

      const glinks = svg.append('g')
            .attr('stroke', this.options.linkColor)
      this.link = glinks.selectAll('path')
      
    const gNodes = svg.append('g')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
                    
    this.node = gNodes.selectAll('circle')

    this.edgelabels = svg.selectAll('text')
                      
    const defs = svg.append('defs')

    defs.append('marker')
        .attr('id','arrow')
        .attr('markerUnits','userSpaceOnUse')
          .attr('markerWidth','6')
          .attr('markerHeight','6')
          .attr('viewBox','0 -5 10 10') 
          .attr('refX','10')
          .attr('refY','0')
          .attr('fill', this.options.arrowColor)
          .attr('orient','auto')
          .attr('stroke-width', 1)
        .append('path')
          .attr('d','M0,-5L10,0L0,5')
                            
    this.update()
  }
  setPath (d) {
    const sourceX = parseFloat(d.source.x),
        sourceY = parseFloat(d.source.y),
        sourceR = parseFloat(d.source.r || this.options.radius),
        targetX = parseFloat(d.target.x),
        targetY = parseFloat(d.target.y),
        targetR = parseFloat(d.target.r || this.options.radius)

    const sourceCircle = ShapeInfo.circle({
      center: [sourceX, sourceY], radius: sourceR
    })

    const targetCircle = ShapeInfo.circle({
      center: [targetX, targetY], radius: targetR
    })
    const path = ShapeInfo.path(`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`)
    const sourceIntersection = Intersection.intersect(sourceCircle, path).points[0]
   
    
    const targetIntersection = Intersection.intersect(targetCircle, path).points[0]
     if (d.linknum) {
      return `
        M${sourceIntersection.x},${sourceIntersection.y}
        Q${(sourceX + targetIntersection.x) / 2} ${(sourceY + targetIntersection.y) / 2 + (d.linknum * 10)},${targetIntersection.x} ${targetIntersection.y}`
    } else {
      return `M${sourceIntersection.x} ${sourceIntersection.y} L${targetIntersection.x} ${targetIntersection.y}`
    }
  } 
  multiLinkGroup (links) {
    const linkGroup = {}
    links.forEach((link) => {
      const key = link.source < link.target
                ? `${link.source}&${link.target}`
                : `${link.target}&${link.source}`
      if (!linkGroup.hasOwnProperty(key)) {
        linkGroup[key] = []
      }
      linkGroup[key].push(link)
    })

    for (const group in linkGroup) {
      const leftArr = []
      const rightArr = []
      if (linkGroup[group].length === 2) {
        leftArr.push(linkGroup[group][0])
        rightArr.push(linkGroup[group][1])
      } else {
        for (const link of linkGroup[group]) {
          if (`${link.source}&${link.target}` === group) {
            leftArr.push(link)
          } else {
            rightArr.push(link)
          }
        }
      }
      let positive = 1
      let negative = -1
      if (linkGroup[group].length < 2) {
        continue
      }
      leftArr.map(left => {
        left.linknum = positive++
      })
      rightArr.map(right => {
        right.linknum = negative--
      })
    }
  }
  drag (simulation) {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d3.event.x
      d.fy = d3.event.y
    }
    
    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
    
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }
  updateNodeAndLinks (data) {
    const newNode = Object.create(data.node)
    const newLinks = Object.create(data.link)
    this.nodes.push(newNode)
    this.links.push(newLinks)
    this.update()
  }
  update () {
    const node = this.node
          .data(this.nodes, d => d.id)
          .enter().append('circle')
            .attr('id', d => d.id)
            .attr('fill', d => d.color || this.options.nodeColor)
            .attr('r', d => d.r || this.options.radius)
            .merge(this.node)
          .call(this.drag(this.simulation))
          .on('mouseenter', d => {
            this.mouseenterStyle(d)
            
            if (this.isFunction(this.options.mouseenter)) {
              this.options.mouseenterNode()
            }
          })
          .on('mouseout', d => {
            this.mouseoutStyle(d)
          })
          .on('click', (d) => {
            if (this.isFunction(this.options.onNodeClick)) {
              this.options.onNodeClick(d)
            }
          })
          .on('dblclick', (d) => {
            if (this.isFunction(this.options.dbClickNode)) {
              this.options.dbClickNode(d)
            }
          })

    node.append('title')
        .text(d => d.id)  

    const link = this.link
          .data(this.links)
          .enter().append('path')
          .attr('stroke-width', 1)
          .attr('id', (d) => `link_${d.id}`)
          .attr('stroke', this.options.linkColor)
          .attr('marker-end','url(#arrow)')
          .merge(this.link)

    const edgelabels = this.edgelabels
          .data(this.links)
          .enter().append('text')
            .attr('id', d => `text_${d.id}`)
            .append('textPath')
              .attr('xlink:href', d => `#link_${d.id}`)
              .text((d) => d.type)
              .style('text-anchor', 'middle')
              .style('font-size', '7')
              .style('fill', this.options.textColor)
              .attr('startOffset', '50%')
            .merge(this.edgelabels)
        
    this.node = node
    this.link = link
    this.edgelabels = edgelabels

    this.simulation.nodes(this.nodes)
    this.simulation.force('link')
                    .links(this.links)

    this.simulation.on('tick', () => {
      node.attr('cx', d => d.x)
          .attr('cy', d => d.y)
      link.attr('d', (d) => this.setPath(d))
          .attr('fill-opacity', '0')
      
    })
  }
  mouseenterStyle (d) {
    const param = {
      id: d.id,
      nodeColor: this.options.foucsColor,
      linkColor: this.options.foucsColor,
      textColor: this.options.foucsColor,
      nodeStrokeWidth: 3,
      fontSize: 10,
    }
    this.nodeAndLinkStyle(param)
  }
  mouseoutStyle (d) {
    const param = {
      id: d.id,
      linkColor: this.options.linkColor,
      textColor: this.options.textColor,
      nodeStrokeWidth: 1,
      fontSize: 5
    }
    this.nodeAndLinkStyle(param)
  }
  nodeAndLinkStyle (param) {
    d3.select(`#${param.id}`)
      .style('stroke', param.nodeColor && param.nodeColor)
      .style('stroke-width', param.nodeColor && param.nodeStrokeWidth)
    
    this.links.map(link => {
      if (link.source.id === param.id) {
        d3.select(`#link_${link.id}`)
          .style('stroke', param.linkColor)
        d3.selectAll('textPath')
          .filter(function (d,  i) {
            return this.href.baseVal === `#link_${link.id}`
          })
          .style('fill', param.textColor)
          .style('font-size', param.fontSize)
      }
    })
  }
  isFunction (val) {
    return typeof val === 'function'
  }
}

export default NetGraphD3
