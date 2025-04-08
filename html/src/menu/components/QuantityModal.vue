<script setup>
import { ref, watch, nextTick } from 'vue'
import BubbleMessage from './BubbleMessage.vue'
import { useUiStore } from '../../stores/uiStore'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    maxQuantity: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: 'Quantité'
    },
    type: {
        type: String,
        default: 'inventory'
    },
    error: {
        type: String,
        default: ''
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
    if (newValue && props.type === 'bank') {
        emit('update:modelValue', false)
        uiStore.resetModalFlags()
    }
})

watch(() => uiStore.closeInventoryModal, (newValue) => {
    if (newValue && props.type === 'inventory') {
        emit('update:modelValue', false)
        uiStore.resetModalFlags()
    }
})

const validateQuantity = () => {
    let val = parseInt(quantity.value)
    if (isNaN(val) || val < 1) {
        quantity.value = 1
    }
}

const confirm = () => {
    validateQuantity()
    // si la quantité est supérieure à la quantité max, on ne peut pas envoyer
    if (quantity.value > props.maxQuantity) {
        error.value = props.error
        return
    }
    error.value = ''
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
    quantity.value = props.maxQuantity
}
</script>

<template>
    <div class="quantity-modal" v-if="modelValue" :class="{ 'qt-inventory': type === 'inventory', 'qt-bank': type === 'bank' }">
        <div class="quantity-modal-content">
            <div class="quantity-modal-title">{{ title }}</div>
            <div class="quantity-modal-input">
                <input 
                    type="number" 
                    v-model="quantity" 
                    min="1"
                    @input="validateQuantity"
                    @keydown="handleKeyDown"
                    ref="quantityInput"
                />
                <div class="quantity-max">/ {{ maxQuantity }}</div>
                <button class="quantity-max-button" @click="setMaxQuantity">Max</button>
            </div>
            <div class="quantity-modal-buttons">
                <button @click="cancel">Annuler</button>
                <button @click="confirm">Envoyer</button>
            </div>
        </div>

        <!-- bubble error -->
        <BubbleMessage 
            :active="!!error"
            :message="error"
            :person="person"
            type="message"
            :positionLeft="13"
            :positionTop="-9"
        />
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
}</style> 