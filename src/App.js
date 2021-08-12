import ProtectedRoute from './ProtectedRoute.js';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Encounters from './Encounters.js';
import Login from './Login.js';
import Pokedex from './Pokedex.js';
import Pokemon from './Pokemon.js';

function App() {
  return (
    <div className = "front-container">
      <Router>
        <Switch>
          <ProtectedRoute path='/pokedex'>
            <Pokedex/>
            <Switch>
              <ProtectedRoute path='/pokedex/pokemon/:pokemonId'>
                <Pokemon/>
                <Switch>
                  <ProtectedRoute path = '/pokedex/pokemon/:pokemonId/encounters'>
                    <Encounters/>
                  </ProtectedRoute>
                </Switch>
              </ProtectedRoute>
            </Switch>
          </ProtectedRoute>
          <Route path='/login'>
            <Login/>
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
