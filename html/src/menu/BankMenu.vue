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


const switchBank = (bank) => {
    // switch the bank view 
    isSwitching.value = true;
    setTimeout(() => {
        bankView.value = bank;
        isSwitching.value = false;
    }, 1000);
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

                    </div>
                    <div class="bag">
                        <div class="inventory">
                            <PerfectScrollbar>
                            <ul>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
                                </li>
                                <li>
                                    <img src="/images/items/pickaxe.png" alt="">
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
        <div class="bubble">
            Au revoir, m'sieur le banquier !
        </div>
        <div class="bank-person">Moi</div><span> Au revoir, m'sieur le banquier ! </span>
    </div>

    <div class="bank-conversation" v-else>
        <div class="bubble" @click="switchBank('account')" v-if="bankView === 'vault'">
            Hé là, m'sieur le banquier ! J'viens voir mes économies !
        </div>
        <div class="bubble" @click="switchBank('vault')" v-if="bankView === 'account'">
            J'aimerais jeter un œil à mon coffre, si vous l'permettez.
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
  -ms-overflow-style: none !important;  /* IE and Edge */
  scrollbar-width: none !important;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none !important; /* Chrome, Safari and Opera */
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
  position: absolute;
  left: 50%;
  transform: translate(-50%, -100%);
  animation: openVault $animation-timing forwards;
  height: 100%;
  width: 100%;
  
  &.__closing {
    animation: closeVault $animation-timing forwards !important;
  }
}

.loading {
  position: absolute;
  padding: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  span {
    font-size: 4rem;
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
  0% { opacity: 0; }
  20% { opacity: 1; }
  50% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

.bank-loading {
  position: absolute;
  top: calc(50% - 209px);
  left: calc(50% - 285px);
  width: 500px;
  height: 360px;
  padding: 30px;
  border-radius: 5px;
  background-image: url('/images/bank/bank-account-empty.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bank-open {
  color: $color-text-dark;
  font-family: $font-family-primary;
  position: absolute;
  top: calc(50% - 209px);
  left: calc(50% - 285px);
  width: 500px;
  height: 360px;
  padding: 30px;
  border-radius: 5px;
  background-image: url('/images/bank/bank-account-empty.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bank-account {
  position: absolute;
  top: calc(50% - 209px);
  left: calc(50% - 285px);
  width: 500px;
  height: 360px;
  padding: 30px;
  border-radius: 5px;
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
  top: 193px;
  right: 50px;
  left: 50px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  
  span {
    color: $color-gold-light;
  }
}

.bank-price {
  position: absolute;
  top: 265px;
  font-size: 2rem;
  
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
  font-size: 1.8rem;
  color: #3d2b00f2;
  margin-bottom: 15px;
  border-bottom: 2px dashed $color-gold-light;
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
  font-size: 1rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.5s ease;
  opacity: 0;
  
  &.bubble-conversation {
    &.banker, &.player {
      &.active {
        opacity: 1 !important;
      }
    }
    
    &.player {
      right: 585px;
      width: 271px;
      height: 203px;
      top: 181px;
      background-image: url('/images/bubble-think.png');
      
      span {
        font-size: 0.9rem;
        padding: 57px 70px 0 55px;
        display: inline-block;
        text-align: center;
      }
      
      .bank-person {
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
    }
    
    &.banker {
      left: 575px;
      width: 271px;
      height: 203px;
      top: -43px;
      background-image: url('/images/bubble-message.png');
      
      span {
        font-size: 1rem;
        padding: 50px 83px 0 43px;
        display: inline-block;
        text-align: center;
      }
      
      .bank-person {
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
    }
  }
}

.bank-conversation {
  position: absolute;
  bottom: 1.5vw;
  left: 50%;
  transform: translateX(-50%);
  
  .bubble {
    background-color: #00000096;
    color: #ffffff;
    font-family: $font-family-primary;
    font-size: 1vw;
    text-align: center;
    padding: 1vw;
    border-radius: 50px;
    cursor: pointer;
    font-style: italic;
    margin-top: 0.5vw;
  }
}

.balance {
  position: absolute;
  top: 192px;
  right: 106px;
  font-size: 2rem;
  font-weight: bold;
  color: $color-gold;
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
  font-family: $font-family-primary;
  color: #2c4873;
  text-align: right;
  border-radius: 5px;
  padding: 5px;
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
      box-shadow: 0px 1px 35px 6px #000000;
      width: 100%;
      height: 0px;
      display: none;
    }
  }
  
  .placeholder {
    color: #666666a3;
    position: absolute;
    top: 6px;
    right: 5px;
  }
}

.actions {
  display: flex;
  gap: 10px;
  width: 90%;
  position: absolute;
  top: 335px;
  right: 5%;
}

.close {
  background: $color-red;
  color: $color-text-light;
  font-weight: bold;
  padding: 10px;
  font-family: $font-family-primary;
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
  
  &:hover {
    background: $color-red-hover;
  }
}

.btn-western {
  flex: 1;
  padding: 12px 18px;
  font-family: $font-family-primary;
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
  
  &:hover {
    background: linear-gradient(145deg, #5f422c, #3a2617);
    border-color: #e2c87d;
    color: #ffefbb;
    box-shadow:
        inset 0 1px 0 #fff5d2,
        0 4px 12px rgba(0, 0, 0, 0.8),
        0 0 6px #e6c47c;
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow:
        inset 0 2px 4px #1e1208,
        0 1px 2px rgba(0, 0, 0, 0.5);
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
        inset 0 1px 0 #ffd9ca,
        0 4px 12px rgba(0, 0, 0, 0.8),
        0 0 6px #ffb29e;
  }
}

.vault {
  position: absolute;
  top: calc(50% - 23vw);
  right: 4vw;
  width: 25vw;
  height: 40vw;
  background-image: url(/images/bank/bank-vault.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bag {
  position: absolute;
  top: calc(50% - 23vw);
  left: 4vw;
  width: 31vw;
  height: 40vw;
  background-image: url(/images/player/player-inventory.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  .inventory {
    position: absolute;
    top: 9vw;
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
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1vw;
      padding: 1vw;
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      li {
        width: 100%;
        height: 100%;
        background-image: url(/images/player/player-inventory-bg_item.png);
        background-size: cover;
        background-repeat: repeat;
        background-position: center;
        overflow: hidden;
        box-shadow: inset 0px -1px 4px 1px rgb(0 0 0 / 59%);
        border-radius: 5px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-fit: contain;
        }
      }
    }
  }
}

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
    
    .placeholder {
      font-size: 2.5rem;
      top: 2px;
      right: 5px;
    }
  }

  .actions {
    top: 503px;
    right: 45px;
    
    .btn-western {
      font-size: 2.5rem;
      padding: 20px 18px;
    }
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

  .bank-message.bubble-conversation {
    &.player {
      font-size: 1.5rem;
      top: 210px;
      right: 584px;
      zoom: 1.5;
    }
    
    &.banker {
      font-size: 1.5rem;
      top: -80px;
      right: 584px;
      zoom: 1.5;
    }
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
    
    .placeholder {
      font-size: 4rem;
      top: 10px;
      right: 5px;
    }
  }

  .actions {
    top: 765px;
    right: 55px;
    
    .btn-western {
      font-size: 2rem;
      padding: 25px 18px;
    }
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

  .bank-message.bubble-conversation {
    &.player {
      font-size: 1.5rem;
      top: 394px;
      left: -279px;
      zoom: 1.5;
    }
    
    &.banker {
      font-size: 1.5rem;
      top: -80px;
      left: 856px;
      zoom: 1.5;
    }
  }
}
</style>