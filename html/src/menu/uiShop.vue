<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useShopStore } from '../stores/shopStore'

import Inventory from './components/inventory.vue'
import QuantityModal from './components/QuantityModal.vue'
import BubbleMessage from './components/BubbleMessage.vue'
import Gestion from './uiShop/Gestion.vue'
import Magasin from './uiShop/Magasin.vue'
import Stock from './uiShop/Stock.vue'  

const playerStore = usePlayerStore()
const shopStore = useShopStore()
const uiStore = useUiStore()

const isLoading = ref(true)
const shopView = ref(shopStore.lastActiveTab || 'magasin')
const isSwitching = ref(false)
const playerMessage = ref('')
const vendorMessage = ref('')
const selectedItem = ref(null)
const quantityModal = ref(false)
const searchQuery = ref('')
const filteredItems = ref([])
const currentPage = ref(1)
const totalPages = ref(5)

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
    if (view === shopView.value) {
        return;
    }
    isSwitching.value = true;
    setTimeout(() => {
        shopView.value = view;
        isSwitching.value = false;
    }, 100);
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
        id: shopStore.id
    })
    close()
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

    <!-- menu shop -->
    <div class="menu" v-if="!uiStore.isClosing">
        <ul>
            <li v-if="shopStore.rank >= 0"> <!-- TODO : shopStore.rank >= 0-->
                <button @click="switchView('magasin')" :class="{ 'active': shopView === 'magasin' }">
                    <span>Magasin</span>
                </button>
            </li>
            <li v-if="shopStore.rank >= 0"> <!-- TODO : shopStore.rank >= 0-->
                <button @click="switchView('gestion')" :class="{ 'active': shopView === 'gestion' }">
                    <span>Gestion</span>
                </button>
            </li>
            <li v-if="shopStore.rank >= 0"> <!-- TODO : shopStore.rank >= 0 -->
                <button @click="switchView('stock')" :class="{ 'active': shopView === 'stock' }">
                    <span>Stock</span>
                </button>
            </li>
            <li>
                <button @click="close" class="close">
                    <span>Fermer</span>
                </button>
            </li>
        </ul>
    </div>

    <!-- menu shop -->
    <div class="shop" :class="{ '__closing': uiStore.isClosing || isSwitching }">

        <!-- Zone des messages 
        <div class="shop-messages">
            <BubbleMessage :message="playerMessage" person="Moi" type="player" :active="!!playerMessage" />
            <BubbleMessage :message="vendorMessage" :person="shopStore.id || 'Vendeur'" type="banker"
                :active="!!vendorMessage" />
        </div>
        -->

        <!-- Vue de gestion -->
        <Gestion v-if="shopView === 'gestion'" />     

        <!-- Vue de achat/ vente -->
        <Magasin v-if="shopView === 'magasin'" />

        <!-- Vue de stock -->
        <Stock v-if="shopView === 'stock'" />

    </div>

    <!-- Conversation avec le vendeur 
    <div class="shop-conversation" v-if="isLoading">
        <div class="bubble">
            Bien l'bonjour, m'sieur !
        </div>
    </div>
    <div class="shop-conversation" v-else-if="uiStore.isClosing">
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
    -->

    <!-- Modal pour la quantité -->
    <QuantityModal 
        v-model="quantityModal" 
        :item="selectedItem"
        to="shop" 
        person="Vendeur"
        title="Quantité à acheter" 
        :error="'Par le ciel ! Vous n\'avez pas assez de dollars pour acheter autant, partenaire !'"
        @confirm="handleBuyQuantityConfirm"
        @cancel="quantityModal = false" />
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


/* menu shop */
.menu {
    position: absolute;
    top: 3vw;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;


    &::after {
        content: '';
        display: block;
        height: 10px;
        right: -8vw;
        left: -8vw;
        position: absolute;
        background-image: url('/images/line2.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        li {
            button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.5vw;
                font-family: $font-family-primary;
                color: #ffffff;
                padding: 0.5vw 1vw;
                border-radius: 0.5vw;
                transition: all 0.2s ease-in-out;
                cursor: pointer;

                &:hover {
                    /*color: $color-text-light;   */
                    text-shadow: 0 0 2vw #ffffff, 0 0 3vw #ffffff, 0 0 3vw #ffffff, 0 0 2vw #ffffff, 0 0 2vw #ffffff;

                }

                &.active {
                    color: $color-text-light;
                    /*text-shadow:0 0 2vw #ffffff,0 0 3vw #ffffff,0 0 3vw #ffffff,0 0 2vw #ffffff,0 0 2vw #ffffff;
                    */
                }

                &.close {
                    color: $color-red-hover
                }
            }
        }
    }
}



.shop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    animation: openShop-8b9c9eec 0.6s ease-out forwards;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;

    &.__closing {
        animation: closeShop $animation-timing forwards !important;
    }
}


@keyframes openShop {
    0% {
        opacity: 0;
        transform: scale(0);
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
        transform: scale(0);
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



.shop-messages {
    margin-bottom: 1vw;
}




.inventory-container {
    width: 100%;
    height: 65vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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