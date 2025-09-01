import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';
import './UIElements.css';
import { useRef } from 'react';

const ModalOverlay = props => {
    
    return (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form
                onSubmit={
                    props.onSubmit ? props.onSubmit : event => event.preventDefault()
                }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
}

const Modal = ({show, onCancel, ...props}) => {
    const nodeRedef = useRef(null);
  return <>
    {show && <Backdrop onClick={onCancel} />}
    <CSSTransition nodeRef={nodeRedef} in={show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
        <ModalOverlay ref={nodeRedef} {...props}/>
    </CSSTransition>
  </>
}

export default Modal