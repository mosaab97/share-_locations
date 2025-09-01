import { useState } from "react"
import Button from "../../shared/components/FormElements/Button/Button"
import Card from "../../shared/components/UIElements/Card"
import Modal from "../../shared/components/UIElements/Modal"
import Map from "../../shared/components/UIElements/Map"

const PlaceItem = ({ id, image, title, description, address, coordinates }) => {

    const [showMap, setShowMap] = useState(false)

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)

    return (
        <>
            <li key={id} className='place-item'>
                <Card className='place-item__content' >
                    <div className='place-item__image'>
                        <img src={image} alt={title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{title}</h2>
                        <h3>{address}</h3>
                        <p>{description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>View on Map</Button>
                        <Button to={`/places/${id}`}>Edit</Button>
                        <Button danger>Delete</Button>
                    </div>
                </Card>
            </li>
            <Modal show={showMap} onCancel={closeMapHandler} header={address} contentClass='place-item__modal-content' footerClass='place-item__modal-actions' footer={<Button onClick={closeMapHandler}>Close</Button>}>
                <div className='map-container'>
                    <Map center={coordinates} zoom={16}/>
                </div>
            </Modal>
        </>
    )
}

export default PlaceItem