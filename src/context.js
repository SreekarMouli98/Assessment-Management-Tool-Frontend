import React, {Component} from 'react'

const Context = React.createContext()

class Provider extends Component {
    state = {
        baseURL: 'http://localhost:8000',
        loggedIn: false,
        username: '',
        role: '',
        setUsername: (username) => {
            this.setState({
                username: username
            })
        },
        setRole: (is_student, is_mentor) => {
            if (is_student) {
                this.setState({
                    role: 'student'
                })
            }
            else if (is_mentor) {
                this.setState({
                    role: 'mentor'
                })
            }
        },
        alreadyLoggedIn: (successCallback, failureCallback) => {
            let token = localStorage.getItem('token')
            if (token) {
                fetch(`${this.state.baseURL}/api/auth/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token
                    })
                }).then(res => {
                    if (res.status < 300) {
                        return res.json()
                    }
                    throw new Error(res.statusText)
                }).then(res => {
                    localStorage.setItem('token', res.token)
                    this.state.setUsername(res.username)
                    this.state.setRole(res.is_student, res.is_mentor)
                    if (successCallback) successCallback()
                }).catch(err => {
                    console.log(err)
                    localStorage.removeItem('token')
                    if (failureCallback) failureCallback()
                })
            }
            else {
                if (failureCallback) failureCallback()
            }
        }
    }
    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export {Provider}
export default Context