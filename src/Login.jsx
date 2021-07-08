import {useState} from 'react'

import {withRouter} from 'react-router-dom'
import {NotificationManager, NotificationContainer} from 'react-notifications'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import firebase from "firebase/app";
import "firebase/auth";

import './config/firebase'

import 'react-notifications/lib/notifications.css';


function Login({ history }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <div>
            <Modal
                show={true}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <h3>
                        Self-Hosted Serverless Cloud Storage
                    </h3>
                    <Form.Text>© Saarth Deshpande, {new Date().getFullYear()}</Form.Text>
                </Modal.Header>
                <Form
                    style={{
                        padding: '15px'
                    }}
                    onSubmit={e => {
                        e.preventDefault()
                        firebase.auth().signInWithEmailAndPassword(email, password)
                            .then((userCredential) => {
                                var user = userCredential.user;
                                localStorage.setItem('refresh_token', user.refreshToken)
                                window.location.href = '/'
                            })
                            .catch((error) => {
                                console.log(error.code, error.message)
                                NotificationManager.error(error.code, 'Invalid Login!')
                            });

                    }}
                >
                    <Form.Group style={{marginBottom: '10px'}} controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter email"
                            autoComplete="on"
                        />
                    </Form.Group>

                    <Form.Group style={{marginBottom: '20px'}} controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            autoComplete="on"
                        />
                    </Form.Group>
                    <Button
                        style={{
                            backgroundColor: 'transparent',
                            color: 'blue',
                            width: '100%'
                        }}
                        variant="primary"
                        type="submit"
                    >
                        Login
                    </Button>
                </Form>
                {localStorage.getItem('refresh_token') && history.push('/')}
            </Modal>
            <NotificationContainer />
        </div>
    )
}

export default withRouter(Login);
