import BasicScene from "./pages/BasicScene";
import ParentChildren from "./pages/ParentChildren";
import VillageAnimation from "./pages/VillageAnimation";
import SmallVillage from "./pages/SmallVillage";
import movePOV from "./pages/MovePov";
import CartoonCharacters from "./pages/CartoonCharacters";
import DistantHills from "./pages/DistantHills/DistantHills";
import Latheturned from "./pages/LatheTurned/LatheTurned";
import StreetLights from "./pages/Light/StreetLights";
import Charater from "./pages/Charater";


function App() {
  const canvas = document.getElementById("canvas"); //获取到 canvas的真实dom
  // new BasicScene(canvas)  //把获取到的canvas 当作容器传给
  // new ParentChildren(canvas)
  // new VillageAnimation(canvas)
  // new SmallVillage(canvas)//完整
  new Charater(canvas)
  // new movePOV(canvas)
  // new CartoonCharacters(canvas)
  // new DistantHills(canvas)
  // new Latheturned(canvas)
  // new StreetLights(canvas)
  
  return (
    <div className="App">

    </div>
  );
}

export default App;
