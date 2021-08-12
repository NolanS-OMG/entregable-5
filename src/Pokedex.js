import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PokemonCard from './PokemonCard.js'
import PokeBallImage from './images/Pokebola.png';

const Pokedex = ({trainer}) => {
    const {register, handleSubmit} = useForm();

    function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

    const capitalize = (str) => {
        return str[0].toUpperCase() + str.slice(1,str.length).toLowerCase();
    }

    const get = (url) => {
        const promise = axios.get(url);
        return promise;
    }

    const submitFunction = (values) => {
        setIsSearching(false);
        if (values.name.length > 0) {
            console.log(values.name, isNumber(values.name));
            if (isNumber(values.name)) {
                setPokemonsShowed([ {url:`https://pokeapi.co/api/v2/pokemon/${values.name}`} ])
            } else if (pokemonsSearched.length > 1) {
                if (values.type.length > 0) {
                    get(`https://pokeapi.co/api/v2/type/${values.type.toLowerCase()}/`).then(
                        res => {
                            let array = [];
                            res.data.pokemon.forEach( (element) => {
                                for (let i = 0; i < pokemonsSearched.length; i++) {
                                    if (pokemonsSearched[i].name === element.pokemon.name) {
                                        array.push(element.pokemon);
                                    }
                                }
                            } )
                            setPokemonsShowed(array);
                        });
                } else {
                    setPokemonsShowed(pokemonsSearched);
                }
            } else if (pokemonsSearched.length === 0) {
                if (values.type.length > 0) {
                    get(`https://pokeapi.co/api/v2/type/${values.type.toLowerCase()}/`).then(
                        res => {
                            let array = [];
                            res.data.pokemon.forEach( (element) => {
                                array.push(element.pokemon);
                            } )
                            setPokemonsShowed(array);
                        });
                }
            } else {
                setPokemonsShowed(pokemonsSearched);
            }
        } else {
            if (values.type.length > 0) {
                get(`https://pokeapi.co/api/v2/type/${values.type.toLowerCase()}/`).then(
                    res => {
                        let array = [];
                        res.data.pokemon.forEach( (element) => {
                            array.push(element.pokemon);
                        } )
                        setPokemonsShowed(array);
                    });
            } else {
                setPokemonsShowed(allPokemons);
            }
        }
    }

    const [promiseTypes, setPromiseTypes] = useState(get('https://pokeapi.co/api/v2/type/?offset=0&limit=20'));
    const [promiseAllPokemons, setPromiseAllPokemons] = useState(get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1118'));

    const [types, setTypes] = useState([]);
    const [allPokemons, setAllPokemons] = useState([]);
    const [pokemonSearch, setPokemonSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [pokemonsSearched, setPokemonsSearched] = useState([]);
    const [pokemonsShowed, setPokemonsShowed] = useState([]);
    const [pageChosen, setPageChosen] = useState(1);
    const [display, setDisplay] = useState({display:'none'});

    useEffect( () => {
        promiseTypes.then(res => {setTypes(res.data.results)});
        promiseAllPokemons.then(res => {setAllPokemons(res.data.results)})
    }, [promiseTypes, promiseAllPokemons] )

    useEffect( () => {
        let posiblePokemons = [];
        if (pokemonSearch.length > 0) {
            allPokemons.forEach((pokemon) => {
                if (capitalize(pokemon.name.slice(0,pokemonSearch.length)) === capitalize(pokemonSearch)) {
                    posiblePokemons.push(pokemon);
                }
            });
        }
        if (posiblePokemons.length === 1 && posiblePokemons[0].length === pokemonSearch.length) {
            setPokemonsSearched([]);
        } else {
            setPokemonsSearched(posiblePokemons);
        }
    }, [pokemonSearch] )

    const typesOptions = types.map( (type) => { return( <option key={type.name} value={capitalize(type.name)}>{capitalize(type.name)}</option> ) } )
    const pokemonsOptions = pokemonsSearched.map( (pokemon,index) => { return( index < 8 && <li key={pokemon.name} onClick={()=>{setPokemonSearch(pokemon.name)}} >{capitalize(pokemon.name)}</li> ) } )
    const pokemonsCards = pokemonsShowed.map( (pokemon,index) => {return (( index >= (pageChosen-1)*4 && index < pageChosen*4 ) && <PokemonCard key={pokemon.name} data = {pokemon} />)} )
    const pagesIndex = pokemonsShowed.map( (pokemon,index,array) => {return(( (index+1 >= pageChosen-5) && (index+1<=pageChosen+5) && index+1 <= Math.ceil(array.length/4) ) &&  <li key={pokemon.name} onClick = {() => {setPageChosen(index+1)}}>{index+1}</li>)} )

    return (
        <div className='pokedex-container' onClick = {() => {
            setIsSearching(false);
        }}>
            <form className='searcher-container' onSubmit = {handleSubmit( submitFunction )}>
                <div className='title-container'>
                    <h1>POKEDEX</h1>
                    <p>Bienvenido {trainer}. Puedes buscar un pokemon por su nombre, filtrar por su tipo, o ambas</p>
                </div>
                <div className='labels-container'>
                    <label>
                        <span>ID o NOMBRE</span>
                        <input placeholder='eg. Pikachu, 24' 
                        {...register('name') } 
                        value = {pokemonSearch} 
                        onChange = {(e) => {
                            setIsSearching(true);
                            setPokemonSearch(e.target.value);
                        }} />
                        <ul className='search-results-list' style = {isSearching ? {display:'block'} : {display:'none'}}>{pokemonsOptions}</ul>
                    </label>
                    <label>
                        <span>TIPO</span>
                        <select {...register('type') }>
                            <option value=''>Cualquier tipo</option>
                            {typesOptions}
                        </select>
                    </label>
                </div>
                <button className='image-container' type='submit'><img src={PokeBallImage} alt='Pokebola'/></button>
            </form>
            <div className='pokemons-container'>
                {pokemonsCards}
            </div>
            <div className='pages-container'><ul>{pagesIndex}</ul></div>
        </div>
    )
}

export default Pokedex