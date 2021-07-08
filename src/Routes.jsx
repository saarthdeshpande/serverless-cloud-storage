import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import App from './App.js'
import Login from './Login.jsx'
import PrivateRoute from './PrivateRoute.jsx'

export default function Routes() {
    return (
        <Router>
            <Switch>
                <Route exact path={'/login'} component={Login} />
                <PrivateRoute exact path={'/'} component={App} />
            </Switch>
        </Router>
    )
};
