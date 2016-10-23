'use strict'
// create the perceptron
var MLP = require('mlp');
var mlp = new MLP(2,3);
var fs = require('fs'); 
var parse = require('csv-parse');
var KNN = require('ml-knn');
var knn = new KNN();
var kNN = require("k.n.n");

var csvData=[];
var dataTraining=[];
var dataTest=[];

startProgram();
//startMlp();

function startProgram(){
    //Lendo arquivo csv com os dados
    fs.createReadStream("./arquivo/glass.csv")
    .pipe(parse({delimiter: ',',columns :true}))
    .on('data', function(csvrow) {
        csvData.push(csvrow);        
    })
    .on('end',function() {
        //Chamando função para separação dos dados em treinamento e teste.
        separateTrainingTesting(csvData, function(){
            //Chamando a função para k = 1
            startKnn(1,dataTraining,dataTest,function(){
                //Chamando a função para k = 5
                startKnn(5,dataTraining,dataTest,function(){
                    //Chamando a função para k = 9
                    startKnn(9,dataTraining,dataTest,function(){
                        console.log('Fim Knn!');
                        //Chamando a função 1x camadas ocultas
                        startMlp(1,dataTraining,dataTest,function(){
                            //Chamando a função 2x camadas ocultas
                            startMlp(2,dataTraining,dataTest,function(){
                              //Chamando a função 3x camadas ocultas
                              startMlp(3,dataTraining,dataTest,function(){
                                console.log('Fim MLP!');
                            });  
                          });
                        });
                    });
                });  
            });
        });
    });    
}

//Função responsável por separar a massa da dodos em treinamento e teste.
function separateTrainingTesting(array, callback){

    var total = array.length;
    console.log('Total de dados : ', total);
    
    for (var i = 0; i < array.length; i++) {
        if(Math.random() < 0.5 && dataTest.length < Math.round((array.length * 20) / 100)){
            dataTest.push(array[i]);
        }else{
            dataTraining.push(array[i]);
        }
    }
    console.log('Quantidade de treinamento : ', dataTraining.length);
    console.log('Quantidade de teste : ', dataTest.length);
    callback();
}

function startKnn(k,arrayTraining,arrayTesting,callback){
    console.log("Iniciando Knn de k =",k);

    var ok = 0;
    var erro = 0;
    var data = [];

    for (var i = 0; i < dataTraining.length; i++) {
        var obj = {
            paramA: parseFloat(dataTraining[i].paramA), 
            paramB: parseFloat(dataTraining[i].paramB),
            paramC: parseFloat(dataTraining[i].paramC),
            paramD: parseFloat(dataTraining[i].paramD),
            paramE: parseFloat(dataTraining[i].paramE),
            paramF: parseFloat(dataTraining[i].paramF),
            paramG: parseFloat(dataTraining[i].paramG),
            paramH: parseFloat(dataTraining[i].paramH),
            paramI: parseFloat(dataTraining[i].paramI),
            type: dataTraining[i].type
        };
        data.push(new kNN.Node(obj));
    }

    var example = new kNN(data);
    for (var i = 0; i < dataTest.length; i++) {
        var obj = {
            paramA: parseFloat(dataTest[i].paramA), 
            paramB: parseFloat(dataTest[i].paramB),
            paramC: parseFloat(dataTest[i].paramC),
            paramD: parseFloat(dataTest[i].paramD),
            paramE: parseFloat(dataTest[i].paramE),
            paramF: parseFloat(dataTest[i].paramF),
            paramG: parseFloat(dataTest[i].paramG),
            paramH: parseFloat(dataTest[i].paramH),
            paramI: parseFloat(dataTest[i].paramI),
            type: false
        };

        var results = example.launch(k, new kNN.Node(obj));
        if (results.type === dataTest[i].type){
            ok++;
        }else{
            erro++;
        }
    }

    console.log('Quantidade de teste = ', arrayTesting.length);
    console.log('Quantidade de teste Ok = ', ok);
    console.log('Quantidade de teste Erro = ', erro);
    callback();
}


function startMlp(hiddenLayer,arrayTraining,arrayTesting,callback){
    console.log('Ininicando MLP de '+ hiddenLayer +' camada oculta');
	// add hidden layers and initialize
    for (var i = 0; i < hiddenLayer; i++) {
        mlp.addHiddenLayer(5);    
    }

    mlp.init();

    // create a training set
    for (var i = 0; i < arrayTraining.length; i++) {
        mlp.addToTrainingSet([arrayTraining[i][0],arrayTraining[i][1]], [arrayTraining[i][9], arrayTraining[i][10], arrayTraining[i][11]]);    
    }

    // train the perceptron
    var learnRate = 0.5;
    var error = Number.MAX_VALUE;
    while (error > 0.01) {
     error = mlp.train(learnRate);
 }

 for (var i = 0; i < arrayTesting.length; i++) {
    mlp.classify([arrayTesting[i][0],arrayTesting[i][1]]);
}

var data = mlp.exportToJson();
console.log('data', data);
callback();
}