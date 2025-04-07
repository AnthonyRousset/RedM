<script setup>
import { ref } from 'vue';
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBankStore } from '../stores/bankStore'
import '@vueform/multiselect/themes/default.css'
import Inventory from './components/inventory.vue'

const playerStore = usePlayerStore()
const bankStore = useBankStore()
const uiStore = useUiStore()

const dollarForm = ref();
const showPlaceholder = ref(true);
const editableSpan = ref(null);
const playerMessage = ref('');
const bankMessage = ref('');
const bankView = ref('account');
const isSwitching = ref(false);

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

const stockRemove = (bankId, item, quantity) => {
    console.log('bank-stock-remove-' + bankId, item)
    sendNui('bank-stock-remove-' + bankId, { idBank: bankId, complexId: item.complexId, idItem: item.id, quantity: quantity })
}

const switchBank = (bank) => {
    // switch the bank view 
    isSwitching.value = true;
    setTimeout(() => {
        bankView.value = bank;
        isSwitching.value = false;
    }, 100);
}


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
                                    >
                                    <img v-if="bankStore.stock && bankStore.stock[index - 1]"
                                        @click="stockRemove(bankStore.id, bankStore.stock[index - 1], 1)"
                                        :src="'/images/items/' + bankStore.stock[index - 1].id + '.png'" alt="">
                                </li>
                            </ul>
                        </div>
                        <div class="information">
                            Seulement 3 objets sont stockables dans le coffre-fort.
                        </div>
                    </div>
                    <Inventory :type="'bank'" :idEntity="bankStore.id" :inventory="playerStore.inventory" />
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
            width: 17vw;

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
        bottom: 1.5vw;
        left: 0;
        padding: 0 3.5vw;
        width: 14vw;
        text-align: center;
        font-size: 0.9vw;
        color: #d9bb74;
        text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);
    }
}

</style>