const faker = require('faker');

const MongoClient = require('mongoDb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'newTestDb';


 
let userCount = 1;
let apartmentCount = 1;


// helper functions for creating documents

let create1000000Users = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000000; i++) {
        documentsArray.push({
            id: userCount,
            name: faker.name.findName(),
            avatar: faker.internet.avatar()
        })
        userCount += 1;
    }
    return documentsArray;
}

let create1000Apartments = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push({
            id: apartmentCount,
            address: faker.address.streetAddress(),
            owned_by_user_id: Math.floor(Math.random()*10000000)
        })
        apartmentCount += 1;
    }
    return documentsArray;
}

let create1000Reviews = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push({
            date: faker.date.month() + ' ' + faker.random.number({ min: 2015, max: 2019}),
            text: faker.lorem.sentences(Math.ceil(Math.random() * 6)),
            rating: Math.floor((() => Math.random() * 5)()) + .5,
            user_id: faker.random.number({
                min: 1,
                max: 10000000
              }),
            apartment_id: faker.random.number({
                min: 1,
                max: 10000000
              }),
            has_response: Math.random() > .66,
            owner_response: faker.lorem.sentences(Math.ceil(Math.random() * 4))
        })
    }
    return documentsArray;
}



// Connect to the server, insert documents using recursion
MongoClient.connect(url)
    .then(client => {
        let db = client.db(dbName);
        let count = 0;
        

        let recurse = function() {
            if (count < 10) {
                count += 1;
                let userDocs = create1000000Users();
                db.collection('users').insertMany(userDocs, (err, res) => {
                    console.log(count);
                    recurse()
                })
            }
        }

        recurse();
    })
    .catch(err => console.log(err))