<script setup>
import { ref } from 'vue'
import itemsData from '../../data/items.json'
const tags = ref(itemsData.tags)
const items = ref(itemsData.items)

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        default: 'inventory' // shop, inventory
    },
    Quantity: {
        type: Number,
        default: 0
    },
    Price: {
        type: Number,
        default: 0
    }
})

// Définir les émetteurs d'événements
const emit = defineEmits(['showTooltip', 'hideTooltip'])

// Trouver l'item correspondant dans itemsData pour afficher son nom et sa description
const itemJSON = items.value.find(i => i.id === props.item.id) || { name: 'Inconnu', description: 'Aucune description disponible' }

// Fonction pour afficher le tooltip
const handleMouseEnter = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    emit('showTooltip', {
        item: props.item,
        itemJSON,
        position: {
            x: rect.x + rect.width,
            y: rect.y
        }
    })
}

// Fonction pour masquer le tooltip
const handleMouseLeave = () => {
    emit('hideTooltip')
}
</script>

<template>
    <div id="item-container" :class="{ 'shop': type === 'shop', 'inventory-item': type === 'inventory' }"  @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <div class="item">
            <div class="image">
                <img :src="'./images/items/' + item.id + '.png'" alt="Item">
            </div>
            <div v-if="type === 'shop'" class="details">
                <div class="price" v-if="Price > 0">
                    <div>
                        <span>Prix </span>
                    </div>
                    <div>
                        <span class="value"> {{ (Price / 100).toLocaleString() }} </span>
                        <img :src="'./images/player/player-inventory-dollar.png'" alt="player">
                    </div>
                </div>
                <div class="quantity" v-if="Quantity > 0">
                    <div>
                        quantité
                    </div>
                    <div>
                        <span class="value"> {{ Quantity.toLocaleString() }}</span>
                        <!--<img :src="'./images/player/player-inventory-quantity.png'" alt="player">-->
                    </div>
                </div>
            </div>
        </div>
        <div class="quantity" v-if="type === 'inventory' && item.quantity > 0">{{ item.quantity }}</div>
        <div class="status" v-for="tag in item.tags" :key="tag" v-if="type === 'inventory'">
            <img v-if="tags[tag]" :src="'./images/items/_' + tags[tag]?.image + '.png'" alt="Tag">
        </div>
    </div>
</template>

<style lang="scss" scoped>
#item-container {
    position: relative;
    width: 92%;
    height: 92%;
    padding: 4%;


    .item {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .details {
            width: 110%;
            background: #0000008c;
            position: absolute;
            bottom: -5%;
            left: -5%;
            right: -5%;
            border-radius: 0vw 0vw 0.4vw 0.4vw;
            padding-bottom: 0.4vw;
            

            .quantity {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 1vw);
                    color: #c3ac55;
                position: relative;
                padding: 0 0.5vw 0 0.5vw; 
                font-size: 0.7vw;
                font-family: 'Wantedo', 'Oswald',  sans-serif;

                .value {
                    color: #ffffff;
                    font-family: 'Special Elite', 'Oswald',  sans-serif;

                }

                img {
                    width: 1vw;
                    height: 1vw;
                    object-fit: contain;
                    position: absolute;
                    top: -0.3vw;
                    right: 0vw;
                }
            }

            .price {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 1.5vw);
                height: 1.2vw;
                color: #c3ac55;
                position: relative;
                padding: 0 1vw 0 0.5vw;
                font-size: 0.7vw;

                font-family: "Wantedo", sans-serif;

                .value {
                    
                    color: #ffffff;                 
                    font-family: 'Special Elite', 'Oswald',  sans-serif;

                }

                img {
                    width: 1vw;
                    height: 1vw;
                    object-fit: contain;
                    position: absolute;    
                    top: 0.05vw;
                    right: 0.2vw;
                }
            }
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    }

    .status {
        width: 65%;
        height: 65%;
        position: absolute;
        top: -0.75vw;
        right: -0.75vw;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    &.shop {
        .item {
            /*height: 94%;
            padding-bottom: 14%;*/
        }
    }

    &.inventory-item {
        .quantity {
            position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        font-size: 0.7vw;
                        color: #d9bb74;
                        background: #0000008c;
                        border-radius: 0.25vw;
                        text-align: center;
                        padding: 0.1vw 0 0;
                        font-family: 'Wantedo', sans-serif;
        }
    }
}
</style>
