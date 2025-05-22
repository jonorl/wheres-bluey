import ImageSelector from './ImageSelector';
import blueyRoom from "./assets/bluey-room-1440p.jpg"; 

function App() {
  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <ImageSelector imageUrl={blueyRoom} />
    </div>
  );
}

export default App;