const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const { json } = require('stream/consumers');

const packageDef = protoLoader.loadSync("../auth.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.authPackage;

const client = new authPackage.Auth("localhost:4000",grpc.credentials.createInsecure());

client.getAllUsers( {},
    (err, response) => {
        console.log("Recieved from server " + JSON.stringify(response));
    }
);