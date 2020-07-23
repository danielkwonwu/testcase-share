import React from 'react';
import './App.scss';
import seal from './wustlseal.png';

class LoginBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usernameInput: '',
      passwordInput: ''
    }
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }
  handleUsernameChange(e) {
    this.setState({
      usernameInput: e.target.value
    });
  }
  handlePasswordChange(e) {
    this.setState({
      passwordInput: e.target.value
    });
  }
  clearInput() {
    this.setState({
      usernameInput: '',
      passwordInput: ''
    });
  }
  render() {
    return (
      <nav className='user-nav'>
        {this.props.authenticated ?
          <form className="user-form">
            <img className="logo" src={seal} alt='logo' width='50' height='50' />
            <span id="welcome-text">Welcome, {this.props.username} </span>
            <button id="logout-button" className="light-button" type="button" onClick={this.props.logout}>Logout</button>
          </form>
          :
          <form className="user-form">
            <img className="logo" src={seal} alt='logo' width='50' height='50' />
            <label htmlFor="username-input">Username:</label>
            <input id="username-input" className="text-input" type="text" autoComplete="username" onChange={this.handleUsernameChange}></input>
            <label htmlFor="password-input"> Password:</label>
            <input id="password-input" className="text-input" type="password" autoComplete="current-password" onChange={this.handlePasswordChange}></input>
            <button id="login-button" className="light-button" type="submit" onClick={(e) => this.props.login(e, this.state.usernameInput, this.state.passwordInput, this.clearInput)}>Login</button>
            <button id="register-button" className="light-button" type="button" onClick={() => this.props.register(this.state.usernameInput, this.state.passwordInput, this.clearInput)}>Sign Up</button>
            <span id="login-error">{this.props.error}</span>
          </form>
        }
      </nav>
    )
  }
}


class TestCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testCaseText: "",
      fetchedTest: "",
      success: false
    }

    this.requestPost = this.requestPost.bind(this);
    this.changeText = this.changeText.bind(this);
    this.refreshTest = this.refreshTest.bind(this);
  }

  changeText(event) {
    this.setState({ testCaseText: event.target.value });
  }

  componentDidMount(){
    fetch("http://localhost:3001/tests/fetch", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            fetchedTest : data.fetchedTest
          });
          console.log("fetchData Success " + data.fetchedTest);
        }
      })
      .catch(error => console.error(error));
  }

  requestPost(event) {
    alert('Submitted: ' + this.state.testCaseText);
    let body = {
      text: this.state.testCaseText
    }
    fetch('http://localhost:3001/tests/testcase', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      }).then(this.refreshTest());
    console.log("JSON SENT " + JSON.stringify(body));
    event.preventDefault();
  };

  refreshTest(){
    fetch("http://localhost:3001/tests/fetch", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            fetchedTest : data.fetchedTest
          });
          console.log("fetchData Success " + data.fetchedTest);
        }
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div>
        <p>{this.state.fetchedTest}</p>
        {!this.props.authenticated ?
          <p>You need to be logged in to submit test cases.</p>
          :
          <form className='testcase-form' onSubmit={this.requestPost}>
            <label>
              Input TestCase:
          <input type='text' value={this.state.testCaseText} onChange={this.changeText} />
            </label>
            <input id='button' type='submit' value="Submit" />
          </form>
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      username: '',
      loginError: null
    }
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3001/users/auth", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          this.setState({
            authenticated: true,
            username: data.username,
            loginError: null
          });
        }
      })
      .catch(error => console.error(error));
  }

  logout() {
    fetch("http://localhost:3001/users/logout", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          authenticated: false,
          username: ''
        })
      })
      .catch(error => console.error(error))
  }

  login(e, username, password, clear) {
    e.preventDefault();
    let body = {
      username: username,
      password: password
    }
    fetch("http://localhost:3001/users/login", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          clear();
          this.setState({
            authenticated: true,
            username: data.username,
            loginError: null
          })
        } else {
          this.setState({
            loginError: data.message
          });
        }
      })
      .catch(error => console.error(error))
  }

  register(username, password, clear) {
    clear();
    let body = {
      username: username,
      password: password
    }
    fetch("http://localhost:3001/users/register", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          clear();
          this.setState({
            authenticated: true,
            username: data.username,
            loginError: null
          })
        } else {
          this.setState({
            loginError: data.message
          });
        }
      })
      .catch(error => console.error(error))
  }

  render() {
    return (
      <div className="page-wrapper">
        <LoginBar authenticated={this.state.authenticated} error={this.state.loginError} username={this.state.username} logout={this.logout} login={this.login} register={this.register} ></LoginBar>
        <h1>TestCase Generator</h1>
        <TestCase authenticated={this.state.authenticated} ></TestCase>
      </div>
    )
  }
}

export default App;
