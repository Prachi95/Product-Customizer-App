import './App.css';
import Customizer from "./Components/Customizer";
import data from "./Api/data.json";

function App() {
  return (
    <div className="App-container">
      <header className="App-header"></header>
      <main className="App-main">
        <Customizer data={data}/>
      </main>
    </div>
  );
}

export default App;