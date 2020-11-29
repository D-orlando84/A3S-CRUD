// import app from './App';
import {App} from './App';

const port = 3000;

const app = new App();

app.express.listen(port, (err) => {
    // TODO: Manage errors to user
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
});
