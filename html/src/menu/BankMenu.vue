<template>
    <div class="bank-menu">

        <div class="balance-title"> {{ 'Jhon Doe' }} </div>

        <div class="balance">{{ balance.toLocaleString() }}</div>

        <div class="form">
            <div class="fake-input">
                <span contenteditable="true" @keydown="handleKeyDown" @input="updateAmount" @blur="updateAmount"
                    ref="editableSpan"></span>
                <div v-if="showPlaceholder" class="placeholder">0</div>
            </div>
        </div>

        <div class="actions">
            <button class="btn-western deposit" @click="deposit">Déposer</button>
            <button class="btn-western withdraw" @click="withdraw">Retirer</button>
        </div>

        <button class="close" @click="close">X</button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { sendNui } from '../utils/nui'
import { useUiStore } from '../stores/uiStore'
import { usePlayerStore } from '../stores/playerStore'
import { useBankStore } from '../stores/bankStore'

const playerStore = usePlayerStore()
const bankStore = useBankStore()
const ui = useUiStore()

const balance = ref(0);
const dollarForm = ref();
const showPlaceholder = ref(true);
const editableSpan = ref(null);

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
    const content = editableSpan.value.innerText.trim();
    showPlaceholder.value = content === '';
    if (content !== 0) {
        dollarForm.value = content;
    }
}

const deposit = () => {
    console.log('deposit', dollarForm.value)
    if (dollarForm.value > 0) {
        console.log('playerStore.wallet', playerStore.wallet)
        // vérifier si le joueur a assez d'argent sur lui
        if (playerStore.wallet < dollarForm.value * 100) {
            console.log('Vous n\'avez pas assez d\'argent sur vous');
            return;
        }        
        dollarForm.value = '';  
        editableSpan.value.innerText = '';
        showPlaceholder.value = true;
        sendNui('bank-deposite', { id: bankStore.currentBank, amount: dollarForm.value })

    }
};

const withdraw = () => {
    console.log('withdraw', dollarForm.value)
    if (dollarForm.value > 0) {
        console.log('bankStore.getBalance', bankStore.getBalance)
        // vérifier si le joueur a assez d'argent en banque
        if (bankStore.getBalance < dollarForm.value) {
            console.log('Vous n\'avez pas assez d\'argent en banque');
            return;
        }        
        dollarForm.value = '';
        editableSpan.value.innerText = '';
        showPlaceholder.value = true;
        sendNui('bank-withdraw', { id: bankStore.currentBank, amount: dollarForm.value })

    }
};

const close = () => {
    sendNui('ui-close')
    ui.closeMenu()
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');


.bank-menu {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 360px;
    padding: 30px;
    border-radius: 5px;
    color: #442c1a;
    font-family: 'Special Elite', serif;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.7);
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('/images/bank.png');
    /* Parchemin HD */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    /* Animation */
    animation: openVault 0.6s ease-out forwards;
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
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

.balance {
    position: absolute;
    top: 192px;
    right: 106px;
    font-size: 2rem;
    font-weight: bold;
    color: #634a05;
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

@keyframes openVault {
    from {
        transform: translateX(-50%) scale(0);
        opacity: 0;
    }

    to {
        transform: translateX(-50%) scale(1);
        opacity: 1;
    }
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
    .bank-menu {
        width: 800px;
        height: 580px;
    }

    .balance-title {
        font-size: 2.5rem;
        top: 291px;
        right: 400px;
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
}

@media (min-width: 3500px) {
    .bank-menu {
        width: 1200px;
        height: 880px;
    }

    .balance-title {
        font-size: 4rem;
        top: 434px;
        right: 579px;
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
}
</style>