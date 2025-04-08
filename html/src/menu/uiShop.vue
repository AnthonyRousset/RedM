<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useShopStore } from '../stores/shopStore'

import Inventory from './components/inventory.vue'
import QuantityModal from './components/QuantityModal.vue'
import BubbleMessage from './components/BubbleMessage.vue'

const playerStore = usePlayerStore()
const shopStore = useShopStore()
const uiStore = useUiStore()

const isLoading = ref(true)
const shopView = ref(shopStore.lastActiveTab || 'shop')
const isSwitching = ref(false)
const playerMessage = ref('')
const vendorMessage = ref('')
const selectedItem = ref(null)
const quantityModal = ref(false)
const searchQuery = ref('')
const filteredItems = ref([])

// Phrases de vendeur typiques du western
const vendorPhrases = {
    welcome: {
        generalStore: "Bienvenue au magasin général, partenaire ! J'ai tout ce qu'il vous faut !",
        butcher: "Bienvenue à la boucherie, cow-boy ! J'ai les meilleurs morceaux de l'Ouest !",
        gunsmith: "Entrez donc, m'sieur ! Mes armes sont les plus fiables à l'ouest du Mississippi !",
        fishmonger: "Bonjour, partenaire ! Mes poissons sont aussi frais que l'eau de la rivière !"
    },
    goodbye: {
        generalStore: "Au revoir, partenaire ! Revenez nous voir bientôt !",
        butcher: "Au plaisir de vous revoir, cow-boy ! Gardez votre couteau bien aiguisé !",
        gunsmith: "Prenez soin de cette arme, m'sieur ! Une arme bien entretenue peut vous sauver la vie !",
        fishmonger: "Bonne pêche, partenaire ! Que les poissons mordent à votre hameçon !"
    },
    noMoney: "Par le ciel ! Vous n'avez pas assez de dollars, partenaire !",
    buySuccess: "Excellente acquisition, cowboy !",
    sellSuccess: "Merci pour cette transaction, partenaire !",
    adminSuccess: "Vous avez accès aux documents administratifs."
}

// Fermeture du menu
const close = () => {
    uiStore.isClosing = true;
    setTimeout(() => {
        sendNui('shop-close-' + shopStore.id, { id: shopStore.id })
        uiStore.closeMenu()
        uiStore.isClosing = false;
    }, 600); // Attendre la fin de l'animation
};

// Changement de vue (shop/admin)
const switchView = (view) => {
    isSwitching.value = true;
    setTimeout(() => {
        shopView.value = view;
        isSwitching.value = false;
    }, 100);
}

// Achat d'un article
const buyItem = (item) => {
    if (item.quantity > 1) {
        selectedItem.value = item
        quantityModal.value = true
        uiStore.closeInventoryModal = true
        window.dispatchEvent(new Event('close-inventory-modal'))
    } else {
        processBuy(item, 1)
    }
}

// Vente d'un article
const sellItem = (item) => {
    if (item.quantity > 1) {
        selectedItem.value = item
        quantityModal.value = true
        uiStore.closeInventoryModal = true
        window.dispatchEvent(new Event('close-inventory-modal'))
    } else {
        processSell(item, 1)
    }
}

// Traitement de l'achat avec la quantité
const processBuy = (item, quantity) => {
    // Vérifier si le joueur a assez d'argent
    const totalPrice = item.price * quantity
    if (playerStore.wallet < totalPrice) {
        playerMessage.value = shopPhrases.noMoney
        return
    }

    sendNui('shop-buy-' + shopStore.id, { 
        shopid: shopStore.id, 
        itemid: item.id, 
        quantity: quantity 
    })
    
    playerMessage.value = shopPhrases.buySuccess
}

// Traitement de la vente avec la quantité
const processSell = (item, quantity) => {
    sendNui('shop-sell-' + shopStore.id, { 
        shopid: shopStore.id, 
        itemid: item.id, 
        quantity: quantity 
    })
    
    playerMessage.value = shopPhrases.sellSuccess
}

// Confirmation de la quantité pour l'achat
const handleBuyQuantityConfirm = (quantity) => {
    if (selectedItem.value) {
        processBuy(selectedItem.value, quantity)
        selectedItem.value = null
    }
}

// Confirmation de la quantité pour la vente
const handleSellQuantityConfirm = (quantity) => {
    if (selectedItem.value) {
        processSell(selectedItem.value, quantity)
        selectedItem.value = null
    }
}

// Filtrage des articles en fonction de la recherche
const filterItems = () => {
    if (!searchQuery.value) {
        filteredItems.value = shopStore.stock
        return
    }

    filteredItems.value = shopStore.stock.filter(item => 
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
}

const extendChest = () => {
    sendNui('shop-extend-chest', {
        shopid: shopStore.id
    })
}

// Observer les changements dans la recherche et l'inventaire
watch(() => searchQuery.value, filterItems)
watch(() => shopStore.stock, () => {
    filteredItems.value = shopStore.stock
})

// Écouter les événements pour fermer le modal
onMounted(() => {
    window.addEventListener('close-shop-modal', () => {
        quantityModal.value = false
    })
    
    // Initialiser les articles filtrés
    filteredItems.value = shopStore.stock
    
    // Simuler un chargement (à remplacer par l'appel réel)
    setTimeout(() => {
        isLoading.value = false
    }, 1000)
})

onUnmounted(() => {
    window.removeEventListener('close-shop-modal', () => {
        quantityModal.value = false
    })
})
</script>

<template>
    <div class="shop">
        <div class="shop-container" :class="{ '__closing': uiStore.isClosing || isSwitching }">
            <!-- Contenu principal -->
            <div class="container">
                <!-- En-tête avec le nom du magasin -->
                <div class="shop-header">
                    <h1>{{ shopStore.id || 'Magasin' }}</h1>
                    <div class="player-money">Votre argent: {{ playerStore.getWalletDollars }}$</div>
                </div>
                
                <!-- Zone des messages -->
                <div class="shop-messages">
                    <BubbleMessage 
                        :message="playerMessage"
                        person="Moi"
                        type="player"
                        :active="!!playerMessage"
                    />
                    <BubbleMessage 
                        :message="vendorMessage"
                            :person="shopStore.id || 'Vendeur'"
                        type="banker"
                        :active="!!vendorMessage"
                    />
                </div>
                
                <!-- Vue d'achat -->
                <div class="shop-buy" v-if="shopView === 'admin'">

                    <button @click="extendChest">shop-extend-chest</button>

                </div>
                
                <!-- Vue de vente -->
                <div class="shop-sell" v-else-if="shopView === 'shop'">
                    <div class="inventory-container">
                        <Inventory 
                            :type="'shop'" 
                            :idEntity="shopStore.selectedShop?.id" 
                            :inventory="playerStore.inventory"
                            @itemClick="sellItem"
                        />
                    </div>
                </div>
                
                <button class="close" @click="close">X</button>
            </div>
        </div>
    </div>

    <!-- Conversation avec le vendeur -->
    <div class="shop-conversation" v-if="isLoading">
        <div class="bubble">
            Bien l'bonjour, m'sieur !
        </div>
    </div>
    <div class="shop-conversation" v-else-if="uiStore.isClosing">
        <!-- Vide pendant la fermeture -->
    </div>
    <div class="shop-conversation" v-else>
        <div class="bubble" @click="switchView('admin')" v-if="shopStore.rank >= 0">
            J'aimerais avoir voir les documents administratifs.
        </div>

        <div class="bubble" @click="switchView('shop')" v-if="shopStore.rank >= 0">
            Voyons voir c'que nous avons à <span>vendre</span>.
        </div>

        <div class="bubble" @click="close">
            Au revoir, m'sieur !
        </div>
    </div>

    <!-- Modal pour la quantité -->
    <QuantityModal 
        :type="'shop'" 
        v-model="quantityModal" 
        :max-quantity="selectedItem?.quantity || 0"
        :person="shopStore.id || 'Vendeur'"
        :error="'Par le ciel ! Vous n\'avez pas assez de dollars pour acheter autant, partenaire !'"
        :title="shopView === 'shop' ? 'Quantité à acheter' : 'Quantité à vendre'"
        @confirm="shopView === 'shop' ? handleBuyQuantityConfirm : handleSellQuantityConfirm"
        @cancel="quantityModal = false"
    />
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

// Variables SCSS
$font-family-primary: 'Special Elite', serif;
$color-gold: #805f07;
$color-gold-light: #a8854d;
$color-text-dark: #442c1a;
$color-red: #6d1f1f;
$color-red-hover: #932020;
$color-text-light: #f5e6c9;
$animation-timing: 0.6s ease-out;

/* Masquer la scrollbar tout en gardant la fonctionnalité */
:deep(.ps) {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;

    &::-webkit-scrollbar {
        display: none !important;
    }
}

:deep(.ps__rail-x),
:deep(.ps__rail-y) {
    display: none !important;
}

.shop {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

.shop-container {
    animation: openShop $animation-timing forwards;
    position: absolute;
    height: 100%;
    width: 100%;

    &.__closing {
        animation: closeShop $animation-timing forwards !important;
    }
}

@keyframes openShop {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes closeShop {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.8);
    }
}


@keyframes blink {
    0% {
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    80% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}



.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    background-image: url('/images/shop/shop-background.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 0.5vw;
    color: $color-text-dark;
    font-family: $font-family-primary;
    display: flex;
    flex-direction: column;
    padding: 2vw;
}

.shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1vw;
    
    h1 {
        color: $color-gold;
        font-size: 2vw;
        margin: 0;
        text-shadow: 0.1vw 0.1vw 0.1vw rgba(0, 0, 0, 0.5);
    }
    
    .player-money {
        color: $color-gold;
        font-size: 1.5vw;
        font-weight: bold;
    }
}

.shop-messages {
    margin-bottom: 1vw;
}




.inventory-container {
    width: 100%;
    height: 65vh;
}

.close {
    background: $color-red;
    color: $color-text-light;
    font-weight: bold;
    padding: 0.5vw;
    font-family: $font-family-primary;
    cursor: pointer;
    position: absolute;
    top: 1vw;
    right: 1vw;
    width: 2.5vw;
    height: 2.5vw;
    border-radius: 2.5vw;
    border: none;
    font-size: 1.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0.5vw rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;
    z-index: 1000;

    &:hover {
        background: $color-red-hover;
    }
}

.shop-conversation {
    position: absolute;
    bottom: 1.5vw;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .bubble {
        color: #1d1d1d;
        font-family: $font-family-primary;
        font-size: 1.2vw;
        text-align: center;
        padding: 1.5vw 4vw;
        cursor: pointer;
        font-style: italic;
        margin-top: 0.5vw;
        background-image: url('/images/ton-brush-western.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.8;

        span {
            color: #000000;
            font-weight: bold;
        }
        
        &:hover {
            opacity: 1;
        }
    }
}
</style> 