import { useRef, useEffect } from 'react';
import './UIElements.css';
const Map = (props) => {
    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps script not loaded yet!");
            return;
        }
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({
            position: center,
            map: map
        });
    }, [center, zoom]);

    return <div ref={mapRef} className={`map ${props.className}`} style={props.style} />
}

export default Map

