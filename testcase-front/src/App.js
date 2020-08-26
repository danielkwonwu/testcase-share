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

class View extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mode : 'testcases',
      id: null
    }
    this.switchView = this.switchView.bind(this);
    this.getView = this.getView.bind(this);
  }

  switchView(mode, id){
    switch(mode){
      case 'testcases':
        this.setState({
          mode : mode
        });
        break;
      case 'single':
        this.setState({
          mode : mode,
          id : id
        })
        break;
    }
  }
  
  getView(){
    switch(this.state.mode){
      case 'testcases':
        return <TestCasesView switchView={this.switchView} authenticated={this.state.authenticated} username={this.state.username}></TestCasesView>;
      case 'single':
        return <SingleView></SingleView>
    }
  }

  render(){
    return(this.getView());
  }
}

class SingleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      toggle: false
    }
    this.toggleChange = this.toggleChange.bind(this);
    this.deleteTestCase = this.deleteTestCase.bind(this);
  }

  toggleChange() {
    console.log("toggle fired");
    var tog = this.state.toggle;
    this.setState({
      toggle: !tog
    });
  };

  deleteTestCase(event) {
    console.log("delete fired : " + this.state.id);
    let body = {
      id: this.state.id
    }
    fetch("http://localhost:3001/tests/delete", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("sucess deleting");
          this.props.refresh();
        }
        else {
          console.log("error while deleting");
        }
      })
  }

  render() {
    return (
      <div>
        {this.state.deleted ?
        <div>
        </div>
        :
        <div>{!this.state.toggle ?
          <button type="button" className="testcase" onClick={this.toggleChange}>
            {this.state.content}
          </button>
          :
          <div>
            <button type="button" className="testcase" onClick={this.toggleChange}>
              {this.state.content}
            </button>
            <div className="testcase-detail">
              Submitted by {this.state.ownername}.
              {this.props.currentUser === this.state.ownername ?
                <button onClick={this.deleteTestCase}>Delete TestCase</button>
                : <p>nope</p>}
            </div>
          </div>
        }
        </div>
        }
      </div>
    );
  }
}

class TestCasesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testCaseText: "",
      fetchedTest: []
    }
    this.requestPost = this.requestPost.bind(this);
    this.changeText = this.changeText.bind(this);
    this.refreshTestCases = this.refreshTestCases.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  changeText(event) {
    this.setState({ testCaseText: event.target.value});
  }

  componentDidMount() {
    this.refreshTestCases();
  }

  refreshTestCases() {
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
            fetchedTest: data.fetchedTest
          });
          console.log("fetchData Success " + data.fetchedTest);
        }
      })
      .catch(error => console.error(error));
  }

  requestPost(event) {
    alert('Submitted: ' + this.state.testCaseText);
    let body = {
      text: this.state.testCaseText,
      owner: this.props.username
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
        if (data.success) {
          this.setState({
            fetchedTest: data.fetchedTest
          });
        }
        else {
          console.log("error occured while updating");
        }
      });
    event.preventDefault();
  };

  toggle(obj, key){
    console.log("clicked " + obj.id + " " + obj.toggle);
    var flag = obj.toggle;
    obj.toggle = !flag;
    document.getElementById(obj.id).text = obj.ownername;
  }

  handleDelete(id, key){
    console.log("delete fired : " + id);
    let body = {
      id: id
    }
    fetch("http://localhost:3001/tests/delete", {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("sucess deleting");
          this.refreshTestCases();
        }
        else {
          console.log("error while deleting");
        }
      })
  }

  render() {
    const items = this.state.fetchedTest.map(obj =>{
      obj.toggle = false;
      return(
          <div key = {obj.key}>
            <button type="button" className="testcase" onClick={() => this.props.switchView('single', obj.id)}>
              {obj.content}
            </button>
            <div className = "testcase-detail" id = "obj.id"></div>
          </div>
      );     
    });

    return (
      <div>
        {items}
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
        <View authenticated={this.state.authenticated} username={this.state.username} ></View>
      </div>
    )
  }
}

export default App;
