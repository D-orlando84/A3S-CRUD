"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import app from './App';
const App_1 = require("./App");
const port = 3000;
const app = new App_1.App();
app.express.listen(port, (err) => {
    // TODO: Manage errors to user
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map