const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const { json } = require('stream/consumers');

const packageDef = protoLoader.loadSync("../auth.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.authPackage;

const client = new authPackage.Auth("localhost:4000",grpc.credentials.createInsecure());

const email = process.argv[2];
const password = process.argv[3];

client.signIn({
    "email": email,
    "password": password
},
    (err, response) => {
        console.log("Recieved from server " + JSON.stringify(response));
    }
);