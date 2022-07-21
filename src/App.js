import BasicScene from "./pages/BasicScene";
// import ParentChildren from "./pages/ParentChildren";
import VillageAnimation from "./pages/VillageAnimation";


function App() {
  const canvas = document.getElementById("canvas"); //获取到 canvas的真实dom
  // new BasicScene(canvas)  //把获取到的canvas 当作容器传给
  // new ParentChildren(canvas)
  new VillageAnimation(canvas)
  
  return (
    <div className="App">

    </div>
  );
}

export default App;
