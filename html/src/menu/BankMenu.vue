<template>
    <div class="bank-menu">

        <div class="balance-title"> {{ 'Jhon Doe' }} </div>

        <div class="balance">{{ balance.toLocaleString() }}</div>

        <div class="form">
            <input type="text" v-model.number="amount" placeholder="0" maxlength="6" />
        </div>

        <div class="actions">
            <button class="btn-western deposit" @click="deposit">Déposer</button>
            <button class="btn-western withdraw" @click="withdraw">Retirer</button>
        </div>

        <button class="close" @click="close">X</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { sendNui } from '../utils/nui'


const balance = ref(0);
const amount = ref();

const deposit = () => {
    if (amount.value > 0) {
    console.log('deposit', amount.value)
        // vérifier si le joueur a assez d'argent sur lui
        if (balance.value < amount.value) {
            console.log('Vous n\'avez pas assez d\'argent');
            return;
        }
        sendNui('bank-deposite', { amount: amount.value })
        amount.value = 0;
    }
};

const withdraw = () => {
    if (amount.value > 0) {
    console.log('withdraw', amount.value)
        // vérifier si le joueur a assez d'argent en banque
        if (balance.value < amount.value) {
            console.log('Vous n\'avez pas assez d\'argent');
            return;
        }
        sendNui('bank-withdraw', { amount: amount.value })
        amount.value = 0;
    }
};

const close = () => {
    sendNui('bank-close')
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

.form input {
    border: none;
    background: none;
    font-weight: bold;
    font-size: 2rem;
    position: absolute;
    top: 257px;
    right: 106px;
    width: 110px;
    font-family: 'Special Elite', serif;
    color: #634a05;
    text-align: right; 
    background-color: #4b3f0942;
    border-radius: 5px;
    padding: 5px;
    outline: none;
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

.history {
    margin-top: 20px;
}

.history h3 {
    font-size: 1.2rem;
    border-bottom: 1px solid #a8854d;
    margin-bottom: 6px;
}

.history ul {
    list-style: none;
    padding: 0;
    max-height: 120px;
    overflow-y: auto;
    font-size: 0.9rem;
}

.history li {
    padding: 4px 0;
    border-bottom: 1px dashed #3a2a18;
}

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
    .form input {
        font-size: 2.5rem;
        top: 395px;
        right: 159px;
        width: 150px;
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
    .form input {
        font-size: 4rem;
        top: 577px;
        right: 239px;
        width: 230px;
        height: 75px;
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