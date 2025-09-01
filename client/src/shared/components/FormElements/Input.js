import { useReducer, useEffect } from 'react';
import './FromElements.css';
import { validate } from '../../util/validators';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
}

const Input = ({id, onInput, type, placeholder, validators, rows, label,errorText, element, InitialValue, InitialValid})=> {

    const [state, dispatch] = useReducer(inputReducer, {
        value: InitialValue || '',  // initial value
        isTouched: false,
        isValid: InitialValid || false  // initial validity
    });

    useEffect(() => {
        onInput(id, state.value, state.isValid);
    }, [id, state.value, state.isValid, onInput]);

    const onChangeHandler = event => {
        dispatch({ type: 'CHANGE', val: event.target.value, validators: validators });
        console.log(event.target.value);

    }

    const touchHandler = () => {
        dispatch({ type: 'TOUCH' });
    }

    const renderElement = element === 'input' ? (
        <input id={id} type={type} placeholder={placeholder} onChange={onChangeHandler} onBlur={touchHandler} value={state.value} />
    ) : (
        <textarea id={id} rows={rows || 3} onChange={onChangeHandler} onBlur={touchHandler} value={state.value} />
    )


    return (
        <div className={`form-control ${!state.isValid && state.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={id}>{label}</label>
            {renderElement}
            {!state.isValid && state.isTouched && <p>{errorText}</p>}
        </div>
    )
}

export default Input