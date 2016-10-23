'use strict'
// create the perceptron
var MLP = require('mlp');
var mlp = new MLP(2,3);
var kNN = require('k.n.n');
var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];
fs.createReadStream("./arquivo/winequality-white.csv")
    .pipe(parse({delimiter: ';'}))
    .on('data', function(csvrow) {
        //do something with csvrow
        csvData.push(csvrow);        
    })
    .on('end',function() {
      //do something wiht csvData
      console.log(csvData);
    });

function knn(){
    var data = [ new kNN.Node({paramA: 1, paramB: 300, type: 'typeA'}), 
    new kNN.Node({paramA: 14, paramB: 350, type: 'typeA'}), 
    new kNN.Node({paramA: 2, paramB: 1200, type: 'typeA'}), 
    new kNN.Node({paramA: 6, paramB: 900, type: 'typeB'}), 
    new kNN.Node({paramA: 2, paramB: 770, type: 'typeB'}),
    new kNN.Node({paramA: 3, paramB: 160, type: 'typeB'}),
    new kNN.Node({paramA: 6, paramB: 120, type: 'typeC'}),
    new kNN.Node({paramA: 1, paramB: 1220, type: 'typeC'}), 
    new kNN.Node({paramA: 7, paramB: 900, type: 'typeC'}) ];

    var example = new kNN(data);

    var teste = [new kNN.Node({paramA:1, paramB:300, type:false}),new kNN.Node({paramA:7, paramB:900, type:false})];

    for (var i = 0; i < teste.length; i++) {
        var results = example.launch(5, teste[i]);
        console.log('results', results);
        console.log(results.type + ': '+results.percentage+'%');
    }

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