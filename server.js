'use strict'

//var mlp = new MLP(2,3);
var fs = require('fs'); 
var parse = require('csv-parse');
var kNN = require("k.n.n");
var brain = require("brain");

var csvData=[];
var dataTraining=[];
var dataTest=[];


startProgram();

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
            print("------------ Iniciando Classificacao KNN ----------------",function(){
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
    });    
}

function print(msg,callback){
    console.log(msg);
    callback();
}

//Função responsável por separar a massa da dodos em treinamento e teste.
function separateTrainingTesting(array, callback){
    console.log('');
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
    console.log('');
    callback();
}

function startKnn(k,arrayTraining,arrayTesting,callback){
    console.log("Iniciando Knn de k =",k);

    var um = 0;
    var dois = 0;
    var tres = 0;
    var cinco = 0;
    var seis = 0;
    var sete = 0;

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
            if(results.type === '1'){
                um++;
            }else if(results.type === '2'){
                dois++;
            }else if(results.type === '3'){
                tres++;
            }else if(results.type === '5'){
                cinco++;
            }else if(results.type === '6'){
                seis++;
            }else if(results.type === '7'){
                sete++;
            }
        }else{
            erro++;
        }
    }
    console.log('');
    console.log('Quantidade de teste = ', arrayTesting.length);
    console.log('---------------------------------------------------------');
    console.log('Quantidade de teste na classe 1 = ', um);
    console.log('Quantidade de teste na classe 2 = ', dois);
    console.log('Quantidade de teste na classe 3 = ', tres);
    console.log('Quantidade de teste na classe 5 = ', cinco);
    console.log('Quantidade de teste na classe 6 = ', seis);
    console.log('Quantidade de teste na classe 7 = ', sete);
    console.log('Quantidade de teste Erro = ', erro);
    console.log('---------------------------------------------------------');
    console.log('');
    callback();
}

function startMlp(hiddenLayer,arrayTraining,arrayTesting,callback){

    console.log('Ininicando MLP de '+ hiddenLayer +' camada oculta');

    var data = [];
    var net = new brain.NeuralNetwork({
        hiddenLayers: [hiddenLayer],
        learningRate: 0.3 
    });

    for (var i = 0; i < arrayTraining.length; i++) {

        var obj = {
            paramA: parseFloat(arrayTraining[i].paramA), 
            paramB: parseFloat(arrayTraining[i].paramB),
            paramC: parseFloat(arrayTraining[i].paramC),
            paramD: parseFloat(arrayTraining[i].paramD),
            paramE: parseFloat(arrayTraining[i].paramE),
            paramF: parseFloat(arrayTraining[i].paramF),
            paramG: parseFloat(arrayTraining[i].paramG),
            paramH: parseFloat(arrayTraining[i].paramH),
            paramI: parseFloat(arrayTraining[i].paramI)
        };

        if(arrayTraining[i].type === '1'){
            data.push({input: obj, output: {'1' : arrayTraining[i].type}}); 
        }else if(arrayTraining[i].type === '2'){
            data.push({input: obj, output: {'2' : arrayTraining[i].type}}); 
        }else if(arrayTraining[i].type === '3'){
            data.push({input: obj, output: {'3' : arrayTraining[i].type}}); 
        }else if(arrayTraining[i].type === '5'){
            data.push({input: obj, output: {'5' : arrayTraining[i].type}}); 
        }else if(arrayTraining[i].type === '6'){
            data.push({input: obj, output: {'6' : arrayTraining[i].type}}); 
        }else if(arrayTraining[i].type === '7'){
            data.push({input: obj, output: {'7' : arrayTraining[i].type}}); 
        }
           
    }
    net.train(data);

    for (var i = 0; i < arrayTesting.length; i++) {
        var obj = {
            paramA: parseFloat(dataTest[i].paramA), 
            paramB: parseFloat(dataTest[i].paramB),
            paramC: parseFloat(dataTest[i].paramC),
            paramD: parseFloat(dataTest[i].paramD),
            paramE: parseFloat(dataTest[i].paramE),
            paramF: parseFloat(dataTest[i].paramF),
            paramG: parseFloat(dataTest[i].paramG),
            paramH: parseFloat(dataTest[i].paramH),
            paramI: parseFloat(dataTest[i].paramI)
        };
        var output = net.run(obj); 
        console.log('output', output);
    }
   
   callback();
 }