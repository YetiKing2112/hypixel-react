import { Card, Modal } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import api from '../../api/ApiHelper'
import ItemFilterPropertiesDisplay from '../ItemFilter/ItemFilterPropertiesDisplay'
import styles from './TradeCreate.module.css'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import TradeInventory from '../PlayerInventory/PlayerInventory'
import PlayerInventory from '../PlayerInventory/PlayerInventory'

export default function TradeCreate() {
    let [accountDetails, setAccountDetails] = useState<AccountInfo>()
    let [offer, setOffer] = useState<InventoryData>()
    let [showOfferModal, setShowOfferModal] = useState(false)

    useEffect(() => {
        api.getAccountInfo().then(accountInfo => {
            setAccountDetails(accountInfo)
        })
    }, [])

    let selectOfferModal = (
        <Modal
            size={'lg'}
            show={showOfferModal}
            onHide={() => {
                setShowOfferModal(false)
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Select the item you want to offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PlayerInventory />
            </Modal.Body>
        </Modal>
    )

    return (
        <>
            <Card className={styles.card}>
                <Card.Header>
                    <Card.Title>{accountDetails?.mcName}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <div style={{ width: '40%' }}>
                            <h2>Has</h2>
                            {offer ? (
                                <Card>
                                    <Card.Header>
                                        <Card.Title>{offer?.itemName}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <ItemFilterPropertiesDisplay filter={offer.extraAttributes} />
                                        <ItemFilterPropertiesDisplay filter={offer.enchantments} />
                                    </Card.Body>
                                </Card>
                            ) : (
                                <p
                                    onClick={() => {
                                        setShowOfferModal(true)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <AddIcon /> Select item you want to offer
                                </p>
                            )}
                        </div>
                        <div style={{ width: '40%' }}>
                            <h2>Want</h2>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            {selectOfferModal}
        </>
    )
}
