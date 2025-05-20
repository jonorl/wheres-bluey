import ImageSelector from './ImageSelector';
import blueyRoom from "./assets/bluey-room-1440p.jpg"; 

function App() {
  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Click on the image to see coordinates and a dropdown!</h1>
      <ImageSelector imageUrl={blueyRoom} />
    </div>
  );
}

export default App;