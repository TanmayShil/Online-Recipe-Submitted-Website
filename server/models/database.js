const mongoose = require('mongoose');
// const db = 'mongodb+srv://tan:Uppcyj9NZpNE1RIx@cluster0.mtror3q.mongodb.net/Recipes?retryWrites=true&w=majority'
// mongoose.connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("connection successful");
// }).catch((err) => console.log("not connection"))
mongoose.connect('mongodb://localhost:27017/my-recipe', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected");
});
require('./category');
require('./recipe');