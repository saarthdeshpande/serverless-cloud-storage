import App from './App'
import Login from './Login'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

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
