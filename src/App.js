import logo from './logo.svg';
import './App.css';

import ChatPage  from './components/ChatPage'
import Loginpage from './components/LoginPage'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Loginpage />} />
        <Route path='/chat/:username' element={<ChatPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
