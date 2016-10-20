'use strict'
// create the perceptron
var MLP = require('mlp');
var mlp = new MLP(2,3);

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