import BasicScene from "./pages/BasicScene";
import ParentChildren from "./pages/ParentChildren";
import VillageAnimation from "./pages/VillageAnimation";
import SmallVillage from "./pages/SmallVillage";
import movePOV from "./pages/MovePov";
import CartoonCharacters from "./pages/CartoonCharacters";
import DistantHills from "./pages/DistantHills/DistantHills";


function App() {
  const canvas = document.getElementById("canvas"); //获取到 canvas的真实dom
  // new BasicScene(canvas)  //把获取到的canvas 当作容器传给
  // new ParentChildren(canvas)
  // new VillageAnimation(canvas)
  new SmallVillage(canvas)//完整
  // new movePOV(canvas)
  // new CartoonCharacters(canvas)
  // new DistantHills(canvas)
  
  return (
    <div className="App">

    </div>
  );
}

export default App;
