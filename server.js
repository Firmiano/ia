'use strict'
// create the perceptron
var MLP = require('mlp');
var mlp = new MLP(2,3);
var nn = require('nearest-neighbor');
 
knn();


function knn(){
	var items = [
	  { name: "Bill", age: 10, pc: "Mac", ip: "68.23.13.8" },
	  { name: "Alice", age: 22, pc: "Windows", ip: "193.186.11.3" },
	  { name: "Bob", age: 12, pc: "Windows", ip: "56.89.22.1" }
	];
	 
	var query = { name: "Bill", age: 12, pc: "Windows", ip: "68.23.13.10" };
	 
	var fields = [
	  { name: "name", measure: nn.comparisonMethods.word },
	  { name: "age", measure: nn.comparisonMethods.number, max: 100 },
	  { name: "pc", measure: nn.comparisonMethods.word }, 
	  { name: "ip", measure: nn.comparisonMethods.ip }
	];
	 
	nn.findMostSimilar(query, items, fields, function(nearestNeighbor, probability) {
	  console.log(query);
	  console.log(nearestNeighbor);
	  console.log(probability);
	});
}

function mlp(){

	// add hidden layers and initialize
	mlp.addHiddenLayer(5);
	mlp.addHiddenLayer(5);
	mlp.init();

	// create a training set
	mlp.addToTrainingSet([2, 1], [1, 0, 0]);
	mlp.addToTrainingSet([0, 1], [1, 0, 0]);
	mlp.addToTrainingSet([3, 4], [0, 1, 0]);
	mlp.addToTrainingSet([2, 3], [0, 1, 0]);
	mlp.addToTrainingSet([1, 0], [0, 0, 1]);
	mlp.addToTrainingSet([3, 1], [0, 0, 1]);

	// train the perceptron
	var learnRate = 0.5;
	var error = Number.MAX_VALUE;
	while (error > 0.01) {
	    error = mlp.train(learnRate);
	    console.log('error', error);
	}

	var elementToClassify = [1,1];
	var classification = mlp.classify(elementToClassify);

	var data = mlp.exportToJson();

	for (var i = 0; i < data.mlpData.length; i++) {
	    console.log(data.mlpData[i]);
	}
}