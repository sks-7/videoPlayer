import './App.css';

import VideoPlayer from './VideoPlayer';

function App() {
  return (
    <div className="App">
      <VideoPlayer url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
    </div>
  );
}

export default App;
