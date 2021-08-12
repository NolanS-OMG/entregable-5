import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import PokeBallImage from './images/Pokebola.png';

const Login = () => {
    const { register, handleSubmit } = useForm();

    const { putUser } = useAuth();

    const history = useHistory();

    const submitFunction = (values) => {
        putUser(values.trainer);
        if (values) {
            history.push('/pokedex');
        }
    }

    return (
        <div className='login-container'>
            <div className='login-titles'>
                <img src={PokeBallImage} alt='Pokebola'/>
                <div>
                    <h4>REGISTRO</h4>
                    <p>Introduce tu nombre de entrenador pokemon.</p>
                </div>
            </div>
            <form onSubmit = {handleSubmit( submitFunction )} action='/pokedex'>
                <div>
                    <label>Nombre: </label>
                    <input placeholder='eg. Entrenador Marley' {...register('trainer', {
                            required: true
                        } ) }/>
                </div>
                <button type='submit'>Listo</button>
            </form>
        </div>
    )
}

export default Login;