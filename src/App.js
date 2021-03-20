import SWAPI from './services/SWAPI'
import Main from './components/Main'
function App() {

  const swapi = new SWAPI('http://localhost:1338/')

  return (
    <div className="App">
      <Main service={swapi}></Main>
    </div>
  );
}

export default App;
