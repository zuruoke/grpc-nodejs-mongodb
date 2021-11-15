const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const mongoose = require('mongoose');
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const packageDef = protoLoader.loadSync("auth.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.authPackage;
const server = new grpc.Server();

const MONGODB_CONNSTRING = "mongodb+srv://admin:marcusrashford10@cluster0.yc4ft.mongodb.net/users?retryWrites=true&w=majority"

const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(MONGODB_CONNSTRING , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

connectDB()

const startServer = async () => {
    server.addService(authPackage.Auth.service, {
        "signUp": signUp,
        "getAllUsers": getAllUsers,
        "signIn": signIn
    });
    server.bindAsync(
      "0.0.0.0:4000",
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err != null) {
          return console.error(err);
        }
        server.start();
        console.log("gRPC listening on 4000");
      },
    );
  }

  const signIn = async (call, callback) => {
    const user = await User.findOne({'email': call.request.email});
    const email = call.request.email;
    if (user && (await bcrypt.compare(call.request.password, user.password))){
      const token = jwt.sign(
        {user_id: user._id, email },
        'zuruoke38911',
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      const item = {
        "email": email,
        "password": "authenticated"
    }   
      callback(null, item)
    }
    else {
      const item = {
        "email": "failed",
        "password": "Not Authenticated"
    }   
      callback(null, item)
    }
  }


  const getAllUsers = async (call, callback) => {
    const user = await User.find();
    callback(null, {"data": user} );
  }

  const signUp = async (call, callback) => {
    e_mail = call.request.email;
    console.log(e_mail);
    const oldUser = await User.findOne({'email': e_mail });
    console.log(oldUser);
    if (!oldUser){
    encryptedPassword = await bcrypt.hash(call.request.password, 10);
    console.log(call.request.lastName)
    const item = {
        "firstName": call.request.firstName,
        "lastName": call.request.lastName,
        "email": call.request.email,
        "password": call.request.password
    }   
    const user = await User.create({
     firstName: call.request.firstName,
     lastName: call.request.lastName,
     email: call.request.email, // sanitize: convert email to lowercase
     password: encryptedPassword,
    });
    const token = jwt.sign(
        { user_id: user._id, e_mail },
        'zuruoke38911',
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      callback(null,item )
    }
    else {
      const item = {
        "firstName": "user already exists",
        "lastName": "user already exists",
        "email":  "user already exists",
        "password":  "user already exists",
      }
      callback(null,item ) 
    }
  }


    startServer();
  

