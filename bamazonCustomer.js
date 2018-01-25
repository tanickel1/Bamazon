var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    prt: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

var numberOfProducts = 0;

connection.connect(function(err) {
    if  (err) throw err;

    new Promise (function(resolve, reject) {
        connection.query('select * from products', function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log('Welcome to Bamazon, AlaBAMAs Amazon');
        });
    }).then(function(result){
        result.forEach(function(item) {
            numberOfProducts++;
            console.log('Item ID: ' + item.item_id + ' || Product Name: ' + item.product_name + '|| Price: ' + item.price);
        });
    }).then(function() {
        return enterStore();
    }).catch(function(err){
        console.log(err);
    });
});

function enterStore() {
    inquirer.prompt([{
        name: 'entrance',
        message: 'Hey BAMA fan, wanna buy some stuff?',
        type: 'list',
        choices: ['Yes', 'No']
    }]).then(function(answer){
        if (answer.entrance === 'Yes') {
            menu();
        } else {
            console.log('Come back when ya got some cash!');
            connection.destroy();
            return;
        }
    });
}

function menu() {
    return inquirer.prompt([{
        name: 'item',
        message: 'Enter the item number of your desired product.',
        type: 'input',
        validate: function(value) {
            if ((isNaN(value)=== false) && (value <= numberOfProducts)) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: 'quantity',
        message: 'How many would you like?',
        type: 'input',

        validate: function(value) {
            if (isNan(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid ammount.');
                return false;
            }
        }
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query('select * from products WHERE ?', { item_id: answer.item }, function(err, res){
                if (err) reject(err);
                resolve(res);
            });
        }).then(function(results) {
            var savedData = {};
            if (parseInt(answer.quantity) <= parseInt(result[0].stock_quantity)) {
                savedData.answer = answer;
                savedData.result = result;
            } else if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
                console.log('Sorry Bro, were out')
            } else {
                console.log('Error, your order is incomplete.');
            }
            return savedData;
        }).then(function(savedData) {
            if (savedData.answer) {
                var updatedQuantity = parseInt(savedData.result[0].stock_quantity) - parseInt(savedData.answer.quantity);
                var itemId = savedData.answer.item;
                var totalCost =  parseInt(savedData.result[0].price) * parseInt(savedData.answer.quantity);
                connection.query('update products set ? where ?', [{
                    stock_quantity: updatedQuantity
                }, {
                    item_id: itemId
                }], function(err, res){
                    if (err) throw err;
                    console.log('Your order costs $' + totalCost + '. Thanks for shopping at Bamazon, where Alabamaians shop.');
                    connection.destroy();
                });
            } else {
                enterStore();
            }
        }).catch(function(err) {
            console.log(err);
            connection.destroy();
        });
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}