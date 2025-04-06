<script setup>
import { ref } from 'vue';
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBankStore } from '../stores/bankStore'
import Item from './components/item.vue'
import itemsData from '../data/items.json'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const playerStore = usePlayerStore()
const bankStore = useBankStore()
const uiStore = useUiStore()

const tags = ref(itemsData.tags)
const categories = ref(itemsData.categories)
const items = ref(itemsData.items)

const dollarForm = ref();
const showPlaceholder = ref(true);
const editableSpan = ref(null);
const playerMessage = ref('');
const bankMessage = ref('');
const bankView = ref('account');
const isSwitching = ref(false);
const selectedFilter = ref('all');

// Gestion du tooltip global
const tooltipData = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const filterOptions = [
    { value: '', label: 'TOUS', icon: '/images/player/player-inventory-all.svg' },
    { value: 'weapon', label: 'ARMES', icon: '/images/player/player-inventory-weapons.svg' },
    { value: 'food', label: 'NOURRITURES', icon: '/images/player/player-inventory-food.svg' },
    { value: 'medical', label: 'MÉDICAL', icon: '/images/player/player-inventory-medical.svg' },
    { value: 'drug', label: 'DROGUES', icon: '/images/player/player-inventory-drug.svg' },
    { value: 'crafting', label: 'ARTISANAT', icon: '/images/player/player-inventory-crafting.svg' },
    { value: 'animal', label: 'ANIMAUX', icon: '/images/player/player-inventory-animals.svg' },
    { value: 'tool', label: 'OUTILS', icon: '/images/player/player-inventory-tools.svg' },
    { value: 'clothe', label: 'VÊTEMENTS' },
    { value: 'document', label: 'DOCUMENTS' },
    { value: 'quest', label: 'QUEST' }
];

// Afficher le tooltip
const showTooltip = (data) => {
    tooltipData.value = data

    // Ajuster la position pour éviter que le tooltip sorte de l'écran
    const padding = 1; // en vw
    const tooltipWidth = 14; // largeur en vw
    const tooltipHeight = 10; // hauteur estimée en vh

    // Convertir les coordonnées en pourcentages de la fenêtre
    let x = (data.position.x / window.innerWidth) * 100; // convertir en pourcentage de la largeur
    let y = (data.position.y / window.innerHeight) * 100; // convertir en pourcentage de la hauteur

    // Ajouter le padding (en pourcentage)
    x = x + padding;

    // Vérifier si le tooltip dépasse à droite
    if (x + tooltipWidth > 100) {
        x = (data.position.x / window.innerWidth) * 100 - tooltipWidth - padding;
    }

    // Vérifier si le tooltip dépasse en bas
    if (y + tooltipHeight > 100) {
        y = 100 - tooltipHeight - padding;
    }

    // Vérifier si le tooltip dépasse en haut
    if (y < 0) {
        y = padding;
    }

    tooltipPosition.value = { x, y };
}

// Masquer le tooltip
const hideTooltip = () => {
    tooltipData.value = null
}

const handleKeyDown = (event) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const ctrlKeys = ['a', 'c', 'v', 'x'];

    if (event.key === 'Enter') {
        event.preventDefault();
        deposit();
    }

    if (
        allowedKeys.includes(event.key) ||
        (event.ctrlKey && ctrlKeys.includes(event.key.toLowerCase()))
    ) {
        return; // Permettre touches de contrôle et navigation
    }

    // Autoriser seulement chiffres
    if (!/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        return;
    }

    const selection = window.getSelection();
    const cursorPosition = selection.anchorOffset;
    const currentText = event.target.innerText;
    const beforeCursor = currentText.slice(0, cursorPosition);
    const afterCursor = currentText.slice(cursorPosition);
    const nextText = beforeCursor + event.key + afterCursor;

    if (/^0\d+/.test(nextText) || nextText.length > 6) {
        event.preventDefault();
    }
};

const updateAmount = () => {
    console.log('updateAmount', editableSpan.value.innerText)
    const content = editableSpan.value.innerText.trim();
    showPlaceholder.value = content === '';
    if (content !== 0) {
        console.log('content', content)
        dollarForm.value = content;
        console.log('dollarForm', dollarForm.value)
    }
    playerMessage.value = '';
    bankMessage.value = '';
}

const deposit = () => {
    playerMessage.value = '';
    bankMessage.value = '';
    console.log('deposit', dollarForm.value)
    if (dollarForm.value > 0) {
        console.log('playerStore.wallet', playerStore.wallet)
        // vérifier si le joueur a assez d'argent sur lui
        if (playerStore.wallet < dollarForm.value * 100) {
            console.log('Vous n\'avez pas assez d\'argent sur vous');
            playerMessage.value = 'Sacré tonnerre ! Je n\'ai pas assez de dollars sur moi, partenaire...';
            return;
        }
        sendNui('bank-deposit-' + bankStore.id, { id: bankStore.id, amount: dollarForm.value * 100 })
        dollarForm.value = '';
        editableSpan.value.innerText = '';
        showPlaceholder.value = true;
    }
};

const withdraw = () => {
    playerMessage.value = '';
    bankMessage.value = '';
    console.log('withdraw', dollarForm.value)
    if (dollarForm.value > 0) {
        console.log('bankStore.getBalance', bankStore.getBalance)
        // vérifier si le joueur a assez d'argent en banque
        if (bankStore.getBalanceDollars < dollarForm.value) {
            console.log('Vous n\'avez pas assez d\'argent en banque');
            bankMessage.value = 'Par le ciel ! Votre compte est plus sec que le désert, cow-boy !';
            return;
        }
        sendNui('bank-withdraw-' + bankStore.id, { id: bankStore.id, amount: dollarForm.value * 100 })
        dollarForm.value = '';
        editableSpan.value.innerText = '';
        showPlaceholder.value = true;
    }
};

const close = () => {
    uiStore.isClosing = true;
    setTimeout(() => {
        sendNui('bank-close-' + bankStore.id)
        uiStore.closeMenu()
        uiStore.isClosing = false;
    }, 600); // Attendre la fin de l'animation
};

const createBank = () => {
    if (bankStore.getBankAccountIsCreated) {
        console.log('Vous avez déjà un compte bancaire')
        bankMessage.value = 'Hé là, partenaire ! Vous avez déjà un coffre-fort dans notre banque !';
        return;
    }

    if (playerStore.getWallet < 10) {
        console.log('Vous n\'avez pas assez d\'argent sur vous')
        bankMessage.value = 'Par le ciel ! Vous n\'avez pas assez de pièces d\'or pour ouvrir un coffre-fort !';
        return;
    }
    bankStore.exist = true;
    console.log('bank-createAccount', bankStore.id)
    sendNui('bank-createAccount-' + bankStore.id, { id: bankStore.id })
}

//bank-stock-add-{ID}
//bank-stock-remove-{ID}

const stockAdd = (bankId, item, quantity) => {
    console.log('bank-stock-add-' + bankId, item)
    sendNui('bank-stock-add-' + bankId, { id: item.id, complexId: item.complexId, idItem: item.id, quantity: quantity })
}

const stockRemove = (bankId, item, quantity) => {
    console.log('bank-stock-remove-' + bankId, item)
    sendNui('bank-stock-remove-' + bankId, { id: item.id, complexId: item.complexId, idItem: item.id, quantity: quantity })
}

const switchBank = (bank) => {
    // switch the bank view 
    isSwitching.value = true;
    setTimeout(() => {
        bankView.value = bank;
        isSwitching.value = false;
    }, 100);
}

// Fonction de filtrage
const filter = (value) => {
    selectedFilter.value = value;
    // Ajoutez ici la logique de filtrage si nécessaire

    console.log('playerStore.inventory', playerStore.inventory)
};

const sortByWeight = (order) => {
    playerStore.inventory.sort((a, b) => {
        const weightA = a.details.weight * a.quantity;
        const weightB = b.details.weight * b.quantity;
        return order === 'asc' ? weightA - weightB : weightB - weightA;
    });
};

const sortByQuantity = (order) => {
    playerStore.inventory.sort((a, b) => {
        return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    });
};

setTimeout(() => {
    bankStore.isLoading = false;
}, 2000);

</script>

<template>

    <div class="bank">
        <div class="bank-container" :class="{ '__closing': uiStore.isClosing || isSwitching }">
            <div class="bank-loading" v-if="bankStore.isLoading">
                <div class="loading">
                <span class="one">.</span>
                <span class="two">.</span>
                <span class="three">.</span>
            </div>
            <button class="close" @click="close">X</button>
        </div>
            <div class="bank-open" v-else-if="!bankStore.getBankAccountIsCreated">
            <!-- Voulez vous ouvrir une banque ? -->
            <div class="bank-title"> Voulez vous ouvrir un coffre-fort pour <span>10$</span> ? </div>

            <div class="form">
                <button class="btn-western bank-price" @click="createBank">Ouvrir un coffre-fort</button>
            </div>
            <button class="close" @click="close">X</button>
        </div>
            <div class="container" v-else>
                <div class="bank-account" v-if="bankView === 'account'">
            <div class="balance-title"> {{ playerStore.name }} </div>

            <div class="balance">{{ bankStore.getBalanceDollars }}</div>

            <div class="balance-amount"> Indiquez le montant à déposer ou retirer </div>


            <div class="bank-message bubble-conversation player" :class="{ active: playerMessage }">
                <div class="bank-person">Moi</div><span> {{ playerMessage }} </span>
            </div>

            <div class="bank-message bubble-conversation banker" :class="{ active: bankMessage }">
                <div class="bank-person">Banquier</div><span> {{ bankMessage }} </span>
            </div>

            <div class="form">
                <div class="fake-input">
                            <span contenteditable="true" @keydown="handleKeyDown" @input="updateAmount"
                                @blur="updateAmount" ref="editableSpan"
                                :class="{ error: playerMessage || bankMessage }"></span>
                    <div v-if="showPlaceholder" class="placeholder">0</div>
                </div>
            </div>

            <div class="actions">
                <button class="btn-western deposit" @click="deposit">Déposer</button>
                <button class="btn-western withdraw" @click="withdraw">Retirer</button>
            </div>

            <button class="close" @click="close">X</button>
                </div>
                <div class="bank-vault" v-else-if="bankView === 'vault'">
                    <div class="vault">
                        <div class="emplacements">
                            <ul>
                                <li v-for="index in 3" :key="index" :class="{ 'empty': !bankStore.stock[index - 1] }"
                                    @click="stockRemove(bankStore.id, bankStore.stock[index - 1], 1)">
                                    <img v-if="bankStore.stock && bankStore.stock[index - 1]"
                                        :src="'/images/items/' + bankStore.stock[index - 1].id + '.png'" alt="">
                                </li>
                            </ul>
                        </div>
                        <div class="information">
                            Seulement 3 objets sont stockables dans le coffre-fort.
                        </div>
                    </div>
                    <div class="bag">
                        <div class="filter">
                            <div class="select-container">
                                <Multiselect v-model="selectedFilter" :options="filterOptions" :searchable="false"
                                    :close-on-select="true" :preserve-search="false"
                                    placeholder="Catégorie" track-by="value" label="label"
                                    @change="filter">
                                    <template #option="{ option }">
                                        <div class="option-content">
                                            <img v-if="option.icon" :src="option.icon" :alt="option.label"
                                                class="option-icon">
                                            <span>{{ option.label }}</span>
                                        </div>
                                    </template>
                                </Multiselect>
                            </div>
                        </div>
                        <div class="filter1">
                            <div class="filter-container">
                                <div class="filter-group">
                                    <div class="filter-label">Poids</div>
                                    <div class="filter-buttons">
                                        <button class="filter-button" @click="sortByWeight('asc')">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path d="M7 14l5-5 5 5z" />
                                            </svg>
                                        </button>
                                        <button class="filter-button" @click="sortByWeight('desc')">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path d="M7 10l5 5 5-5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="filter-group">
                                    <div class="filter-label">Quantité</div>
                                    <div class="filter-buttons">
                                        <button class="filter-button" @click="sortByQuantity('asc')">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path d="M7 14l5-5 5 5z" />
                                            </svg>
                                        </button>
                                        <button class="filter-button" @click="sortByQuantity('desc')">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path d="M7 10l5 5 5-5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="filter-container">
                                <input type="text" placeholder="Rechercher" class="search-input">
                            </div>
                        </div>
                        <div class="inventory">
                            <PerfectScrollbar>
                                <ul>
                                    <li v-for="(inventoryItem, index) in playerStore.inventory" :key="index" 
                                        vif="inventoryItem && (selectedFilter === '' || (items.find(item => item.id === inventoryItem.id) && items.find(item => item.id === inventoryItem.id).filter === selectedFilter))"
                                        @click="stockAdd(bankStore.id, inventoryItem, 1)">
                                        [[{{ inventoryItem }}]] {{ items.find(item => item.id === inventoryItem.id).filter === selectedFilter}}
                                        <Item :item="inventoryItem" @showTooltip="showTooltip" @hideTooltip="hideTooltip" />
                                    </li>
                                </ul>
                            </PerfectScrollbar>
                        </div>
        </div>

            </div>
            </div>
        </div>
    </div>

    <div class="bank-conversation" v-if="bankStore.isLoading || !bankStore.getBankAccountIsCreated">
        <div class="bubble">
            Bien l'bonjour, m'sieur le banquier !
        </div>
    </div>
    <div class="bank-conversation" v-else-if="uiStore.isClosing">

        </div>
        <div class="bank-conversation" v-else>
        <div class="bubble" @click="switchBank('account')" v-if="bankView === 'vault'">
            Hé là, m'sieur le banquier ! J'viens voir mes économies !
            </div>
        <div class="bubble" @click="switchBank('vault')" v-if="bankView === 'account'">
            J'aimerais jeter un œil à mon coffre, si vous l'permettez.
        </div>
        <div class="bubble" @click="close">
            Au revoir, m'sieur le banquier !
        </div>
    </div>

    <!-- Tooltip global -->
    <div class="global-tooltip" v-if="tooltipData"
        :style="{ left: tooltipPosition.x + 'vw', top: tooltipPosition.y + 'vh' }">
        <div class="bottom">
            <div class="tooltip-title">{{ tooltipData.itemDetails.name }}</div>
            <div class="tooltip-description">{{ tooltipData.itemDetails.description }}</div>
            <div class="tooltip-bonus" v-if="tooltipData.itemDetails.bonus && tooltipData.itemDetails.bonus.length > 0">
                <div class="bonus-value" v-for="bonus in tooltipData.itemDetails.bonus" :key="bonus.name">
                    <div>{{ bonus.name }} : <span>{{ bonus.value }}</span></div>
                    <div class="bonus-duration" v-if="bonus.duration"><span>{{ bonus.duration }} </span> s</div>
                </div>
            </div>
            <div class="tooltip-malus" v-if="tooltipData.itemDetails.malus && tooltipData.itemDetails.malus.length > 0">
                <div class="malus-value" v-for="malus in tooltipData.itemDetails.malus" :key="malus.name">
                    <div>{{ malus.name }} : <span>{{ malus.value }}</span></div>
                    <div class="malus-duration" v-if="malus.duration"><span>{{ malus.duration }} </span> s</div>
                </div>
            </div>
            <div class="tooltip-stats" v-if="tooltipData.item.quality">
                <div class="stat">
                    <div class="stat-label">Qualité</div>
                    <div class="stat-value"><span>{{ tooltipData.item.quality }} </span> %</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Poids</div>
                    <div class="stat-value"><span>{{ tooltipData.itemDetails.weight / 1000 }} </span> kg</div>
                </div>
                <div class="stat">
                    <div class="stat-label"></div>
                    <div class="stat-value">Total <span>{{ tooltipData.itemDetails.weight / 1000 *
                        tooltipData.item.quantity
                            }} </span> kg</div>
                </div>
            </div>
            <div class="tooltip-tags" v-if="tooltipData.item.tags && tooltipData.item.tags.length > 0">
                <div class="tag" v-for="tagId in tooltipData.item.tags" :key="tagId">
                    {{ tags[tagId]?.name }}
                </div>
            </div>
        </div>
    </div>
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
    /* IE and Edge */
    scrollbar-width: none !important;
    /* Firefox */

    &::-webkit-scrollbar {
        display: none !important;
        /* Chrome, Safari and Opera */
    }
}

:deep(.ps__rail-x),
:deep(.ps__rail-y) {
    display: none !important;
}

.bank {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

.bank-container {
    animation: openVault $animation-timing forwards;
    position: absolute;
    height: 100%;
    width: 100%;

    &.__closing {
        animation: closeVault $animation-timing forwards !important;
    }
}

.loading {
    position: absolute;
    padding: 1.5vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    span {
        font-size: 4vw;
    font-weight: bold;
        color: $color-gold;

        &.one {
    animation: blink 1.5s infinite;
    animation-delay: 0.5s;
}

        &.two {
    animation: blink 1.5s infinite;
    animation-delay: 1s;
}

        &.three {
    animation: blink 1.5s infinite;
    animation-delay: 1.5s;
        }
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

.bank-loading {
    position: absolute;
    top: calc(50% - 10.5vw);
    left: calc(50% - 14.25vw);
    width: 25vw;
    height: 18vw;
    padding: 1.5vw;
    border-radius: 0.25vw;
    background-image: url('/images/bank/bank-account-empty.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.bank-open {
    color: $color-text-dark;
    font-family: $font-family-primary;
    position: absolute;
    top: calc(50% - 10.5vw);
    left: calc(50% - 14.25vw);
    width: 25vw;
    height: 18vw;
    padding: 1.5vw;
    border-radius: 0.25vw;
    background-image: url('/images/bank/bank-account-empty.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.bank-account {
    position: absolute;
    top: calc(50% - 10.5vw);
    left: calc(50% - 14.25vw);
    width: 25vw;
    height: 18vw;
    padding: 1.5vw;
    border-radius: 0.25vw;
    color: $color-gold;
    font-family: $font-family-primary;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url(/images/bank/bank-account.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.bank-title {
    position: absolute;
    top: 9.65vw;
    right: 2.5vw;
    left: 2.5vw;
    text-align: center;
    font-size: 2vw;
    font-weight: bold;

    span {
        color: $color-gold-light;
    }
}

.bank-price {
    position: absolute;
    top: 13.25vw;
    font-size: 2vw;

    &:hover {
        color: $color-gold-light;
    }

    &:active {
        color: $color-gold-light;
        background: $color-gold-light;
    }
}

h2 {
    text-align: center;
    font-size: 1.8vw;
    color: #3d2b00f2;
    margin-bottom: 0.75vw;
    border-bottom: 0.1vw dashed $color-gold-light;
    padding-bottom: 0.25vw;
}

.balance-title {
    position: absolute;
    top: 9.65vw;
    right: 13vw;
    font-size: 2vw;
}

.bank-message {
    position: absolute;
    font-size: 1vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.5s ease;
    opacity: 0;

    &.bubble-conversation {

        &.banker,
        &.player {
            &.active {
    opacity: 1 !important;
            }
        }

        &.player {
            right: 30.25vw;
            width: 18.55vw;
            height: 12.15vw;
            top: 4.05vw;
    background-image: url('/images/bubble-think.png');

            span {
                font-size: 0.9vw;
                padding: 2.85vw 4.5vw 0 3.75vw;
    display: inline-block;
    text-align: center;
}

            .bank-person {
    position: absolute;
                top: -0.75vw;
                left: calc(50% - 1vw);
    transform: translateX(-50%);
    width: calc(initial - 50%);
    background-color: rgb(77, 27, 27);
    color: #ffffff;
                font-size: 1vw;
    text-align: center;
                padding: 0.25vw 0.5vw;
                border-radius: 0.25vw;
            }
        }

        &.banker {
            left: 28.75vw;
            width: 17.55vw;
            height: 11.15vw;
            top: -2.15vw;
    background-image: url('/images/bubble-message.png');

            span {
                font-size: 1vw;
                padding: 2.5vw 4.15vw 0 2.15vw;
    display: inline-block;
    text-align: center;
}

            .bank-person {
    position: absolute;
                top: -0.5vw;
                left: calc(50% - 1vw);
    transform: translateX(-50%);
    width: calc(initial - 50%);
    background-color: rgb(77, 27, 27);
    color: #ffffff;
                font-size: 1vw;
    text-align: center;
                padding: 0.25vw 0.5vw;
                border-radius: 0.25vw;
            }
        }
    }
}

.bank-conversation {
    position: absolute;
    bottom: 1.5vw;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .bubble {
        background-color: #00000096;
        color: #ffffff;
        font-family: $font-family-primary;
        font-size: 1vw;
        text-align: center;
        padding: 1vw;
        border-radius: 2.5vw;
        cursor: pointer;
        font-style: italic;
        margin-top: 0.5vw;
    }
}

.balance {
    position: absolute;
    top: 9.6vw;
    right: 5.3vw;
    font-size: 2vw;
    font-weight: bold;
    color: $color-gold;
}

.balance-amount {
    position: absolute;
    top: 12.75vw;
    left: 1.25vw;
    width: 13.75vw;
    height: 1.75vw;
    font-size: 1.2vw;
    text-align: end;
    color: black;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fake-input {
    font-weight: bold;
    font-size: 2vw;
    position: absolute;
    top: 12.75vw;
    right: 5.05vw;
    width: 6vw;
    height: 1.75vw;
    font-family: $font-family-primary;
    color: #2c4873;
    text-align: right;
    border-radius: 0.25vw;
    padding: 0.25vw;
    outline: none;
    cursor: pointer;

    span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    outline: none;
    z-index: 1;
    position: relative;

        &.error {
    color: rgb(150, 17, 17);
}

        &:after {
    content: '';
            box-shadow: 0 0.05vw 1.75vw 0.3vw #000000;
    width: 100%;
            height: 0;
    display: none;
        }
}

    .placeholder {
    color: #666666a3;
    position: absolute;
        top: 0.3vw;
        right: 0.25vw;
    }
}

.actions {
    display: flex;
    gap: 0.5vw;
    width: 90%;
    position: absolute;
    top: 16.75vw;
    right: 5%;
}

.close {
    background: $color-red;
    color: $color-text-light;
    font-weight: bold;
    padding: 0.5vw;
    font-family: $font-family-primary;
    cursor: pointer;
    position: absolute;
    top: -1vw;
    right: -1vw;
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

.btn-western {
    flex: 1;
    padding: 0.6vw 0.9vw;
    font-family: $font-family-primary;
    font-size: 1vw;
    font-weight: bold;
    color: #fff6dc;
    background: linear-gradient(145deg, #4d3521, #2b1c12);
    border: 0.15vw solid #c9a96e;
    border-radius: 0.5vw;
    box-shadow:
        inset 0 0.05vw 0 #f3e3b0,
        0 0.2vw 0.4vw rgba(0, 0, 0, 0.6);
    text-shadow: 0 0.05vw 0 #000;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    position: relative;
    letter-spacing: 0.025vw;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4vw;

    &:hover {
    background: linear-gradient(145deg, #5f422c, #3a2617);
    border-color: #e2c87d;
    color: #ffefbb;
    box-shadow:
            inset 0 0.05vw 0 #fff5d2,
            0 0.2vw 0.6vw rgba(0, 0, 0, 0.8),
            0 0 0.3vw #e6c47c;
    }

    &:active {
        transform: translateY(0.1vw);
    box-shadow:
            inset 0 0.1vw 0.2vw #1e1208,
            0 0.05vw 0.1vw rgba(0, 0, 0, 0.5);
    }
}

.deposit {
    background: linear-gradient(145deg, #3d301f, #261b10);
    border-color: #a9915d;
}

.withdraw {
    background: linear-gradient(145deg, #6d2f1a, #3b170d);
    border-color: #c0745c;

    &:hover {
    background: linear-gradient(145deg, #8a3b23, #4d1f12);
    border-color: #ffb29e;
    box-shadow:
            inset 0 0.05vw 0 #ffd9ca,
            0 0.2vw 0.6vw rgba(0, 0, 0, 0.8),
            0 0 0.3vw #ffb29e;
    }
}

.vault {
    position: absolute;
    position: absolute;
    top: calc(50% - 23vw);
    right: 4vw;
    width: 21vw;
    height: 33vw;
    background-image: url(/images/bank/bank-vault.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .emplacements {
        position: absolute;
        bottom: 6vw;

        ul {
            height: 100%;
            list-style: none;
            margin: 0 2vw;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1vw;

            li {
                background-color: rgba(0, 0, 0, 0.24);
                box-shadow: inset 0 0 0.5vw 0.1vw rgba(0, 0, 0, 0.59);
                border: 0.05vw solid rgba(255, 215, 0, 0.2);
                border-radius: 0.25vw;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                aspect-ratio: 1;

                &:not(.empty) {
                    cursor: pointer;

                    &:hover {
                        box-shadow: 0 0 0.5vw 0.1vw rgba(255, 215, 0, 0.3);
                        border-color: rgba(255, 215, 0, 0.4);
                    }
                }

                img {
                    width: 80%;
                    height: 80%;
                    object-fit: contain;
                }
            }
        }
    }

    .information {
        position: absolute;
        bottom: 3vw;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0.9vw;
        color: #d9bb74;
        text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);
    }
}

.bag {
    position: absolute;
    top: calc(50% - 23vw);
    left: 4vw;
    width: 26vw;
    height: 34vw;
    background-image: url(/images/player/player-inventory.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .filter {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 5vw;
        left: 1vw;
        right: 1vw;
    }

    .select-container {
        position: relative;
        width: auto;
        min-width: 12vw;
        max-width: 15vw;
    }

    .filter-container {
        background-color: #291b12;
        border: 3px solid #4b2d17;
        border-radius: 500px;
        display: flex;
        gap: 0.5vw;
        box-shadow: inset 0 0px 2px 2px rgb(0 0 0 / 30%), 0 0px 2px 2px rgb(0 0 0 / 30%);
    }

    .filter-button {
        background-color: transparent;
        border: none;
        border-radius: 50%;
        width: 2vw;
        height: 2vw;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        svg {
            color: #d9bb74;
        }

        &:hover {
            background-color: rgba(168, 133, 77, 0.2);

            .tooltip {
                opacity: 1;
            }
        }

        &.active {
            background-color: rgba(168, 133, 77, 0.4);
            box-shadow: 0 0 0.4vw rgba(255, 215, 0, 0.5);
        }

        .tooltip {
            position: absolute;
            bottom: -2.2vw;
            left: 50%;
            transform: translateX(-50%) translateY(-0.5vw);
            min-width: 5vw;
            background-color: rgba(30, 20, 10, 0.9);
            color: #d9bb74;
            font-size: 0.7vw;
            padding: 0.3vw 0.6vw;
            border-radius: 0.2vw;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            font-family: $font-family-primary;
            text-align: center;
            white-space: nowrap;
            z-index: 1000;
            border: 0.05vw solid rgba(255, 215, 0, 0.3);
            box-shadow: 0 0 0.4vw rgba(0, 0, 0, 0.5);
            text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);

            &:before {
                content: '';
                position: absolute;
                top: -0.4vw;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0.2vw;
                border-style: solid;
                border-color: transparent transparent rgba(30, 20, 10, 0.9) transparent;
            }
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0.8;
            transition: all 0.3s ease;

            &:hover {
                opacity: 1;
            }
        }
    }

    .filter-button:hover {
        background-color: transparent;
    }

    .filter-button i {
        color: #f3e2c7;
        font-size: 16px;
    }

    .inventory {
        position: absolute;
        top: 8vw;
        left: 1vw;
        right: 1vw;
        bottom: 1vw;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;

        /* Masque haut/bas */
        mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);

        .ps {
            max-height: 100%;
        }

        ul {
            max-height: 100%;
            list-style: none;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.8vw;
            padding: 1.5vw 1vw 2vw;

            li {
                width: 100%;
                height: 100%;
                background-image: url(/images/player/player-inventory-bg_item.png);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                box-shadow: inset 0 -0.05vw 0.2vw 0.05vw rgba(0, 0, 0, 0.59);
                border-radius: 0.25vw;
                aspect-ratio: 1;
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
                cursor: pointer;

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 0.4vw 0.1vw rgba(255, 215, 0, 0.3);
                }

                &:active {
                    transform: scale(0.95);
                }
            }
        }
    }
}

.global-tooltip {
    position: absolute;
    z-index: 100000;

    &:before {
        display: none;
        content: '';
        position: absolute;
        left: -0.5vw;
        top: 30%;
        border-width: 0.5vw 0.5vw 0.5vw 0;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.85) transparent transparent;
    }

    .bottom {
        width: 14vw;
        background-color: rgba(0, 0, 0, 0.85);
        border: 0.05vw solid rgba(255, 215, 0, 0.4);
        color: #f5e6c9;
        padding: 1vw;
        border-radius: 0.25vw;
        z-index: 100000;
        box-shadow: 0 0 0.5vw rgba(0, 0, 0, 0.5);
        font-family: "Special Elite", serif;
        pointer-events: none;
        position: relative;
        background-image: url(/images/player/player-inventory-bg_item.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        .tooltip-title {
            font-size: 1.2vw;
            font-weight: bold;
            color: #d9bb74;
            margin-bottom: 0.5vw;
            text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);
            border-bottom: 0.05vw solid rgba(255, 215, 0, 0.2);
            padding-bottom: 0.3vw;
        }

        .tooltip-description {
            font-size: 1vw;
            margin-bottom: 1vw;
            line-height: 1.4;
            font-weight: 100;
            color: #f5e6c9;
        }

        .tooltip-bonus {
            margin-bottom: 0.5vw;

            .bonus-value {
                font-size: 0.7vw;
                color: #a8854d;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    color: #00ff00;
                }
            }

            .bonus-duration {
                font-size: 0.7vw;
                color: #fff;
            }
        }

        .tooltip-malus {
            margin-bottom: 0.5vw;

            .malus-value {
                font-size: 0.7vw;
                color: #a8854d;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    color: #ff0000;
                }
            }

            .malus-duration {
                font-size: 0.7vw;
                color: #fff;
            }
        }

        .tooltip-stats {
            margin-bottom: 0.5vw;

            .stat {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.2vw;

                .stat-label {
                    font-size: 0.7vw;
                    color: #a8854d;
                }

                .stat-value {
                    font-size: 0.7vw;
                    color: #bb9a66;

                    span {
                        color: white;
                    }
                }
            }
        }

        .tooltip-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3vw;

            .tag {
                font-size: 1vw;
                background-color: $color-red;
                color: #ffffff;
                padding: 0.35vw 0.4vw 0.1vw 0.4vw;
                border-radius: 0.15vw;
            }
        }
    }
}

.select-container {
    position: relative;
    width: 100%;

    .custom-select {
        width: 100%;
        padding: 0.5vw 2vw 0.5vw 1vw;
        font-family: $font-family-primary;
        font-size: 1vw;
        color: #d9bb74;
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d9bb74'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.5vw center;
        background-size: 1.5vw;
        box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);

        &:hover {
            border-color: #6d3d27;
            background-color: #3a2318;
        }

        &:focus {
            outline: none;
            border-color: #d9bb74;
            box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
        }

        option {
            background-color: #291b12;
            color: #d9bb74;
            padding: 0.5vw;

            &:hover {
                background-color: #3a2318;
            }
        }
    }
}

// Styles personnalisés pour Multiselect
:deep(.multiselect) {
    width: 100%;
    background-color: #291b12;
    border: 0.15vw solid #4b2d17;
    border-radius: 0.5vw;
    min-height: 2.5vw;
    font-family: $font-family-primary;
    font-size: 1vw;
    color: #d9bb74;
    box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
        border-color: #6d3d27;
        background-color: #3a2318;
    }

    &.is-active {
        border-color: #d9bb74;
        box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
    }

    .multiselect-dropdown {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        box-shadow: 0 0.2vw 0.5vw rgba(0, 0, 0, 0.5);
        margin-top: 0.2vw;

        // Style de la barre de défilement
        &::-webkit-scrollbar {
            width: 0.4vw;
            background-color: #291b12;
        }

        &::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4b2d17, #6d3d27);
            border-radius: 0.2vw;
            border: 0.05vw solid #291b12;
            box-shadow: inset 0 0 0.2vw rgba(0, 0, 0, 0.5);
        }

        &::-webkit-scrollbar-track {
            background-color: #291b12;
            border-radius: 0.2vw;
            box-shadow: inset 0 0 0.2vw rgba(0, 0, 0, 0.3);
        }

        // Pour Firefox
        scrollbar-width: thin;
        scrollbar-color: #4b2d17 #291b12;
    }

    .multiselect-option {
        padding: 0.5vw 1vw;
        color: #d9bb74;
        font-family: $font-family-primary;
        font-size: 1vw;
        transition: all 0.2s ease;

        &:hover {
            background-color: #3a2318;
        }

        &.is-selected {
            background-color: rgba(168, 133, 77, 0.4);
            color: #fff6dc;
        }

        .option-content {
            display: flex;
            align-items: center;
            gap: 0.5vw;

            .option-icon {
                width: 1.2vw;
                height: 1.2vw;
                object-fit: contain;
            }
        }
    }

    .multiselect-search {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        color: #d9bb74;
        font-family: $font-family-primary;
        font-size: 1vw;
        padding: 0.5vw;
        margin: 0.5vw;
        width: calc(100% - 1vw);
        border-radius: 0.25vw;

        &:focus {
            outline: none;
            border-color: #d9bb74;
            box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
        }
    }

    .multiselect-single-label {
        display: flex;
        align-items: center;
        gap: 0.5vw;
        padding: 0.5vw;

        img {
            width: 1.2vw;
            height: 1.2vw;
            object-fit: contain;
        }
    }

    .multiselect-caret {
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d9bb74'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 1.5vw;
        width: 1.5vw;
        height: 1.5vw;
        margin-right: 0.5vw;
    }
}

.filter1 {
    position: absolute;
    top: 8vw;
    left: 1vw;
    right: 1vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;

    .filter-container {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        padding: 0.5vw;
        display: flex;
        gap: 1vw;
        box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);

        .filter-group {
            display: flex;
            align-items: center;
            gap: 0.5vw;

            .filter-label {
                color: #d9bb74;
                font-family: $font-family-primary;
                font-size: 0.9vw;
            }

            .filter-buttons {
                display: flex;
                gap: 0.2vw;

                .filter-button {
                    background: none;
                    border: none;
                    padding: 0.2vw;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;

                    svg {
                        width: 1vw;
                        height: 1vw;
                        color: #d9bb74;
                    }

                    &:hover {
                        svg {
                            color: #fff6dc;
                        }
                    }
                }
            }
        }

        .search-input {
            background: none;
            border: none;
            color: #d9bb74;
            font-family: $font-family-primary;
            font-size: 0.9vw;
            width: 8vw;
            padding: 0.2vw 0.5vw;

            &::placeholder {
                color: #a8854d;
            }

            &:focus {
                outline: none;
            }
        }
    }
}
</style>