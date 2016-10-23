'use strict'
// create the perceptron
var MLP = require('mlp');
var mlp = new MLP(2,3);
var fs = require('fs'); 
var parse = require('csv-parse');
var KNN = require('ml-knn');
var knn = new KNN();

var csvData=[];
var dataTraining=[];
var dataTest=[];

startProgram();
//startMlp();

function startProgram(){
    //Lendo arquivo csv com os dados
    fs.createReadStream("./arquivo/winequality-white.csv")
    .pipe(parse({delimiter: ','}))
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
    //removendo cabeçalho.
    array.splice(0, 1);

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

    var trainingSet = arrayTraining;
    var predictions = [0,0,0,1,1,1];

    var options = {
        k : k
    };

    knn.train(trainingSet, predictions,options);
    var dataset = arrayTesting;

    var ans = knn.predict(dataset);
    
    var zero = 0;
    var um = 0;
    var erro = 0;

    for (var i = 0; i < ans.length; i++) {
        if(ans[i] === 0){
            zero++;
        }else if(ans[i] === 1){
            um++;
        }
        else{
            erro++;
        }
    }

    console.log('Quantidade de teste = ', ans.length);
    console.log('Quantidade de teste na classe Zero = ', zero);
    console.log('Quantidade de teste na classe Um = ', um);
    console.log('Quantidade de teste sem classe = ', erro);
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