import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

function App() {
  return (
    <div>
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/entrees" component={Entrees} />
        <Route path="/reserve" component={Reserve} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
    <footer>
    <h1>Funciona</h1>
    </footer>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

class Entrees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://hacebuche-api.herokuapp.com/api/menu/entrees")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } 
    else if (!isLoaded) {
      return <div>Loading...</div>;
    } 
    else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}

class Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name:'',email:'',phone:'',reserveDate:'',reserveHour:'',numberDiners:'',preferedPlace:'',observations:''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleChange(event) {
    const input = event.target.name;
    let value = '';
    
    if (input === 'phone' || input === 'numberDiners') {
      value = parseInt(event.target.value);
    }
    else {
      value = event.target.value;
    }

    this.setState({
      [input]: value
    });
  }

  handleSend() {
    const url = 'https://hacebuche-api.herokuapp.com/api/mail'
    let headers = {
      'Content-Type':'application/json '
    };

    axios.post(url, this.state, {headers:headers})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
      <form>
        <label>Name: </label>
        <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
        <br />
        <label>Email: </label>
        <input name="email" type="text" value={this.state.email} onChange={this.handleChange} />
        <br />
        <label>Phone: </label>
        <input name="phone" type="number" value={this.state.phone} onChange={this.handleChange} />
        <br />
        <label>Reserve Date: </label>
        <input name="reserveDate" type="text" value={this.state.reserveDate} onChange={this.handleChange} />
        <br />
        <label>Reserve Hour: </label>
        <input name="reserveHour" type="text" value={this.state.reserveHour} onChange={this.handleChange} />
        <br />
        <label>Number of Diners: </label>
        <input name="numberDiners" type="number" value={this.state.numberDiners} onChange={this.handleChange} />
        <br />
        <label>Prefered Place: </label>
        <input name="preferedPlace" type="text" value={this.state.preferedPlace} onChange={this.handleChange} />
        <br />
        <label>Observations: </label>
        <input name="observations" type="text" value={this.state.observations} onChange={this.handleChange} />
        <br />
        <br />
      </form>
      <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

function Topic({ match }) {
  return <h3>Requested Param: {match.params.id}</h3>;
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:id`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/entrees">Entrantes</Link>
      </li>
      <li>
        <Link to="/reserve">Reservar</Link>
      </li>
      <li>
        <Link to="/topics">Topics</Link>
      </li>
    </ul>
  );
}

export default App;
