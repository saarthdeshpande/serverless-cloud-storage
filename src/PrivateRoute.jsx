import { Route, Redirect } from 'react-router-dom'
import React from 'react'

class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            valid: false
        }
    }

    async componentDidMount() {
        await fetch(`https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${localStorage.getItem('refresh_token')}`
        })
            .then((response) => {
                return new Promise((resolve) => response.json()
                    .then((json) => resolve({
                        status: response.status,
                        ok: response.ok,
                        json,
                    })));
            })
            .then(({ status, json }) => {
                if (status === 200) {
                    this.setState({ valid: true })
                    this.setState({ isLoading: false })
                } else {
                    localStorage.removeItem('refresh_token')
                    this.setState({ valid: false })
                    this.setState({ isLoading: false })
                }
            })
            .catch(e => {
                console.log(e)
                this.setState({ valid: false })
            })
    }

    render() {
        return (
            <>
                { !this.state.isLoading ?
                    (this.state.valid ?
                        <Route exact path={'/'} component={this.props.component} />
                        : <Redirect to={'/login'} />
                    ) : <div />
                }
            </>
        )
    }
};

export default PrivateRoute;
