import SWAPI from './services/SWAPI'
import Main from './components/Main'

const swapi = new SWAPI('https://swapi-graphql-dave.herokuapp.com/')

function App() {

  return (
    <div className="App">
      <Main service={swapi}></Main>
    </div>
  );
}

export default App;
