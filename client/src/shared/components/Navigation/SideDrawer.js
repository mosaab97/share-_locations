import { useRef } from "react";
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"

const SideDrawer = (props) => {
    const nodeRedef = useRef(null);
    const drawer = (
        <CSSTransition nodeRef={nodeRedef} in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
            <aside ref={nodeRedef} className="side-drawer" onClick={props.onClick}>{props.children} </aside>
        </CSSTransition>
    )

    return ReactDOM.createPortal(drawer, document.getElementById('drawer'));
}

export default SideDrawer