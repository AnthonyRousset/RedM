<script setup>
// Modal to buy item into shop
import { ref, computed, onMounted } from 'vue'
import { useShopStore } from '../../../stores/shopStore'
import itemsData from '../../../data/items.json'


const shopStore = useShopStore()


const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'confirm'])

const JSONitems = ref(itemsData.items)
const quantite = ref(1)
const editableSpan = ref(null)

const validateInput = (event) => {
    const content = editableSpan.value.innerText.trim();
    let value = parseInt(content) || 1;
    
    // S'assurer que la valeur est au moins 1
    if (value < 1) {
        value = 1;
        editableSpan.value.innerText = '1';
    }
    
    // Limiter la valeur maximale à item.sellAmount
    if (value > props.item.sellAmount) {
        value = props.item.sellAmount;
        editableSpan.value.innerText = props.item.sellAmount.toString();
    }
    
    quantite.value = value;
}

const priceTotal = computed(() => {
    let price = (props.item.sellPrice / 100) * quantite.value
    return price.toLocaleString()
})

const handleKeyDown = (event) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const ctrlKeys = ['a', 'c', 'v', 'x'];

    if (event.key === 'Enter') {
        event.preventDefault();
        handleConfirm();
    }

    if (
        allowedKeys.includes(event.key) ||
        (event.ctrlKey && ctrlKeys.includes(event.key.toLowerCase()))
    ) {
        return;
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

    // Si le nombre est supérieur à item.sellAmount, mettre directement la valeur maximale
    if (parseInt(nextText) > props.item.sellAmount) {
        event.preventDefault();
        editableSpan.value.innerText = props.item.sellAmount.toString();
        quantite.value = props.item.sellAmount;
        return;
    }

    // Empêcher les nombres commençant par 0 et les nombres trop grands
    if (/^0\d+/.test(nextText) || nextText.length > 6) {
        event.preventDefault();
    }
};

// Initialiser avec la valeur 1
onMounted(() => {
    editableSpan.value.innerText = '1';
    quantite.value = 1;
});

const handleClose = () => {
    emit('close')
}

const handleConfirm = () => {
    emit('confirm', props.item, quantite.value)
    handleClose()
}



</script>

<template>
    <div class="modal-buy">
        <div class="titre">
            <span>{{ JSONitems.find(i => i.id === item.id).name }}</span>
        </div>
        <div class="prix">
            <span>Prix: {{ (item.sellPrice / 100).toLocaleString() }} $ / unité</span>
        </div>
        <div class="quantite">
            <span>En possession: {{ item.sellAmount || 0 }}</span>
        </div>  
        <div class="input-quantite">
            <span 
                contenteditable="true" 
                @keydown="handleKeyDown" 
                @input="validateInput"
                @blur="validateInput" 
                ref="editableSpan"
                :class="{ error: playerMessage || bankMessage }"
            >1</span>
        </div>
        <div class="resume">   
            <span>Vous allez acheter {{ quantite }} unité(s)</span>
        </div>
        <div class="prix-total">
            <span>Pour un total de {{ priceTotal }} $</span>
        </div>
        <div class="button-buy" @click="handleConfirm">
            <button>Acheter</button>
        </div>
        <div class="button-cancel" @click="handleClose">
            <button>Annuler</button>
        </div>
    </div>
</template> 

<style lang="scss" scoped>

$color-text-dark: #442c1a;

.modal-buy {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20vw;
    height: 31.3vw;
    background-image: url(/images/shop/shop-bg-sellbuy-item.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1000;
    padding: 2vw;

    .titre {
        padding-top: 2vw;
        font-weight: bold;
        color: $color-text-dark;
        text-align: center;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
            display: inline-block;
            max-width: 100%;
            font-size: clamp(1.2vw, 2.5vw, 3vw); // clamp est une fonction qui permet de limiter la taille de la police 
        }
    }

    .prix {
        padding-top: 2vw;
        font-size: 1.2vw;
            color: $color-text-dark;
        text-align: center;
    }

    .quantite {
        padding-top: 1vw;
        font-size: 1.2vw;
        color: $color-text-dark;
        text-align: center;
    }       

    .input-quantite {
        position: absolute;
        top: 16.7vw;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.2vw;
        font-weight: bold;
        color: $color-text-dark;
        text-align: center;

        span {
            width: 11vw;
            height: 3vw;
            border: none;
            padding: 0.5vw;
            text-align: center;
            outline: none;
            font-size: 2.5vw;
            font-weight: bold;
            color: $color-text-dark;
            background-color: #00000000;
            font-family: 'Great Vibes', serif;
            display: block;
        }
    }


    .resume {
        position: absolute;
        top: 21vw;
        left: 0;
        font-size: 1.2vw;
        color: #442c1a;
        text-align: center;
        width: 80%;
        padding: 0 10%;
    }

    .prix-total {
        position: absolute;
        top: 24vw;
        left: 0;
        font-size: 1.2vw;
        color: #442c1a;
        text-align: center;
        width: 80%;
        padding: 0 10%;
    }
    
    .button-buy, .button-cancel {
        position: absolute;
        bottom: 1.5vw;
        width: 7.5vw;
        text-align: center;
        padding-top: 4vw;
        cursor: pointer;

        button {
            width: 1;
            padding: 0.5vw;
            background: none;
            border: none;
            color: $color-text-dark;
            font-size: 1.2vw;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Wantedo', serif;


        }           
        &:hover button{
                text-shadow: 0 0 15px #ffffffbe,0 0 25px #ffffffbe;
            }
    }

    .button-buy {
        left: 3vw;
    }

    .button-cancel {
        right: 3vw;

        button {
            color: #a72518;
        }
    }

}

</style>


