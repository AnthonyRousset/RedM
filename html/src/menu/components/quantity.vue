<script setup>

const emit = defineEmits(['sendQuantity'])

const props = defineProps({
    quantity: {
        type: Number,
        required: true
    }
})

const quantityModal = ref(false)

// renvoyer la quantité
const sendQuantity = () => {
    emit('sendQuantity', props.quantity)
}

// valider la quantité
const validateQuantity = () => {
    if (props.quantity < 1) {
        props.quantity = 1
    }
}       


</script>

<template>
    <!-- quantity modal -->
    <div class="quantity-modal" v-if="quantityModal">
        <div class="quantity-modal-content">
            <div class="quantity-modal-title">Quantité</div>
            <div class="quantity-modal-input">
                <input 
                    type="number" 
                    v-model="quantity" 
                    :max="selectedItem?.quantity" 
                    min="1"
                    @input="validateQuantity"
                />
                <div class="quantity-max">/ {{ selectedItem?.quantity }}</div>
            </div>
            <div class="quantity-modal-buttons">
                <button @click="sendQuantity">Envoyer</button>
                <button @click="quantityModal = false">Annuler</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>  
    .quantity-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15vw;
        background-image: url(/images/player/player-inventory-bg_item.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 0.3vw;
        z-index: 100000;
        box-shadow: 0 0 1vw rgba(0, 0, 0, 0.5), inset 0 0 0.5vw rgba(0, 0, 0, 0.5);
        padding: 1.5vw;
    
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
                justify-content: center;
                gap: 0.8vw;
                width: 13vw;
                padding: 0.6vw 1vw 0.3vw;
                background: rgba(0, 0, 0, 0.4);
                border: 0.1vw solid #805f07;
                border-radius: 0.4vw;
                
                input {
                    width: 4vw;
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