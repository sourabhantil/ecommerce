require("dotenv").config();
const express = require("express");
const server = express();
const {createProduct} = require("./controller/Product");
const mongoose = require("mongoose");
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const {isAuth, sanitizeUser, cookieExtractor} = require("./services/common");
const { userModel } = require("./model/User");
const { orderModel } = require("./model/Order");
const PORT = process.env.PORT;
// TODO: before deploy setup webhook for deployment

// webhook
const endpointSecret = process.env.ENDPOINT_SECRET;
// TODO: we will capture actual order after deploying out server live on public url
server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        const order = await orderModel.findById(paymentIntentSucceeded.metadata.orderId);
        order.paymentStatus = "received";
        await order.save();
        // TODO: change order status to paid if payment is succeed
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

// middlewares
server.use(express.static(path.resolve(__dirname,"build")));
server.use(cookieParser());
server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));
server.use(passport.authenticate("session"));
server.use(cors({
    exposedHeaders:["X-Total-Count"]
}));
// server.use(express.raw({type: 'application/json'}));
server.use(express.json()); //to parse req.body
server.use("/products",productsRouter.router);
server.use("/brands",brandsRouter.router);
server.use("/categories",categoriesRouter.router);
server.use("/users",isAuth(),usersRouter.router); //we can also use JWT token for client only auth
server.use("/auth",authRouter.router);
server.use("/cart",isAuth(),cartRouter.router);
server.use("/orders",isAuth(),ordersRouter.router);



// we add this line to make react router work in case of other routes doesn't match
server.get("*",(req,res)=> res.sendFile(path.resolve(__dirname,"build/index.html")));

// passport strategies
passport.use("local",new LocalStrategy({usernameField:"email"},
    // done means next()
    async function(email, password, done) {
        // by default passport uses username
        try{
            const user = await userModel.findOne({email});
            if(!user){
                done(null,false,{message:"User not found"})
            }
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function(err, hashedPassword){
            if(crypto.timingSafeEqual(user.password, hashedPassword)){
                const token = jwt.sign(sanitizeUser(user),process.env.JWT_SECRET_KEY);
                const sanitizedUser = sanitizeUser(user);
                done(null,{...sanitizedUser,token}); //this get sent to serialize and next callback
            }
            else{
                done(null,false,{message:"Invalid Credentials"})
            }
        })
        }
        catch(err){
            done(err);
        }
    }
));


// JWT options
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; 
passport.use("jwt",new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        // jwt_payload will contain the decrypted values from bearer token
        // jwt_payload will contain id,role,iat
        const user = await userModel.findById(jwt_payload.id);
        if (user) {
            return done(null, sanitizeUser(user)); //this calls serializer
        } else {
            return done(null, false);
        }
    }
    catch(err){
        return done(err, false);
    }    
    })
);

// this creates session variable req.user on being called
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

// this changes session variable to req.user when called from authorized request
//this gets the userinfo from session/cookies
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


// Payments

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

//this will work from here as we are only redirecting get requests to build
server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100, //for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata : {
        orderId //this info will goto stripe => and then to our webhook
        //so we can conclude that payment was successful,even if client closes window after pay
      }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});  

//mongoose
main().catch((err)=>{
    console.log("mongoose "+err);
})

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected");
}
//server 
server.listen(PORT,()=>{
    console.log("server started on port: "+PORT);
})
