import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PokemonCard from './PokemonCard.js'
import PokeBallImage from './images/Pokebola.png';
import { useAuth } from './AuthProvider.js';

const Pokedex = () => {
    const {register, handleSubmit} = useForm();

    const {user} = useAuth();

    const capitalize = (str) => {
        return str[0].toUpperCase() + str.slice(1,str.length).toLowerCase();
    }

    const get = (url) => {
        const promise = axios.get(url);
        return promise;
    }

    const sortPokemonByAlphabeth = (pokemon1, pokemon2) => {
        if (pokemon1.name > pokemon2.name) {
            return 1
        }
        if (pokemon1.name < pokemon2.name) {
            return -1
        }
        return 0
    }

    const submitFunction = (values) => {
        setIsSearching(false)
        if (values.type) {
            get(`https://pokeapi.co/api/v2/type/${values.type.toLowerCase()}/`).then(
                res => {
                    let array = [];
                    res.data.pokemon.forEach( (element) => {
                        if (pokemonsSearched.length > 0) {
                            for (let i = 0; i < pokemonsSearched.length; i++) {
                                if (pokemonsSearched[i] === element.pokemon.name) {
                                    array.push(element.pokemon);
                                }
                            }
                        } else {
                            array.push(element.pokemon);
                        }
                    } )
                    if (values.sortBy) {
                        array.sort(sortPokemonByAlphabeth)
                    }
                    if (values.sortBy === 'contra') {
                        array.reverse()
                    }
                    setPokemonsShowed(array);
                });
        } else if (values.name) {
            if (pokemonsSearched.length > 0) {
                get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1118`).then(
                res => {
                    let array = res.data.results.filter((pokemon) => {
                        for (let i=0; i<pokemonsSearched.length; i++) {
                            if (pokemon.name === pokemonsSearched[i]) {
                                return true
                            }
                        }
                        return false
                    })
                    if (values.sortBy) {
                        array.sort(sortPokemonByAlphabeth)
                    }
                    if (values.sortBy === 'contra') {
                        array.reverse()
                    }
                    setPokemonsShowed(array);
                })
            } else {
                setPokemonsShowed([ {name:values.name, url:`https://pokeapi.co/api/v2/pokemon/${values.name}`} ])
            }
        } else {
            get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1118').then(
                res => {
                    let array = [...res.data.results]
                    if (values.sortBy) {
                        array.sort(sortPokemonByAlphabeth)
                    }
                    if (values.sortBy === 'contra') {
                        array.reverse()
                    }
                    setPokemonsShowed(array)
                }
            )
        }
    }

    const [types, setTypes] = useState('');
    const [pokemonSearch, setPokemonSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [pokemonsSearched, setPokemonsSearched] = useState([]);
    const [pokemonsShowed, setPokemonsShowed] = useState([]);
    const [pageChosen, setPageChosen] = useState(1);

    const [pokemonNames, setPokemonNames] = useState()

    useEffect( () => {
        if (typeof pokemonNames !== typeof []) {
            get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1118').then(
                res => {
                    let array = []
                    res.data.results.forEach((pokemon)=>{
                        array.push(pokemon.name)
                    })
                    setPokemonNames(array)
                });
        }
    }, [pokemonNames] )

    useEffect( () => {
        if (typeof types !== typeof []) {
            get('https://pokeapi.co/api/v2/type/?offset=0&limit=20').then(res => {setTypes(res.data.results)});
        }
    }, [types] )

    useEffect( () => {
        let posiblePokemons = [];
        if (pokemonSearch.length > 0) {
            pokemonNames.forEach((name) => {
                if (name.toLowerCase().search(pokemonSearch.toLowerCase()) >= 0) {
                    posiblePokemons.push(name);
                }
            });
        }
        if (posiblePokemons.length === 1 && posiblePokemons[0].length === pokemonSearch.length) {
            setPokemonsSearched([]);
        } else {
            setPokemonsSearched(posiblePokemons);
        }
    }, [pokemonSearch, pokemonNames] )

    const NUMBER_OF_PAGES = Math.ceil(pokemonsShowed.length/4)

    const typesOptions = (typeof types === typeof []) ? types.map( (type) => { return( <option key={type.name} value={capitalize(type.name)}>{capitalize(type.name)}</option> ) } ) : [];
    const pokemonsOptions = pokemonsSearched.map( (pokemonName,index) => { return( index < 8 && <li key={pokemonName} onClick={()=>{setPokemonSearch(pokemonName)}} >{capitalize(pokemonName)}</li> ) } )
    const pokemonsCards = pokemonsShowed.map( (pokemon,index) => {return (( index >= (pageChosen-1)*4 && index < pageChosen*4 ) && <PokemonCard key={pokemon.name} data = {pokemon} />)})
    const pagesIndex = pokemonsShowed.map( (pokemon,index) => {return(( (index+1 >= pageChosen-5) && (index+1<=pageChosen+5) && index+1 <= NUMBER_OF_PAGES ) && <li key={pokemon.name} onClick = {() => {setPageChosen(index+1)}} style={{backgroundColor: pageChosen===(index+1) && 'rgb(192, 20, 1)', color: pageChosen===(index+1) && 'rgb(252, 232, 218)' }}>{index+1}</li>)} )

    return (
        <div className='pokedex-container' onClick = {() => {
            setIsSearching(false);
        }}>
            <form className='searcher-container' onSubmit = {handleSubmit( submitFunction )}>
                <div className='title-container'>
                    <h1>POKEDEX</h1>
                    <p>Bienvenido {user}. Puedes buscar un pokemon por su nombre, filtrar por su tipo, o ambas</p>
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
                        <ul className='search-results-list' style = {isSearching ? {display:'block'} : {display:'none'}}>
                            {pokemonsOptions}
                        </ul>
                    </label>
                    <label>
                        <span>TIPO</span>
                        <select {...register('type') }>
                            <option value=''>Cualquier tipo</option>
                            {typesOptions}
                        </select>
                    </label>
                    <label>
                        <span>Ordenar: </span>
                        <select {...register('sortBy') }>
                            <option value=''>Sin orden</option>
                            <option value='favor'>A favor del alfabeto</option>
                            <option value='contra'>En contra del alfabeto</option>
                        </select>
                    </label>
                </div>
                <button className='image-container' type='submit'><img src={PokeBallImage} alt='Pokebola'/></button>
            </form>
            <div className='pokemons-container'>
                {pokemonsCards}
            </div>
            <div className='pages-container'>
                <ul>
                    <li onClick={() => {
                        if (pageChosen > 1) {
                            setPageChosen(pageChosen-1)
                        }
                    }}>&lt;</li>
                    {pageChosen-5 > 1 && <li onClick={()=>{setPageChosen(1)}}>1</li>}
                    {pageChosen-6 > 1 && '...'}
                    {pagesIndex}
                    {pageChosen+6 < NUMBER_OF_PAGES && '...'}
                    {pageChosen+5 < NUMBER_OF_PAGES && <li onClick={()=>{setPageChosen(NUMBER_OF_PAGES)}}>{NUMBER_OF_PAGES}</li>}
                    <li onClick={() => {
                        if (pageChosen < NUMBER_OF_PAGES) {
                            setPageChosen(pageChosen+1)
                        }
                    }}>&gt;</li>
                </ul>
                </div>
        </div>
    )
}

export default Pokedex