import SWAPI from './services/SWAPI'
import Main from './components/Main'

const swapi = new SWAPI('http://localhost:1338/')

function App() {

  return (
    <div className="App">
      <Main service={swapi}></Main>
    </div>
  );
}

export default App;
