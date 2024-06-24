const _ = require('lodash');

// 1. Метод `_.find` шукає перший елемент у масиві, який відповідає заданому предикату.
const users = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }, { name: 'Peter', age: 40 }];

const adultUser = _.find(users, user => user.age >= 30);
console.log('1. Перший дорослий користувач:', adultUser);

// 2. Метод `_.map` перетворює кожен елемент масиву за допомогою заданої callback-функції.
const numbers = [1, 2, 3, 4, 5];

const squaredNumbers = _.map(numbers, num => num * num);
console.log('2. Квадрати чисел:', squaredNumbers);

// 3. Метод `_.filter` створює новий масив, що містить лише ті елементи з вихідного масиву, які відповідають заданому предикату.
const activeUsers = _.filter(users, user => user.active);
console.log('3. Активні користувачі:', activeUsers);

// 4. Метод `_.reduce` зводить масив до одного значення, застосовуючи callback-функцію до кожної пари послідовних елементів.
const sum = _.reduce(numbers, (total, num) => total + num, 0);
console.log('4. Сума чисел:', sum); // 15

// 5. Метод `_.sortBy` сортує масив за допомогою заданої callback-функції порівняння.
const sortedUsers = _.sortBy(users, user => user.age);
console.log('5. Відсортовані користувачі за віком:', sortedUsers);
