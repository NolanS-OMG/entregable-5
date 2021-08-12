import { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from 'react-router-dom';
import axios from 'axios';

const PokemonCard = ( {data} ) => {
    const capitalize = (str) => {
        return str[0].toUpperCase() + str.slice(1,str.length).toLowerCase();
    }
    const get = (url) => {
        const promise = axios.get(url);
        return promise;
    }

    const {url} = useRouteMatch();

    const history = useHistory();

    const click = () => {
        history.push(`${url}/pokemon/${(typeof pokemon === typeof {}) ? pokemon.id:'1'}`);
    }

    const pokemonPromise= get(data.url);
    const [pokemon, setPokemon] = useState('');
    const [pokemonImage, setPokemonImage] = useState('');

    useEffect( () => {
        if (typeof pokemon === typeof {}) {
            setPokemonImage(pokemon.sprites.front_default);
        } else {
            pokemonPromise.then(res => {
                setPokemon(res.data);
            })
        }
    }, [pokemon, pokemonPromise] )

    const types = (typeof pokemon === typeof {}) ? pokemon.types.map( (element,index,array) => {
        return capitalize(element.type.name)
    } ).join(', '): [];
    return ( 
        <div className='pokemon-card' onClick = {click}>
            <h4>{(typeof pokemon === typeof {}) ? capitalize(pokemon.name): ''}</h4>
            <div><img src={pokemonImage} alt = {(typeof pokemon === typeof {}) ? capitalize(pokemon.name): ''} /></div>
            <div>
                <p><b>TIPOS:</b> {types}</p>
                <p><b>Stats:</b>
                    <span>- Ataque: {(typeof pokemon === typeof {}) ? pokemon.stats[0].base_stat: ''}</span>
                    <span>- Defensa: {(typeof pokemon === typeof {}) ? pokemon.stats[1].base_stat: ''}</span>
                    <span>- Velocidad: {(typeof pokemon === typeof {}) ? pokemon.stats[5].base_stat: ''}</span>
                </p>
            </div>
        </div> 
    )
}

export default PokemonCard;