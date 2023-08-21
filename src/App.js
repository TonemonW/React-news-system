import React from "react";
// import axios from 'axios'
import IndexRouters from "./router/IndexRouters";
import "./App.css"
import store from './redux/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <IndexRouters></IndexRouters>
    </Provider>

  );
}

export default App;
