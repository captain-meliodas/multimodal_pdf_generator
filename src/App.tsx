import logo from "./logo.svg";
import "./App.css";
import { ChatView } from "./Components/Chatview";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ChatView />
      </header>
    </div>
  );
}

export default App;
