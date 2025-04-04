<script setup>
import { ref } from 'vue';
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBankStore } from '../stores/bankStore'

const playerStore = usePlayerStore()
const bankStore = useBankStore()
const uiStore = useUiStore()

const dollarForm = ref();
const showPlaceholder = ref(true);
const editableSpan = ref(null);
const playerMessage = ref('');
const bankMessage = ref('');
const switchBank = ref('account');

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
        if (bankStore.getBalance < dollarForm.value * 100) {
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


const switcijklhBank = (bank) => {
    switchBank.value = bank;
}

setTimeout(() => {
    bankStore.isLoading = false;
}, 2000);

</script>

<template>


        <div class="bank" :class="{ '__closing': uiStore.isClosing }">
            <div class="waiting-screen" v-if="bankStore.isLoading">
                <div class="waiting-screen-title">
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
            <div class="bank-container" v-else>
                <div class="bank-account" v-if="switchBank === 'account'">
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
                            <span contenteditable="true" @keydown="handleKeyDown" @input="updateAmount" @blur="updateAmount"
                                ref="editableSpan" :class="{ error: playerMessage || bankMessage }"></span>
                            <div v-if="showPlaceholder" class="placeholder">0</div>
                        </div>
                    </div>

                    <div class="actions">
                        <button class="btn-western deposit" @click="deposit">Déposer</button>
                        <button class="btn-western withdraw" @click="withdraw">Retirer</button>
                    </div>

                    <button class="close" @click="close">X</button>
                </div>
                <div class="bank-vault" v-else-if="switchBank === 'vault'">
                    <div class="bank-vault-title">
                        <div class="bank-vault-title-item">
                            <div class="bank-vault-title-item-name">Nom</div>
                            <div class="bank-vault-title-item-quantity">Quantité</div>
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
        <div class="bubble">
            Au revoir, m'sieur le banquier !
        </div>
        <div class="bank-person">Moi</div><span> Au revoir, m'sieur le banquier ! </span>
    </div>

    <div class="bank-conversation" v-else>
        <div class="bubble" @click="switcijklhBank('account')">
            Hé là, m'sieur le banquier ! J'viens voir mes économies !
        </div>
        <div class="bubble" @click="switcijklhBank('vault')">
            J'aimerais jeter un œil à mon coffre, si vous l'permettez.
        </div>
    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

.bank {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.waiting-screen {
    position: absolute;
    top: calc(50% - 250px);
    left: 50%;
    width: 500px;
    height: 360px;
    padding: 30px;
    border-radius: 5px;
    background-image: url('/images/bank-empty.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* Animation */
    animation: openVault 0.6s ease-out forwards;
    opacity: 0;
}

.waiting-screen-title {
    position: absolute;
    padding: 30px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.waiting-screen-title span {
    font-size: 4rem;
    font-weight: bold;
    color: #805f07;
}

.waiting-screen-title span.one {
    animation: blink 1.5s infinite;
    animation-delay: 0.5s;
}

.waiting-screen-title span.two {
    animation: blink 1.5s infinite;
    animation-delay: 1s;
}

.waiting-screen-title span.three {
    animation: blink 1.5s infinite;
    animation-delay: 1.5s;
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


.bank-account {
    position: absolute;
    top: calc(50% - 250px);
    left: calc(50%);
    width: 500px;
    height: 360px;
    padding: 30px;
    border-radius: 5px;
    color: #805f07;
    font-family: 'Special Elite', serif;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url(/images/bank.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    animation: openVault 0.6s ease-out forwards;
    opacity: 0;
}



.bank-open {

    color: #442c1a;
    font-family: 'Special Elite', serif;
    position: absolute;
    top: calc(50% - 250px);
    left: 50%;
    width: 500px;
    height: 360px;
    padding: 30px;
    border-radius: 5px;
    background-image: url('/images/bank-empty.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* Animation */
    animation: openVault 0.6s ease-out forwards;
    opacity: 0;
    
}

.bank-title {
    position: absolute;
    top: 193px;
    right: 50px;
    left: 50px;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
}

.bank-title span {
    color: #a8854d;
}

.bank-price {
    position: absolute;
    top: 265px;
    font-size: 2rem;
}

.bank-price:hover {
    color: #a8854d;
}

.bank-price:active {
    color: #a8854d;
    background: #a8854d;
}


h2 {
    text-align: center;
    font-size: 1.8rem;
    color: #3d2b00f2;
    margin-bottom: 15px;
    border-bottom: 2px dashed #a8854d;
    padding-bottom: 5px;
}

.balance-title {
    position: absolute;
    top: 193px;
    right: 259px;
    font-size: 2rem;
}

.bank-message {
    position: absolute;
    top: 193px;
    right: 259px;
    font-size: 2rem;
}

.bank-message {
    position: absolute;
    font-size: 1rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.5s ease;
    opacity: 0;
}


.bank-message.bubble-conversation.banker.active,
.bank-message.bubble-conversation.player.active {
    opacity: 1 !important;
}


.bank-message.bubble-conversation.player {
    right: 585px;
    width: 271px;
    height: 203px;
    top: 181px;
    background-image: url('/images/bubble-think.png');
}

.bank-message.bubble-conversation.player span {
    font-size: 0.9rem;
    padding: 57px 70px 0 55px;
    display: inline-block;
    text-align: center;
}

.bank-message.bubble-conversation.player .bank-person {
    position: absolute;
    top: 5px;
    left: calc(50% - 20px);
    transform: translateX(-50%);
    width: calc(initial - 50%);
    background-color: rgb(77, 27, 27);
    color: #ffffff;
    font-size: 1rem;
    text-align: center;
    padding: 5px 10px;
    border-radius: 5px;
}

.bank-message.bubble-conversation.banker {
    left: 575px;
    width: 271px;
    height: 203px;
    top: -43px;
    background-image: url('/images/bubble-message.png');
}

.bank-message.bubble-conversation.banker span {
    font-size: 1rem;
    padding: 50px 83px 0 43px;
    display: inline-block;
    text-align: center;
}

.bank-message.bubble-conversation.banker .bank-person {
    position: absolute;
    top: 10px;
    left: calc(50% - 20px);
    transform: translateX(-50%);
    width: calc(initial - 50%);
    background-color: rgb(77, 27, 27);
    color: #ffffff;

    font-size: 1rem;
    text-align: center;
    padding: 5px 10px;
    border-radius: 5px;
}



.bank-conversation {
    position: absolute;
    bottom: 1.5vw;
    left: 50%;
    transform: translateX(-50%);
}

.bank-conversation .bubble {
    background-color: #00000096;
    color: #ffffff;
    font-family: 'Special Elite', serif;
    font-size: 1vw;
    text-align: center;
    padding: 1vw;
    border-radius: 50px;
    cursor: pointer;
    font-style: italic;
    margin-top: 0.5vw;
}



.balance {
    position: absolute;
    top: 192px;
    right: 106px;
    font-size: 2rem;
    font-weight: bold;
    color: #805f07;
}

.balance-amount {
    position: absolute;
    top: 255px;
    left: 25px;
    width: 275px;
    height: 35px;
    font-size: 1.4em;
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
    font-size: 2rem;
    position: absolute;
    top: 255px;
    right: 101px;
    width: 120px;
    height: 35px;
    font-family: 'Special Elite', serif;
    color: #2c4873;
    text-align: right;
    border-radius: 5px;
    padding: 5px;
    outline: none;
    cursor: pointer;
}

.fake-input span {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    outline: none;
    z-index: 1;
    position: relative;
}

.fake-input span.error {
    color: rgb(150, 17, 17);
}

.fake-input span:after {
    content: '';
    box-shadow: 0px 1px 35px 6px #000000;
    width: 100%;
    height: 0px;
    display: none;
}

.fake-input .placeholder {
    color: #666666a3;
    position: absolute;
    top: 6px;
    right: 5px;
}


.actions {
    display: flex;
    gap: 10px;

    width: 90%;
    position: absolute;
    top: 335px;
    right: 5%;
}

/*
  .actions button {
    width: 50%;
    flex: 1;
    padding: 10px;
    background: #a8854d;
    background-image: url('https://images.freeimages.com/images/large-previews/4a0/worn-wood-texture-1173629.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    color: #cab190;
    border: none;
    font-weight: bold;
    font-family: 'Special Elite', serif;
    cursor: pointer;
    transition: background 0.2s;
    border: 5px solid #a8a8a8;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .actions button:hover {
    background: linear-gradient(to bottom, #c9a96e, #a8854d);
  }
  */




.close {
    background: #6d1f1f;
    color: #f5e6c9;
    font-weight: bold;
    padding: 10px;
    border-radius: 6px;
    font-family: 'Special Elite', serif;
    cursor: pointer;
    position: absolute;
    top: -20px;
    right: -20px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: none;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;
    z-index: 1000;
}

.close:hover {
    background: #932020;
}


.btn-western {
    flex: 1;
    padding: 12px 18px;
    font-family: 'Special Elite', serif;
    font-size: 1rem;
    font-weight: bold;
    color: #fff6dc;
    background: linear-gradient(145deg, #4d3521, #2b1c12);
    border: 3px solid #c9a96e;
    border-radius: 10px;
    box-shadow:
        inset 0 1px 0 #f3e3b0,
        0 4px 8px rgba(0, 0, 0, 0.6);
    text-shadow: 0 1px 0 #000;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    position: relative;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* Hover: effet doré */
.btn-western:hover {
    background: linear-gradient(145deg, #5f422c, #3a2617);
    border-color: #e2c87d;
    color: #ffefbb;
    box-shadow:
        inset 0 1px 0 #fff5d2,
        0 4px 12px rgba(0, 0, 0, 0.8),
        0 0 6px #e6c47c;
}

/* Active: effet pressé */
.btn-western:active {
    transform: translateY(2px);
    box-shadow:
        inset 0 2px 4px #1e1208,
        0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Dépôt = vert orné */
.deposit {
    background: linear-gradient(145deg, #3d301f, #261b10);
    border-color: #a9915d;
}

/* Retrait = rouge cuir */
.withdraw {
    background: linear-gradient(145deg, #6d2f1a, #3b170d);
    border-color: #c0745c;
}

.withdraw:hover {
    background: linear-gradient(145deg, #8a3b23, #4d1f12);
    border-color: #ffb29e;
    box-shadow:
        inset 0 1px 0 #ffd9ca,
        0 4px 12px rgba(0, 0, 0, 0.8),
        0 0 6px #ffb29e;
}

/*media query*/
@media (min-width: 2500px) {
    .bank {
        width: 800px;
        height: 580px;
    }

    .bank-account {
        width: 800px;
        height: 580px;
    }

    .balance-title {
        font-size: 2.5rem;
        top: 291px;
        right: 400px;
    }

    .balance-amount {
        font-size: 2.1rem;
        top: 391px;
        right: 164px;
        width: 436px;
    }

    .balance {
        font-size: 2.5rem;
        top: 293px;
        right: 164px;
    }

    .fake-input {
        font-size: 2.5rem;
        top: 395px;
        right: 159px;
        width: 150px;
    }

    .fake-input .placeholder {
        font-size: 2.5rem;
        top: 2px;
        right: 5px;
    }

    .actions {
        top: 503px;
        right: 45px;
    }

    .actions .btn-western {
        font-size: 2.5rem;
        padding: 20px 18px;
    }

    .bank-open {
        width: 800px;
        height: 580px;
    }

    .bank-title {
        font-size: 3rem;
        top: 270px;
        right: 150px;
        left: 150px;
    }

    .bank-price {
        font-size: 3rem;
        top: 420px;
    }

    .bank-message.bubble-conversation.player {
        font-size: 1.5rem;
        top: 210px;
        right: 584px;
        zoom: 1.5;
    }

    .bank-message.bubble-conversation.banker {
        font-size: 1.5rem;
        top: -80px;
        right: 584px;
        zoom: 1.5;
    }



}

@media (min-width: 3500px) {
    .bank {
        width: 1200px;
        height: 880px;
    }

    .bank-account {
        width: 1200px;
        height: 880px;
    }

    .balance-title {
        font-size: 4rem;
        top: 434px;
        right: 579px;
    }

    .balance-amount {
        font-size: 3.1rem;
        top: 573px;
        right: 210px;
        width: 653px;
    }

    .balance {
        font-size: 4rem;
        top: 431px;
        right: 239px;
    }

    .fake-input {
        font-size: 4rem;
        top: 577px;
        right: 239px;
        width: 230px;
        height: 75px;
    }

    .fake-input .placeholder {
        font-size: 4rem;
        top: 10px;
        right: 5px;
    }


    .actions {
        top: 765px;
        right: 55px;
    }

    .actions .btn-western {
        font-size: 2rem;
        padding: 25px 18px;
    }

    .bank-open {
        width: 1200px;
        height: 880px;
    }

    .bank-title {
        font-size: 4rem;
        top: 400px;
        right: 250px;
        left: 250px;
    }

    .bank-price {
        font-size: 4rem;
        top: 620px;
    }

    .bank-message.bubble-conversation.player {
        font-size: 1.5rem;
        top: 394px;
        left: -279px;
        zoom: 1.5;
    }

    .bank-message.bubble-conversation.banker {
        font-size: 1.5rem;
        top: -80px;
        left: 856px;
        zoom: 1.5;
    }

}
</style>