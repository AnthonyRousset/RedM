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
    sellQuantity: {
        type: Number,
        default: 0
    },
    buyQuantity: {
        type: Number,
        default: 0
    },
    buyPrice: {
        type: Number,
        default: 0
    },
    sellPrice: {
        type: Number,
        default: 10
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
            <div class="quantity" v-if="type === 'inventory' && item.quantity > 1">{{ item.quantity }}</div>
            <div v-if="type === 'shop'" class="details">
                <div class="price" v-if="buyPrice > 0">
                    <div>
                        <span>Prix </span>
                    </div>
                    <div>
                        <span class="value"> {{ buyPrice }} </span>
                        <img :src="'./images/player/player-inventory-dollar.png'" alt="player">
                    </div>
                </div>
                <div class="price" v-if="sellPrice > 0">
                    <div>
                        <span>Prix </span>
                    </div>
                    <div>
                        <span class="value"> {{ sellPrice }} </span>
                        <img :src="'./images/player/player-inventory-dollar.png'" alt="player">
                    </div>
                </div>
                <div class="quantity" v-if="buyQuantity > 0">
                    <div> 
                        quantité
                    </div>
                    <div>
                        <span class="value"> {{ buyQuantity }}</span>
                        <img :src="'./images/player/player-inventory-quantity.png'" alt="player">
                    </div>
                </div>
                <div class="quantity" v-if="sellQuantity > 0">
                    <div>
                        quantité
                    </div>
                    <div>
                        <span class="value"> {{ sellQuantity }}</span>
                        <img :src="'./images/player/player-inventory-quantity.png'" alt="player">
                    </div>
                </div>
            </div>
        </div>
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
            width: 90%;

            .quantity {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 0.5vw);
                height: 1vw;
                color: #ffffff;
                position: relative;
                padding-right: 0.6vw;
                font-size: 0.7vw;

                .value {
                    color: #c3ac55;
                    font-weight: bold;
                }

                img {
                    width: 1.2vw;
                    height: 1.2vw;
                    object-fit: contain;
                    position: absolute;
                    top: -0.2vw;
                    right: -0.5vw;
                }
            }

            .price {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 0.5vw);
                height: 1.2vw;
                color: #ffffff;
                position: relative;
                padding-right: 0.6vw;
                font-size: 0.7vw;

                .value {
                    color: #c3ac55;
                    font-weight: bold;
                }

                img {
                    width: 1.2vw;
                    height: 1.2vw;
                    object-fit: contain;
                    position: absolute;    
                    top: -0.1vw;
                    right: -0.5vw;
                }
            }
        }

        img {
            width: 100%;
            height: 5vw;
            object-fit: contain;
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
            width: 100%;
            background-color: rgb(0 0 0 / 33%);
            color: #ffffff;
            font-size: 0.7vw;
            text-align: center;
        }
    }
}
</style>
