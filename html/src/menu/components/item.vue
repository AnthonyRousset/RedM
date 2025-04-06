<script setup>
import { ref } from 'vue'
import itemsData from '../../data/items.json'
const tags = ref(itemsData.tags)
const items = ref(itemsData.items)

const props = defineProps({
    item: {
        type: Object,
        required: true
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
    <div id="item-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div class="item">
            <img :src="'./images/items/' + item.id + '.png'" alt="Item">
            <div class="quantity" v-if="item.quantity > 1">{{ item.quantity }}</div>
        </div>
        <div class="status" v-for="tag in item.tags" :key="tag">
            <img v-if="tags[tag]" :src="'./images/items/_' + tags[tag]?.image + '.png'" alt="Tag">
        </div>
    </div>
</template>

<style lang="scss" scoped>
#item-container {
    position: relative;
    width: 100%;
    height: 100%;
    
    .item {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 80%;
            height: 80%;
            object-fit: contain;
        }

        .quantity {
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: rgb(0 0 0 / 28%);
            color: white;
            padding: 0.1vw 0.3vw;
            border-radius: 0.15vw;
            font-size: 1vw;
            font-weight: bold;
            font-family: sans-serif;
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
}
</style>
