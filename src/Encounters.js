import { useRouteMatch } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";

const Encounters = () => {
    const {params} = useRouteMatch();

    const get = (url) => {
        const promise = axios.get(url);
        return promise;
    }

    const pokemonEncountersPromise = get(`https://pokeapi.co/api/v2/pokemon/${params.pokemonId}/encounters`);

    const [pokemonEncounters, setPokemonEncounters] = useState('');

    const [encountersPage, setEncountersPage] = useState(1);

    useEffect( () => {
        if (typeof pokemonEncounters !== typeof []) {
            pokemonEncountersPromise.then(res => {setPokemonEncounters(res.data)});
        }
    }, [pokemonEncounters] )

    useEffect( () => {
        if (typeof pokemonEncounters === typeof []) {
            if (encountersPage <= 0) {
                setEncountersPage(1);
            }
            if (encountersPage >= Math.ceil(pokemonEncounters.length/5)+1) {
                setEncountersPage(Math.ceil(pokemonEncounters.length/5));
            }
        }
    }, [encountersPage] )

    const encounters = (typeof pokemonEncounters === typeof []) ? pokemonEncounters.map( (element,index) => {
        return( (index >= (encountersPage-1)*5 && index+1 <= (encountersPage*5)) && <span key = {element.location_area.name + `${index+1}`}><b>{index+1}:</b> {element.location_area.name}</span> )
    } ): [];

    return (
        <div className='pokemon-encounters'>
            ENCUENTROS
            {encounters}
            <div>
            <button onClick={() => {setEncountersPage(encountersPage-1)}}> &#60; </button>
            <button onClick={() => {setEncountersPage(encountersPage+1)}}> &#62; </button>
            </div>
        </div>
    )
}

export default Encounters;