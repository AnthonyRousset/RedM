<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useUiStore } from '../../stores/uiStore'
import { useBankStore } from '../../stores/bankStore'
import { useShopStore } from '../../stores/shopStore'
import BubbleMessage from './BubbleMessage.vue'

const bankStore = useBankStore()
const shopStore = useShopStore()

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    item: {
        type: [Object, null],
        required: true
    },
    title: {
        type: String,
        default: 'Quantité à déposer'
    },
    to: {
        type: String,
        default: 'inventory',
        validator: (value) => ['inventory', 'bank', 'player', 'shop'].includes(value)
    },
    person: {
        type: String,
        default: 'Moi'
    }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const quantity = ref(1)
const quantityInput = ref(null)
const error = ref('')
const uiStore = useUiStore()
const maxQuantity = ref(1)

onMounted(() => {
    if (props.item) {
        maxQuantity.value = props.item.quantity
    }
})

// Surveiller les changements de props.item
watch(() => props.item, (newItem) => {
    if (newItem) {
        maxQuantity.value = newItem.quantity
        quantity.value = 1 // Réinitialiser la quantité à 1
    }
}, { immediate: true })

// Reset quantity when modal opens
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        quantity.value = 1
        // Attendre que le DOM soit mis à jour
        nextTick(() => {
            quantityInput.value?.focus()
        })
    }
})

// Écouter les changements dans le uiStore
watch(() => uiStore.closeBankModal, (newValue) => {
    if (newValue && props.to === 'bank') {
        emit('update:modelValue', false)
        uiStore.resetModalFlags()
    }
})

watch(() => uiStore.closeInventoryModal, (newValue) => {
    if (newValue && props.to === 'inventory') {
        emit('update:modelValue', false)
        uiStore.resetModalFlags()
    }
})

const validateQuantity = () => {
    if (!props.item) return;
    
    let val = parseInt(quantity.value)
    if (isNaN(val) || val < 1) {
        quantity.value = 1
    } else if (val > maxQuantity.value) {
        quantity.value = maxQuantity.value
    }

    // Mettre à jour maxQuantity si nécessaire
    if (props.item.quantity !== maxQuantity.value) {
        maxQuantity.value = props.item.quantity
    }

    switch (props.to) {
        case 'bank':
            if (props.item.type === 'u') {
                // la banque est limité a 3 emplacements max, donc on test si c'est plein 
                if (bankStore.stock.length >= 3) {
// on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans ma banque !'
                    return
                }
            } else {
                // la banque est limité a 3 emplacements max, donc on test si c'est plein  sauf si c'est stackable et que l'objet est dans la liste 
                if (bankStore.stock.length >= 3 && !bankStore.stock.find(stock => stock.id === props.item.id)) {
                    // on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans ma banque !'
                    return
                }
            }
            break
        case 'shop':
        if (props.item.type === 'u') {
                // la banque est limité a 25 emplacements max, donc on test si c'est plein 
                if (shopStore.stock.length >= 25) {
                    // on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans mon magasin !'
                    return
                }
            } else {
                // la banque est limité a 25 emplacements max, donc on test si c'est plein  sauf si c'est stackable et que l'objet est dans la liste 
                if (shopStore.stock.length >= 25 && !shopStore.stock.find(stock => stock.id === props.item.id)) {
                    // on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans mon magasin !'
                    return
                }
            }
            break
        default:
            break
    }
}

const confirm = () => {
    validateQuantity()
    emit('confirm', quantity.value)
    emit('update:modelValue', false)
}

const cancel = () => {
    emit('cancel')
    emit('update:modelValue', false)
}

const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        confirm()
    }
}

const setMaxQuantity = () => {
    quantity.value = maxQuantity.value  
}
</script>

<template>

    <div class="quantity-modal" v-if="modelValue"
        :class="{ 'qt-inventory': to === 'inventory', 'qt-bank': to === 'bank' }">
        <div class="quantity-modal-content">
            <div class="quantity-modal-title">{{ title }}</div>
            <div class="quantity-modal-input">
                <input type="number" v-model="quantity" min="1" @input="validateQuantity" @keydown="handleKeyDown"
                    ref="quantityInput" />

                <div class="quantity-max">/ {{ maxQuantity }}</div>
                <button class="quantity-max-button" @click="setMaxQuantity">Max</button>
            </div>
            <div class="quantity-modal-buttons">
                <button @click="cancel">Annuler</button>
                <button @click="confirm">Envoyer</button>
            </div>
        </div>

        <!-- bubble error -->
        <BubbleMessage :active="!!error" :message="error" :person="person" type="message" :positionLeft="13"
            :positionTop="-9" />
    </div>
</template>

<style lang="scss" scoped>
.quantity-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 0.3vw;
    z-index: 100000;
    box-shadow: 0 0 1vw rgba(0, 0, 0, 0.5), inset 0 0 0.5vw rgba(0, 0, 0, 0.5);
    padding: 1.5vw;

    &.qt-inventory {
        background-image: url(/images/player/inventory-bg_item.png);
    }

    &.qt-bank {
        background-image: url(/images/bank/bank-bg_item.png);

        .quantity-modal-buttons {
            button {
                background: #0000008c !important;
            }
        }
    }

    &.qt-shop {
        background-image: url(/images/shop/shop-bg_item.png);
    }

    .quantity-modal-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1vw;

        .quantity-modal-title {
            font-family: 'Special Elite', serif;
            font-size: 1.2vw;
            color: #f5e6c9;
            text-align: center;
            text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
            letter-spacing: 0.1vw;

            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0.15vw;
                background: linear-gradient(to right, transparent, #805f07, transparent);
                margin: 0.4vw auto 0;
            }
        }

        .quantity-modal-input {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.2vw;
            width: 13vw;
            padding: 0.6vw 1vw 0.3vw;
            background: rgba(0, 0, 0, 0.4);
            border: 0.1vw solid #805f07;
            border-radius: 0.4vw;

            input {
                width: 5vw;
                background: none;
                border: none;
                color: #f5e6c9;
                font-family: 'Special Elite', serif;
                font-size: 1vw;
                text-align: right;
                outline: none;

                &::-webkit-inner-spin-button,
                &::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                &[type=number] {
                    -moz-appearance: textfield;
                }
            }

            .quantity-max {
                color: #805f07;
                font-family: 'Special Elite', serif;
                font-size: 1vw;
            }

            .quantity-max-button {
                position: absolute;
                right: 0.5vw;
                top: 0.5vw;
                background: none;
                border: none;
                color: #f5e6c9;
                font-family: 'Special Elite', serif;
                font-size: 1vw;
                text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
                cursor: pointer;
                transition: all 0.3s ease-out;

                &:hover {
                    color: #a8854d;
                }

            }
        }

        .quantity-modal-buttons {
            display: flex;
            gap: 0.8vw;
            margin-top: 0.8vw;
            width: 100%;

            button {
                flex: 1;
                padding: 0.6vw;
                background: radial-gradient(circle, #291b12 0%, #1e130c 100%);
                border: 0.1vw solid #805f07;
                border-radius: 0.4vw;
                color: #f5e6c9;
                font-family: 'Special Elite', serif;
                font-size: 1vw;
                text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
                cursor: pointer;
                transition: all 0.3s ease-out;

                &:hover {
                    border-color: #a8854d;
                    filter: brightness(1.2);
                }

                &:active {
                    transform: scale(0.98);
                }
            }
        }
    }
}
</style>