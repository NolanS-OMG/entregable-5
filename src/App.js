import { useState } from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from './Login.js';
import Pokedex from './Pokedex.js';
import Pokemon from './Pokemon.js';

function App() {
  const [trainerName, setTrainerName] = useState('');
  return (
    <div className = "front-container">
      <Router>
        <Switch>
          <Route path='/pokedex'>
            <Pokedex trainer = {trainerName}/>
            <Switch>
              <Route path='/pokedex/pokemon/:pokemonId'>
                <Pokemon/>
              </Route>
            </Switch>
          </Route>
          <Route path='/login'>
            <Login setTrainer = {setTrainerName}/>
        </Route>
          <Route path='/'>
            <Redirect to='/login'/>
        </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
