import BasicScene from "./pages/BasicScene";


function App() {
  const canvas = document.getElementById("canvas");
  new BasicScene(canvas)
  
  return (
    <div className="App">

    </div>
  );
}

export default App;
