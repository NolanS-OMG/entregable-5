import { useRouteMatch } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";

const Pokemon = () => {
    const {params} = useRouteMatch();

    const capitalize = (str) => {
        return str[0].toUpperCase() + str.slice(1,str.length).toLowerCase();
    }

    const get = (url) => {
        const promise = axios.get(url);
        return promise;
    }

    const pokemonPromise = get(`https://pokeapi.co/api/v2/pokemon/${params.pokemonId}`);

    const [pokemon, setPokemon] = useState('');

    const types = (typeof pokemon === typeof {}) ? pokemon.types.map( (element,index,array) => {
        return capitalize(element.type.name)
    } ).join(', '): '';

    useEffect( () => {
        if (typeof pokemon !== typeof {}) {
            pokemonPromise.then(res => {setPokemon(res.data)})
        }
    }, [pokemon] )

    const stats = (typeof pokemon === typeof {}) ? pokemon.stats.map( (element, index) => {
        return( <div key = {pokemon.name + ' stat: ' + index}><b>{capitalize(element.stat.name)}</b>{': ' + element.base_stat}</div> )
    } ) : []
    const habilities = (typeof pokemon === typeof {}) ? pokemon.abilities.map( (element) => {
        return( <div>Habilidad <b>{capitalize(element.ability.name)}</b>: {(!element.is_hidden) ? 'no':''} oculta</div> )
    } ): [];
    return (
        <div className='pokemon-container'>
            <div className='pokemon'>
                <h4>{(typeof pokemon === typeof {}) ? pokemon.name : ''}</h4>
                <div className = 'pokemon-image-container'><img src = {(typeof pokemon === typeof {}) ? pokemon.sprites.front_default : 'https://i.pinimg.com/originals/44/bd/e7/44bde730a4daa2d1754d296e07ac886d.jpg'} /></div>
                <div className = 'pokemon-stats'>
                    <div><b>TIPOS: </b><span>{types}</span></div>
                    {stats}
                    <div><b>Altura: </b>{pokemon.height+'cm'}</div>
                    <div><b>Peso: </b>{pokemon.weight+'00g'}</div>
                    <div><b>Orden en la pokedex: </b>{pokemon.order}</div>
                </div>
                <div className='pokemon-habilities'>{habilities}</div>
                <div className='pokemon-moves'></div>
            </div>
        </div>
    )
}

export default Pokemon;