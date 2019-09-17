import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import App from "./App";
import Chat from "./components/chat";
import Login from "./components/login";
import Notfound from "./components/notfound";

import "bootstrap/dist/css/bootstrap.css";


const routing = (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/chat/:id">Chat</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/chat" component={Chat} />
                <Route path="/login" component={Login} />
                <Route component={Notfound} />
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById("root")
);
