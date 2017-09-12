//const stations = require("../data/stations")

// create an array with nodes
// var nodes = new vis.DataSet([
//   {id: 1, label: 'Node 1'},
//   {id: 2, label: 'Node 2'},
//   {id: 3, label: 'Node 3'},
//   {id: 4, label: 'Node 4'},
//   {id: 5, label: 'Node 5'}
// ]);

var dataSet = [];
var edges = [];

stations.forEach(function(station) {
  dataSet.push({
    id: station.Code,
    label: `${station.Name}`,
    color: parseColor(station.LineCode1),
    shape: "box"
  });
  if (station.StationTogether1 !== "") {
    edges.push({
      from: station.Code,
      to: station.StationTogether1
    });
  }
}, this);

edges.push(...addLineEdges());

var nodes = new vis.DataSet(dataSet);

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
  physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -10000,
      centralGravity: 0,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
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

function parseColor(code) {
  switch(code) {
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

  array.forEach(function(station) {
    if (previous !== null) {
      edges.push({
        from: station.StationCode,
        to: previous.StationCode,
        color: parseColor(station.LineCode),
        length: station.DistanceToPrev/10,
        label: station.DistanceToPrev
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