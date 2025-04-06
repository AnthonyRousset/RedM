<script setup>
import { ref } from 'vue'

import { usePlayerStore } from '../../stores/playerStore'
import Multiselect from '@vueform/multiselect'
import Item from './item.vue'
import itemsData from '../../data/items.json'


defineProps({
    type: {
        type: String,
        required: true
    }
})

const playerStore = usePlayerStore()
const items = ref(itemsData.items)
const tags = ref(itemsData.tags)
const selectedFilter = ref('');

// Gestion du tooltip global
const tooltipData = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const filterOptions = [
    { value: '', label: 'TOUS', icon: '/images/player/player-inventory-all.svg' },
    { value: 'weapon', label: 'ARMES', icon: '/images/player/player-inventory-weapons.svg' },
    { value: 'food', label: 'NOURRITURES', icon: '/images/player/player-inventory-food.svg' },
    { value: 'medical', label: 'MÉDICAL', icon: '/images/player/player-inventory-medical.svg' },
    { value: 'drug', label: 'DROGUES', icon: '/images/player/player-inventory-drug.svg' },
    { value: 'crafting', label: 'ARTISANAT', icon: '/images/player/player-inventory-crafting.svg' },
    { value: 'animal', label: 'ANIMAUX', icon: '/images/player/player-inventory-animals.svg' },
    { value: 'tool', label: 'OUTILS', icon: '/images/player/player-inventory-tools.svg' },
    { value: 'clothe', label: 'VÊTEMENTS' },
    { value: 'document', label: 'DOCUMENTS' },
    { value: 'quest', label: 'QUEST' }
];


// Afficher le tooltip
const showTooltip = (data) => {
    tooltipData.value = data

    // Ajuster la position pour éviter que le tooltip sorte de l'écran
    const padding = 1; // en vw
    const tooltipWidth = 14; // largeur en vw
    const tooltipHeight = 10; // hauteur estimée en vh

    // Convertir les coordonnées en pourcentages de la fenêtre
    let x = (data.position.x / window.innerWidth) * 100; // convertir en pourcentage de la largeur
    let y = (data.position.y / window.innerHeight) * 100; // convertir en pourcentage de la hauteur

    // Ajouter le padding (en pourcentage)
    x = x + padding;

    // Vérifier si le tooltip dépasse à droite
    if (x + tooltipWidth > 100) {
        x = (data.position.x / window.innerWidth) * 100 - tooltipWidth - padding;
    }

    // Vérifier si le tooltip dépasse en bas
    if (y + tooltipHeight > 100) {
        y = 100 - tooltipHeight - padding;
    }

    // Vérifier si le tooltip dépasse en haut
    if (y < 0) {
        y = padding;
    }

    tooltipPosition.value = { x, y };
}

// Masquer le tooltip
const hideTooltip = () => {
    tooltipData.value = null
}

// Fonction de filtrage
const filter = (value) => {
    console.log('filter', value)
    selectedFilter.value = value;
};

const sortByWeight = (order) => {
    playerStore.inventory.sort((a, b) => {
        const weightA = a.details.weight * a.quantity;
        const weightB = b.details.weight * b.quantity;
        return order === 'asc' ? weightA - weightB : weightB - weightA;
    });
};

const sortByQuantity = (order) => {
    playerStore.inventory.sort((a, b) => {
        return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    });
};

function search() {
    console.log(search.value)
}

const clickItem = (typeId, item, quantity) => {
    console.log('clickItem', typeId, item, quantity)
    switch (props.type) {
        case 'bank':
            console.log('bank-stock-add-' + typeId, item)
            sendNui('bank-stock-add-' + typeId, { idBank: typeId, complexId: item.complexId, idItem: item.id, quantity: quantity })
            break
        case 'vendor':
            console.log('vendor-stock-add-' + typeId, item)
            sendNui('vendor-stock-add-' + typeId, { idVendor: typeId, complexId: item.complexId, idItem: item.id, quantity: quantity })
            break
        case 'player':
            console.log('player-stock-add-' + typeId, item)
            break
    }
}


</script>

<template>

    <div class="bag">
        <div class="filter">
            <div class="select-container">
                <Multiselect v-model="selectedFilter" :options="filterOptions" :searchable="false"
                    :close-on-select="true" :preserve-search="false" placeholder="Catégorie" track-by="value"
                    label="label" @change="filter">
                    <template #option="{ option }">
                        <div class="option-content">
                            <img v-if="option.icon" :src="option.icon" :alt="option.label" class="option-icon">
                            <span>{{ option.label }}</span>
                        </div>
                    </template>
                </Multiselect>
            </div>
        </div>
        <div class="filter1">
            <div class="filter-container">
                <div class="filter-group">
                    <div class="filter-label">Poids</div>
                    <div class="filter-buttons">
                        <button class="filter-button" @click="sortByWeight('asc')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14l5-5 5 5z" />
                            </svg>
                        </button>
                        <button class="filter-button" @click="sortByWeight('desc')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="filter-group">
                    <div class="filter-label">Quantité</div>
                    <div class="filter-buttons">
                        <button class="filter-button" @click="sortByQuantity('asc')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14l5-5 5 5z" />
                            </svg>
                        </button>
                        <button class="filter-button" @click="sortByQuantity('desc')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="filter-container">
                <input type="text" placeholder="Rechercher" class="search-input" @input="search">
            </div>
        </div>
        <div class="inventory">
            <PerfectScrollbar>
                <ul>
                    <li v-for="(inventoryItem, index) in playerStore.inventory.filter(item =>
                        selectedFilter === '' || items.find(i => i.id === item.id)?.filter === selectedFilter
                    )" :key="index" @click="clickItem(props.type, inventoryItem, 1)">
                        <Item :item="inventoryItem" @showTooltip="showTooltip" @hideTooltip="hideTooltip" />
                    </li>
                </ul>
            </PerfectScrollbar>
        </div>
    </div>




    <!-- Tooltip global -->
    <div class="global-tooltip" v-if="tooltipData"
        :style="{ left: tooltipPosition.x + 'vw', top: tooltipPosition.y + 'vh' }">
        <div class="bottom">
            <div class="tooltip-title">{{ tooltipData.itemDetails.name }}</div>
            <div class="tooltip-description">{{ tooltipData.itemDetails.description }}</div>
            <div class="tooltip-bonus" v-if="tooltipData.itemDetails.bonus && tooltipData.itemDetails.bonus.length > 0">
                <div class="bonus-value" v-for="bonus in tooltipData.itemDetails.bonus" :key="bonus.name">
                    <div>{{ bonus.name }} : <span>{{ bonus.value }}</span></div>
                    <div class="bonus-duration" v-if="bonus.duration"><span>{{ bonus.duration }} </span> s</div>
                </div>
            </div>
            <div class="tooltip-malus" v-if="tooltipData.itemDetails.malus && tooltipData.itemDetails.malus.length > 0">
                <div class="malus-value" v-for="malus in tooltipData.itemDetails.malus" :key="malus.name">
                    <div>{{ malus.name }} : <span>{{ malus.value }}</span></div>
                    <div class="malus-duration" v-if="malus.duration"><span>{{ malus.duration }} </span> s</div>
                </div>
            </div>
            <div class="tooltip-stats">
                <div class="stat" v-if="false">
                    <div class="stat-label">Qualité</div>
                    <div class="stat-value"><span>{{ tooltipData.item.quality }} </span> %</div>
                </div>
                <div class="stat" v-if="tooltipData.item.category === 4">
                    <div class="stat-label">Durabilité</div>
                    <div class="stat-value"><span>{{ tooltipData.item.durability }} </span> /100</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Poids</div>
                    <div class="stat-value"><span>{{ tooltipData.itemDetails.weight / 1000 }} </span> kg</div>
                </div>
                <div class="stat">
                    <div class="stat-label"></div>
                    <div class="stat-value">Total <span>{{ (tooltipData.itemDetails.weight / 1000 *
                        tooltipData.item.quantity).toFixed(2) }} </span> kg</div>
                </div>
            </div>
            <div class="tooltip-tags" v-if="tooltipData.item.tags && tooltipData.item.tags.length > 0">
                <div class="tag" v-for="tagId in tooltipData.item.tags" :key="tagId">
                    {{ tags[tagId]?.name }}
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="scss" scoped>
$font-family-primary: 'Special Elite', serif;
$color-gold: #805f07;
$color-gold-light: #a8854d;
$color-text-dark: #442c1a;
$color-red: #6d1f1f;
$color-red-hover: #932020;
$color-text-light: #f5e6c9;
$animation-timing: 0.6s ease-out;

.bag {
    position: absolute;
    top: calc(50% - 23vw);
    left: 4vw;
    width: 26vw;
    height: 34vw;
    background-image: url(/images/player/player-inventory.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .filter {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 5vw;
        left: 1vw;
        right: 1vw;
    }

    .select-container {
        position: relative;
        width: auto;
        min-width: 12vw;
        max-width: 15vw;
    }

    .filter-container {
        background-color: #291b12;
        border: 3px solid #4b2d17;
        border-radius: 500px;
        display: flex;
        gap: 0.5vw;
        box-shadow: inset 0 0px 2px 2px rgb(0 0 0 / 30%), 0 0px 2px 2px rgb(0 0 0 / 30%);
    }

    .filter-button {
        background-color: transparent;
        border: none;
        border-radius: 50%;
        width: 2vw;
        height: 2vw;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        svg {
            color: #d9bb74;
        }

        &:hover {
            background-color: rgba(168, 133, 77, 0.2);

            .tooltip {
                opacity: 1;
            }
        }

        &.active {
            background-color: rgba(168, 133, 77, 0.4);
            box-shadow: 0 0 0.4vw rgba(255, 215, 0, 0.5);
        }

        .tooltip {
            position: absolute;
            bottom: -2.2vw;
            left: 50%;
            transform: translateX(-50%) translateY(-0.5vw);
            min-width: 5vw;
            background-color: rgba(30, 20, 10, 0.9);
            color: #d9bb74;
            font-size: 0.7vw;
            padding: 0.3vw 0.6vw;
            border-radius: 0.2vw;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            font-family: $font-family-primary;
            text-align: center;
            white-space: nowrap;
            z-index: 1000;
            border: 0.05vw solid rgba(255, 215, 0, 0.3);
            box-shadow: 0 0 0.4vw rgba(0, 0, 0, 0.5);
            text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);

            &:before {
                content: '';
                position: absolute;
                top: -0.4vw;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0.2vw;
                border-style: solid;
                border-color: transparent transparent rgba(30, 20, 10, 0.9) transparent;
            }
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0.8;
            transition: all 0.3s ease;

            &:hover {
                opacity: 1;
            }
        }
    }

    .filter-button:hover {
        background-color: transparent;
    }

    .filter-button i {
        color: #f3e2c7;
        font-size: 16px;
    }

    .inventory {
        position: absolute;
        top: 8vw;
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
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.8vw;
            padding: 1.5vw 1vw 2vw;

            li {

                width: 100%;
                height: 100%;
                background-image: url(/images/player/player-inventory-bg_item.png);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                box-shadow: inset 0 -0.05vw 0.2vw 0.05vw rgba(0, 0, 0, 0.59);
                border-radius: 0.25vw;
                aspect-ratio: 1;
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
                cursor: pointer;

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 0.4vw 0.1vw rgba(255, 215, 0, 0.3);
                }

                &:active {
                    transform: scale(0.95);
                }

            }
        }
    }
}

.global-tooltip {
    position: absolute;
    z-index: 100000;

    &:before {
        display: none;
        content: '';
        position: absolute;
        left: -0.5vw;
        top: 30%;
        border-width: 0.5vw 0.5vw 0.5vw 0;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.85) transparent transparent;
    }

    .bottom {
        width: 14vw;
        background-color: rgba(0, 0, 0, 0.85);
        border: 0.05vw solid rgba(255, 215, 0, 0.4);
        color: #f5e6c9;
        padding: 1vw;
        border-radius: 0.25vw;
        z-index: 100000;
        box-shadow: 0 0 0.5vw rgba(0, 0, 0, 0.5);
        font-family: "Special Elite", serif;
        pointer-events: none;
        position: relative;
        background-image: url(/images/player/player-inventory-bg_item.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        .tooltip-title {
            font-size: 1.2vw;
            font-weight: bold;
            color: #d9bb74;
            margin-bottom: 0.5vw;
            text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);
            border-bottom: 0.05vw solid rgba(255, 215, 0, 0.2);
            padding-bottom: 0.3vw;
        }

        .tooltip-description {
            font-size: 1vw;
            margin-bottom: 1vw;
            line-height: 1.4;
            font-weight: 100;
            color: #f5e6c9;
        }

        .tooltip-bonus {
            margin-bottom: 0.5vw;

            .bonus-value {
                font-size: 0.7vw;
                color: #a8854d;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    color: #00ff00;
                }
            }

            .bonus-duration {
                font-size: 0.7vw;
                color: #fff;
            }
        }

        .tooltip-malus {
            margin-bottom: 0.5vw;

            .malus-value {
                font-size: 0.7vw;
                color: #a8854d;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    color: #ff0000;
                }
            }

            .malus-duration {
                font-size: 0.7vw;
                color: #fff;
            }
        }

        .tooltip-stats {
            margin-bottom: 0.5vw;

            .stat {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.2vw;

                .stat-label {
                    font-size: 0.7vw;
                    color: #a8854d;
                }

                .stat-value {
                    font-size: 0.7vw;
                    color: #bb9a66;

                    span {
                        color: white;
                    }
                }
            }
        }

        .tooltip-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3vw;

            .tag {
                font-size: 1vw;
                background-color: $color-red;
                color: #ffffff;
                padding: 0.35vw 0.4vw 0.1vw 0.4vw;
                border-radius: 0.15vw;
            }
        }
    }
}

.select-container {
    position: relative;
    width: 100%;

    .custom-select {
        width: 100%;
        padding: 0.5vw 2vw 0.5vw 1vw;
        font-family: $font-family-primary;
        font-size: 1vw;
        color: #d9bb74;
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d9bb74'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.5vw center;
        background-size: 1.5vw;
        box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);

        &:hover {
            border-color: #6d3d27;
            background-color: #3a2318;
        }

        &:focus {
            outline: none;
            border-color: #d9bb74;
            box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
        }

        option {
            background-color: #291b12;
            color: #d9bb74;
            padding: 0.5vw;

            &:hover {
                background-color: #3a2318;
            }
        }
    }
}

// Styles personnalisés pour Multiselect
:deep(.multiselect) {
    width: 100%;
    background-color: #291b12;
    border: 0.15vw solid #4b2d17;
    border-radius: 0.5vw;
    min-height: 2.5vw;
    font-family: $font-family-primary;
    font-size: 1vw;
    color: #d9bb74;
    box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
        border-color: #6d3d27;
        background-color: #3a2318;
    }

    &.is-active {
        border-color: #d9bb74;
        box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
    }

    .multiselect-dropdown {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        box-shadow: 0 0.2vw 0.5vw rgba(0, 0, 0, 0.5);
        margin-top: 0.2vw;

        // Style de la barre de défilement
        &::-webkit-scrollbar {
            width: 0.4vw;
            background-color: #291b12;
        }

        &::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4b2d17, #6d3d27);
            border-radius: 0.2vw;
            border: 0.05vw solid #291b12;
            box-shadow: inset 0 0 0.2vw rgba(0, 0, 0, 0.5);
        }

        &::-webkit-scrollbar-track {
            background-color: #291b12;
            border-radius: 0.2vw;
            box-shadow: inset 0 0 0.2vw rgba(0, 0, 0, 0.3);
        }

        // Pour Firefox
        scrollbar-width: thin;
        scrollbar-color: #4b2d17 #291b12;
    }

    .multiselect-option {
        padding: 0.5vw 1vw;
        color: #d9bb74;
        font-family: $font-family-primary;
        font-size: 1vw;
        transition: all 0.2s ease;

        &:hover {
            background-color: #3a2318;
        }

        &.is-selected {
            background-color: rgba(168, 133, 77, 0.4);
            color: #fff6dc;
        }

        .option-content {
            display: flex;
            align-items: center;
            gap: 0.5vw;

            .option-icon {
                width: 1.2vw;
                height: 1.2vw;
                object-fit: contain;
            }
        }
    }

    .multiselect-search {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        color: #d9bb74;
        font-family: $font-family-primary;
        font-size: 1vw;
        padding: 0.5vw;
        margin: 0.5vw;
        width: calc(100% - 1vw);
        border-radius: 0.25vw;

        &:focus {
            outline: none;
            border-color: #d9bb74;
            box-shadow: 0 0 0.2vw rgba(217, 187, 116, 0.5);
        }
    }

    .multiselect-single-label {
        display: flex;
        align-items: center;
        gap: 0.5vw;
        padding: 0.5vw;

        img {
            width: 1.2vw;
            height: 1.2vw;
            object-fit: contain;
        }
    }

    .multiselect-caret {
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d9bb74'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 1.5vw;
        width: 1.5vw;
        height: 1.5vw;
        margin-right: 0.5vw;
    }
}

.filter1 {
    position: absolute;
    top: 8vw;
    left: 1vw;
    right: 1vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;

    .filter-container {
        background-color: #291b12;
        border: 0.15vw solid #4b2d17;
        border-radius: 0.5vw;
        padding: 0.5vw;
        display: flex;
        gap: 1vw;
        box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);

        .filter-group {
            display: flex;
            align-items: center;
            gap: 0.5vw;

            .filter-label {
                color: #d9bb74;
                font-family: $font-family-primary;
                font-size: 0.9vw;
            }

            .filter-buttons {
                display: flex;
                gap: 0.2vw;

                .filter-button {
                    background: none;
                    border: none;
                    padding: 0.2vw;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;

                    svg {
                        width: 1vw;
                        height: 1vw;
                        color: #d9bb74;
                    }

                    &:hover {
                        svg {
                            color: #fff6dc;
                        }
                    }
                }
            }
        }

        .search-input {
            background: none;
            border: none;
            color: #d9bb74;
            font-family: $font-family-primary;
            font-size: 0.9vw;
            width: 8vw;
            padding: 0.2vw 0.5vw;

            &::placeholder {
                color: #a8854d;
            }

            &:focus {
                outline: none;
            }
        }
    }
}
</style>
