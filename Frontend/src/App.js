// App.js
import React from 'react';
import './App.css';
import LoginButton from './LoginButton';
import InvoiceList from './InvoiceList';
import Image from './asserts/Image.jpg';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundImage: `url(${Image})` }}>
        <h1>Application on Invoice Reminder</h1>
        <LoginButton />
        <InvoiceList />
      </header>
    </div>
  );
}

export default App;
