"use strict";

const Gremlin = require('gremlin');
const config = require("./config");

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey)

const client = new Gremlin.driver.Client(
    config.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);


function dropGraph()
{
    console.log('Running Drop');
    return client.submit('g.V().drop()', { }).then(function (result) {
        console.log("Result: %s\n", JSON.stringify(result));
    });
}

function addUserVertex1()
{
    console.log('Running Add Vertex1'); 
    return client.submit("g.addV(label).property('id', id).property('firstName', firstName).property('age', age).property('userid', userid).property('pk', 'pk')", {
            label:"user",
            id:"thomas",
            firstName:"Thomas",
            age:44, userid: 1
        }).then(function (result) {
                console.log("Result: %s\n", JSON.stringify(result));
        });
    }

function addUserVertex2()
{
    console.log('Running Add Vertex2');
    return client.submit("g.addV(label).property('id', id).property('firstName', firstName).property('lastName', lastName).property('age', age).property('userid', userid).property('pk', 'pk')", { 
            label:"user",
            id:"mary",
            firstName:"Mary",
            lastName: "Andersen",
            age:39,
            userid: 2
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}

function addPloicyVertex1()
{
    console.log('Running Add Policy Vertex1');
    return client.submit("g.addV(label).property('id', id).property('policyNumber', policyNumber).property('policyType', policyType).property('insuredName', insuredName).property('pk', 'pk')", { 
            label:"policy",
            id:"pol123456",
            policyNumber:"pol123456",
            policyType: "life",
            insuredName:"mary"
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}
function addUserEdge()
{
    console.log('Running Add Edge'); 
    return client.submit("g.V(source).addE(relationship).to(g.V(target))", {
            source:"thomas", 
            relationship:"knows", 
            target:"mary"
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}

function addPloicyEdge()
{
    console.log('Running Add Policy Edge');
    return client.submit("g.V(source).addE(relationship).to(g.V(target))", { 
        source:"mary", 
        relationship:"bought_policy", 
        target:"pol123456"
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}

function getAllUser()
{
    console.log('Running Get All User');
    return client.submit("g.V().hasLabel(label).valueMap('firstName')", { 
        label:"user"        
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}
function getAllUserSelectedProperities()
{
    console.log('Running Get All Users common property ');
    return client.submit("g.V().hasLabel('user').project('id','firstName','age','userid',).by('id').by('firstName').by('age').by('userid')", { 
        label:"user"        
        }).then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}
function countVertices()
{
    console.log('Running Count');
    return client.submit("g.V().count()", { }).then(function (result) {
        console.log("Result: %s\n", JSON.stringify(result));
    });
}

function finish()
{
    console.log("Finished");
    console.log('Press any key to exit');
    
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

client.open()
    .then(dropGraph)
    .then(addUserVertex1)
    .then(addUserVertex2)
    .then(addPloicyVertex1)
    .then(addUserEdge)    
    .then(addPloicyEdge)
    .then(getAllUser)
    .then(getAllUserSelectedProperities)
    .then(countVertices)
    .catch((err) => {
        console.error("Error running query...");
        console.error(err)
    }).then((res) => {
        client.close();
        finish();
    }).catch((err) => 
        console.error("Fatal error:", err)
    );
    
    

