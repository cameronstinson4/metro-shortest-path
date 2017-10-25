var nodes = [];
var edges = [];

stations.forEach(function (station) {
  var node = {
    id: station.Code,
    label: `${station.Name}`,
    color: parseColor(station.LineCode1),
    shape: "square",
    mass: 10,
    size: 50,
    title: station.Code,
    font: {size: 50, strokeColor: '#ffffff', background: 'white'	}
  };
  if (node.id === "A01") {
    node.fixed = {
      x: true,
      y: true
    }
  };
  nodes.push(node);
  if (station.StationTogether1 !== "") {
    edges.push({
      id: station.Code + " " + station.StationTogether1 + " " + null,      
      from: station.Code,
      to: station.StationTogether1,
      color: "black",
      length: 100,
      label: "Transfer",
      width: 25
    });
  }
}, this);

edges.push(...addLineEdges());

//Algorithm stuff
var graph = new Graph();
addVerticesToGraph(nodes, edges);

var nodes = new vis.DataSet(nodes);

// create an array with edges
var edges = new vis.DataSet(edges);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

var options = {
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -10000,
      centralGravity: -0.5,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: .5
    },
    maxVelocity: 1000,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
};

// initialize your network!
var network = new vis.Network(container, data, options);

document.getElementById("shortestPathForm").addEventListener("submit", (event) => {
  event.preventDefault();
  spa(document.getElementById("start").value, document.getElementById("end").value);
}, false);


function parseColor(code) {
  switch (code) {
    case "RD":
      return "red";
    case "BL":
      return "blue";
    case "YL":
      return "yellow";
    case "GR":
      return "green";
    case "OR":
      return "orange";
    case "SV":
      return "silver";

    default:
      return "pink";
  }
}

function dry(array) {
  var edges = [];
  var previous = null;

  array.forEach(function (station) {
    if (previous !== null) {
      edges.push({
        id: station.StationCode + " " + previous.StationCode + " " + parseColor(station.LineCode),
        from: station.StationCode,
        to: previous.StationCode,
        color: parseColor(station.LineCode),
        length: station.DistanceToPrev / 10,
        label: station.DistanceToPrev,
        width: 25
      })
    }
    previous = station;
  });

  return edges;
}

function addLineEdges() {

  var edges = [];

  edges.push(...dry(blPath));
  edges.push(...dry(grPath));
  edges.push(...dry(orPath));
  edges.push(...dry(rdPath));
  edges.push(...dry(svPath));
  edges.push(...dry(ylPath));

  return edges;

}

function addVerticesToGraph(nodes, edges) {
  var vertices = {};

  nodes.forEach((node) => {
    vertices[node.id] = {};
  });

  edges.forEach((edge) => {

    vertices[edge.from][edge.to] = edge.length;
    vertices[edge.to][edge.from] = edge.length;

  });

  for (vertex in vertices) {
    graph.addVertex(vertex, vertices[vertex]);
  }
}

function showResult(nodes) {
  var nodeToSelect = nodes.map((node) => {
    if (node.id === str) {
      return node;
    }
  })
  return nodeToSelect;
}

function spa(start, end) {

  var path = graph.shortestPath(start, end, network);

  //network.setSelection({ nodes: path });

  for (var i = 0; i < path.length; i++) {
    nodes._data[path[i]].color = "black";
    nodes._data[path[i]].size =  100;
    nodes._data[path[i]].font =  {size: 100, strokeColor: '#ffffff', background: 'white'	};
    
    if (i !== 0 && i !== path.length) {
      for (id in edges._data) {
        if (id.substring(0, 7) == `${path[i]} ${path[i - 1]}` || id.substring(0, 7) == `${path[i - 1]} ${path[i]}`) {
          edges._data[id].color = "black";
          edges._data[id].width = 100;
          
        }
      }
    }
  }

  network.setData({nodes: nodes, edges: edges});
}