import SWAPI from './services/SWAPI'
import Main from './components/Main'

const swapi = new SWAPI('https://swapi-graphql.netlify.app/.netlify/functions/index')

function App() {

  return (
    <div className="App">
      <Main service={swapi}></Main>
    </div>
  );
}

export default App;
