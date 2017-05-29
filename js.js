const width = $(".main-body").width()
const height = 800
let rootTree

let force = d3.layout.force()
    .linkDistance(50)
    .linkStrength(1)
    .friction(0.9)
    .charge(-1100)
    .gravity(0.1)
    .size([width, height])
    .on('tick', tick)

let svg = d3.select('.main-body').append('svg')
    .attr('width', width)
    .attr('height', height)

let link = svg.selectAll('.link')
let node = svg.selectAll('.node')

d3.json('graph.json', function(error, json) {
    if (error) throw error

    rootTree = json
    update()
})

function update() {
    let nodes = flatten(rootTree)
    let links = d3.layout.tree().links(nodes)

    rootTree.root = true
    rootTree.fixed = true
    rootTree.x = width / 2
    rootTree.y = height / 5


    // Restart the force layout.
    force.nodes(nodes)
        .links(links)
        .start()

    // Update links.
    link = link.data(links, function(d) {
        return d.target.id
    })

    link.enter().insert('line', '.node')
        .attr('class', 'link')

    link.exit().remove()

    // Update nodes.
    node = node.data(nodes, function(d) {
        return d.id
    })

    let nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .on('click', click)
        .call(force.drag)

    nodeEnter.append('circle')

    .attr('r', 15) //diagram of the circle

    nodeEnter.append('text')
        .attr('dy', '0.35em')
        .text(function(d) {
            return d.name
        })

    node.select('circle')
        .style('fill', function(d) {
            if (d.root) { // root package
                return '#00ff1e'
            } else if (d._children) { // collapsed package
                return '#3182bd'
            } else if (d.children) { // expanded package
                return '#c6dbef'
            } else {
                return '#fd8d3c' // leaf node
            }
        })

    node.exit().remove()
}

//
function tick(e) {
    let kx = .4 * e.alpha
    let ky = 3.4 * e.alpha
    link.each(function(d) {
            d.target.x += (d.source.x - d.target.x) * kx
            d.target.y += (d.source.y + 75 - d.target.y) * ky
        })
        .attr('x1', function(d) {
            return d.source.x
        })
        .attr('y1', function(d) {
            return d.source.y
        })
        .attr('x2', function(d) {
            return d.target.x
        })
        .attr('y2', function(d) {
            return d.target.y
        })


    node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
    })
}

// add click event listener onto children .
function click(d) {
    if (d3.event.defaultPrevented) return // ignore drag
    if (d.children) {
        d._children = d.children
        d.children = null
    } else {
        d.children = d._children
        d._children = null
    }
    update() //update data
}

// Returns a list of all nodes under the root.
function flatten(rootTree) {
    let nodes = []
    let i = 0

    function recurse(node) {
        if (node.children) {
            node.children.forEach(recurse)
        }
        if (!node.id) {
            node.id = ++i
        }
        nodes.push(node)
    }

    recurse(rootTree)
    return nodes
}
