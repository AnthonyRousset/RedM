<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

import { useUiStore } from '../../stores/uiStore'
import { useBankStore } from '../../stores/bankStore'
import { sendNui } from '../../utils/nui'

import Item from './item.vue'
import itemsData from '../../data/items.json'
import QuantityModal from './QuantityModal.vue'

const props = defineProps({
    inventory: {
        type: Array,
        required: true
    },
    idEntity: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const items = ref(itemsData.items)
const tags = ref(itemsData.tags)
const JSONfilters = ref(itemsData.filters.filter(filter => filter.activate)) // seulement les activate = true 

const selectedFilter = ref('');
const weightOrder = ref('');
const quantityOrder = ref('');
const refreshKey = ref(0); // Clé de rafraîchissement pour forcer le rendu
const isReordering = ref(false); // Pour bloquer temporairement les tooltips
const searchValue = ref('');
const quantityModal = ref(false);
const selectedItem = ref(null);

// Copie locale de l'inventaire pour éviter de modifier le tableau original
const localInventory = ref([]);
const error = ref('')

const uiStore = useUiStore()
const bankStore = useBankStore()
// Initialiser la copie locale
onMounted(() => {
    localInventory.value = [...props.inventory];

    if (props.type === 'player') {
        console.log('player-inventory', props.inventory)
        error.value = ''
    }
    if (props.type === 'bank') {
        error.value = 'Pardi ! J\'ai pas assez de ces objets pour faire cette transaction !'
    }
    if (props.type === 'vendor') {
        error.value = 'la quantiter est supérieure à la quantiter max'
    }

    // Écouter les événements pour fermer le modal
    window.addEventListener('close-inventory-modal', () => {
        quantityModal.value = false;
    });
});

// Mettre à jour la copie locale lorsque l'inventaire change
watch(() => props.inventory, (newInventory) => {
    localInventory.value = [...newInventory];
}, { deep: true });

// Inventaire filtré
const filteredInventory = computed(() => {
    return localInventory.value.filter(item => {

        // Vérifier le filtre
        const itemData = items.value.find(i => i.id === item.id);
        const itemFilter = itemData?.tags;

        const filterMatch = selectedFilter.value === '' ||
            (Array.isArray(itemFilter)
                ? itemFilter.includes(selectedFilter.value)
                : itemFilter === selectedFilter.value);

        // Vérifier la recherche
        const searchMatch = searchValue.value === '' ||
            (itemData?.name.toLowerCase().includes(searchValue.value.toLowerCase()));

        return filterMatch && searchMatch;
    });
});

// Gestion du tooltip global
const tooltipData = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })


// Afficher le tooltip
const showTooltip = (data) => {
    // Ne pas afficher le tooltip pendant le réordonnancement
    if (isReordering.value) return;

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

// Forcer la disparition du tooltip
const forceHideTooltip = () => {
    tooltipData.value = null
    // Attendre un court instant pour empêcher la réapparition immédiate
    setTimeout(() => {
        tooltipData.value = null
    }, 100)
}

const sortByWeight = (items) => {
    // Forcer la disparition du tooltip avant le tri
    forceHideTooltip()

    // Bloquer les tooltips pendant le tri
    isReordering.value = true;

    quantityOrder.value = '';
    switch (weightOrder.value) {
        case 'desc':
            // poids total du plus leger au plus lourd
            localInventory.value.sort((a, b) => {
                const itemA = items.find(item => item.id === a.id);
                const itemB = items.find(item => item.id === b.id);
                const weightA = (itemA?.weight / 1000 || 0) * a.quantity;
                const weightB = (itemB?.weight / 1000 || 0) * b.quantity;
                return weightA - weightB;
            });
            weightOrder.value = 'asc';
            break;
        default:
            // poids total du plus lourd au plus leger
            localInventory.value.sort((a, b) => {
                const itemA = items.find(item => item.id === a.id);
                const itemB = items.find(item => item.id === b.id);
                const weightA = (itemA?.weight / 1000 || 0) * a.quantity;
                const weightB = (itemB?.weight / 1000 || 0) * b.quantity;
                return weightB - weightA;
            });
            weightOrder.value = 'desc';
            break;
    }

    // Incrémenter la clé de rafraîchissement pour forcer le rendu
    refreshKey.value++;

    // Réactiver les tooltips après un court délai
    setTimeout(() => {
        isReordering.value = false;
    }, 300);
};

const sortByQuantity = () => {
    // Forcer la disparition du tooltip avant le tri
    forceHideTooltip()

    // Bloquer les tooltips pendant le tri
    isReordering.value = true;

    weightOrder.value = '';
    switch (quantityOrder.value) {
        case 'desc':
            console.log('desc')
            // quantite total du plus grand au plus petit
            localInventory.value.sort((a, b) => {
                return b.quantity - a.quantity;
            });
            quantityOrder.value = 'asc';
            break;
        default:
            console.log('asc')
            // quantite total du plus petit au plus grand
            localInventory.value.sort((a, b) => {
                return a.quantity - b.quantity;
            });
            quantityOrder.value = 'desc';
            break;
    }

    // Incrémenter la clé de rafraîchissement pour forcer le rendu
    refreshKey.value++;

    // Réactiver les tooltips après un court délai
    setTimeout(() => {
        isReordering.value = false;
    }, 300);
};

function search() {
    refreshKey.value++
}

const handleItemClick = (item) => {
    if (item.quantity > 1) {
        selectedItem.value = item;
        quantityModal.value = true;
        // Utiliser le uiStore pour fermer le modal de la banque
        uiStore.closeBankModal = true;
        // Déclencher un événement pour fermer le modal de la banque
        window.dispatchEvent(new Event('close-bank-modal'));
    } else {
        sendItem(item, 1);
    }
};

const handleQuantityConfirm = (quantity) => {
    if (selectedItem.value) {
        sendItem(selectedItem.value, quantity);
        selectedItem.value = null;
    }
}

const sendItem = (item, quantity) => {
    console.log('sendItem', item, quantity)
    switch (props.type) {
        case 'bank':
            console.log('bank-stock-add-' + props.idEntity, item)
            if (item.type === 'u') {
                // la banque est limité a 3 emplacements max, donc on test si c'est plein 
                if (bankStore.stock.length >= 3) {
                    // on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans ma banque !'
                    return
                }
                sendNui('bank-stock-add-' + props.idEntity, { idBank: props.idEntity, complexId: item.complexId, idItem: item.id, quantity: quantity })
            } else {
                // la banque est limité a 3 emplacements max, donc on test si c'est plein  sauf si c'est stackable et que l'objet est dans la liste 
                if (bankStore.stock.length >= 3 && !bankStore.stock.find(stock => stock.id === item.id)) {
                    // on affiche un message d'erreur
                    error.value = 'Sacré bleu ! Je ne peux pas stocker plus d\'objets dans ma banque !'
                    return
                }
                sendNui('bank-stock-add-' + props.idEntity, { idBank: props.idEntity, idItem: item.id, quantity: quantity })
            }
            break
        case 'vendor':
            console.log('vendor-stock-add-' + props.idEntity, item)
            if (item.type === 'u') {
                sendNui('vendor-stock-add-' + props.idEntity, { idVendor: props.idEntity, complexId: item.complexId, idItem: item.id, quantity: quantity })
            } else {
                sendNui('vendor-stock-add-' + props.idEntity, { idVendor: props.idEntity, idItem: item.id, quantity: quantity })
            }
            break
        case 'player':
            console.log('player-stock-add-' + props.idEntity, item)
            break
    }
}

// Gestionnaire de clic global pour masquer le tooltip
const handleGlobalClick = () => {
    if (tooltipData.value) {
        forceHideTooltip()
    }
}

// Ajouter/supprimer l'écouteur d'événement global
onMounted(() => {
    document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick)
})

</script>

<template>

    <div class="inventory">
        <div class="filter categories">
            <div class="filter-container">
                <div class="filter-group">
                    <div class="filter-label" v-for="filter in JSONfilters" :key="filter.value"
                        @click="selectedFilter = filter.value">
                        <img :src="'./images/player/' + filter.icon + '.png'" :alt="filter.name" class="filter-icon"
                            :class="{ 'active': selectedFilter === filter.value }">
                        <span class="tooltip-text">{{ filter.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--
        <div class="filter1" v-if="false">
        <div class="select-container">
                <Multiselect v-model="selectedFilter" :options="JSONfilters" :searchable="false" :close-on-select="true"
                    :preserve-search="false" placeholder="Catégorie" track-by="value" label="label" @change="filter">
                <template #option="{ option }">
                    <div class="option-content">
                            <img v-if="option.icon" :src="option.icon" :alt="option.label" class="option-icon">
                        <span>{{ option.label }}</span>
                    </div>
                </template>
</Multiselect>
</div>
</div>
-->
        <div class="filter sort">
            <div class="filter-container">
                <div class="filter-group" @click="sortByWeight(items)">
                    <div class="filter-label">
                        <img src="/images/player/player-inventory-weight.png" :class="{ 'active': weightOrder !== '' }"
                            alt="Poids" class="filter-icon">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-button" v-if="weightOrder === 'asc'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
                        <button class="filter-button" v-else-if="weightOrder === 'desc'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14l5-5 5 5z" />
                            </svg>
                        </button>
                        <button class="filter-button" v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="filter-group" @click="sortByQuantity(items)">
                    <div class="filter-label">
                        <img src="/images/player/player-inventory-quantity.png"
                            :class="{ 'active': quantityOrder !== '' }" alt="Quantité" class="filter-icon">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-button" v-if="quantityOrder === 'asc'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
                        <button class="filter-button" v-else-if="quantityOrder === 'desc'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14l5-5 5 5z" />
                            </svg>
                        </button>
                        <button class="filter-button" v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="filter-container search">
                <input type="text" placeholder="Rechercher" class="search-input" @input="search" v-model="searchValue">
            </div>
        </div>
        <div class="list-items">
            <PerfectScrollbar>
                <ul>
                    <li v-for="(item, index) in filteredInventory" :key="item.id + '-' + index + '-' + refreshKey"
                        @click="handleItemClick(item)">
                        <Item :item="item" @showTooltip="showTooltip" @hideTooltip="hideTooltip" />
                    </li>
                </ul>
            </PerfectScrollbar>
        </div>
    </div>


    <!-- quantity modal -->
    <QuantityModal v-model="quantityModal" :type="'inventory'" :error="error" title="Quantité à déposer"
        :max-quantity="selectedItem?.quantity || 0" @confirm="handleQuantityConfirm" @cancel="quantityModal = false" />



    <!-- Tooltip global -->
    <div class="global-tooltip" v-if="tooltipData"
        :style="{ left: tooltipPosition.x + 'vw', top: tooltipPosition.y + 'vh' }">
        <div class="bottom">
            <div class="tooltip-title">{{ tooltipData.itemJSON.name }}</div>
            <div class="tooltip-description">{{ tooltipData.itemJSON.description }}</div>
            <div class="tooltip-bonus" v-if="tooltipData.itemJSON.bonus && tooltipData.itemJSON.bonus.length > 0">
                <div class="bonus-value" v-for="bonus in tooltipData.itemJSON.bonus" :key="bonus.name">
                    <div>{{ bonus.name }} : <span>{{ bonus.value }}</span></div>
                    <div class="bonus-duration" v-if="bonus.duration"><span>{{ bonus.duration }} </span> s</div>
                </div>
            </div>
            <div class="tooltip-malus" v-if="tooltipData.itemJSON.malus && tooltipData.itemJSON.malus.length > 0">
                <div class="malus-value" v-for="malus in tooltipData.itemJSON.malus" :key="malus.name">
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
                    <div class="stat-value"><span>{{ tooltipData.itemJSON.weight / 1000 }} </span> kg</div>
                </div>
                <div class="stat">
                    <div class="stat-label"></div>
                    <div class="stat-value">Total <span>{{ (tooltipData.itemJSON.weight / 1000 *
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
// Variables
$font-family-primary: 'Special Elite', serif;
$color-gold: #805f07;
$color-gold-light: #a8854d;
$color-text-dark: #442c1a;
$color-red: #6d1f1f;
$color-red-hover: #932020;
$color-text-light: #f5e6c9;
$animation-timing: 0.6s ease-out;

// Mixins
@mixin filter-container {
    background-color: #291b12;
    border: 0.15vw solid #4b2d17;
    padding: 0.3vw;
    display: flex;
    box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);
}

// Main Container
.inventory {
    position: relative;
    width: 23vw;
    height: 30vw;
    background-image: url(/images/player/player-inventory.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 1.3vw;

    // Filter Components
    .filter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        left: 1vw;
        right: 1vw;

        // Categories Filter
        &.categories {
            top: 1.5vw;
            z-index: 1000;

            .filter-container {
                @include filter-container;
                border-radius: 5vw;
                width: 100%;

                .filter-group {
                    display: flex;
                    width: 100%;
                    justify-content: space-around;



                    .filter-label {
                        color: #d9bb74;
                        font-family: $font-family-primary;
                        font-size: 0.9vw;
                        position: relative;
                        cursor: pointer;
                        transition: transform 0.2s ease;

                        &:hover {

                            .tooltip-text {
                                visibility: visible;
                                opacity: 1;
                            }
                        }

                        .tooltip-text {
                            visibility: hidden;
                            position: absolute;
                            bottom: -2.5vw;
                            left: 50%;
                            transform: translateX(-50%) translateY(-0.5vw);
                            background-color: rgba(30, 20, 10, 0.9);
                            color: #d9bb74;
                            font-size: 0.8vw;
                            padding: 0.3vw 0.6vw;
                            border-radius: 0.2vw;
                            opacity: 0;
                            transition: all 0.3s ease;
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
                            display: block;
                            width: 2vw;
                            height: 2vw;
                            color: #d9bb74;
                            transition: all 0.2s ease;

                            &.active {
                                filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -webkit-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -moz-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -ms-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -o-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                            }
                        }
                    }
                }
            }
        }

        // Sort Filter
        &.sort {
            top: 5vw;

            .filter-container {
                @include filter-container;
                border-radius: 500px;
                /*
                box-shadow: inset 0 0 2px 2px rgb(0 0 0 / 30%), 0 0 2px 2px rgb(0 0 0 / 30%);
                */

                .filter-group {
                    display: flex;
                    align-items: center;

                    &:first-child {
                        border-right: 0.1vw solid #4b2d17;
                    }

                    .filter-label {
                        img {
                            display: block;
                            width: 2vw;
                            height: 2vw;

                            &.active {
                                filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -webkit-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -moz-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -ms-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                                -o-filter: brightness(1.3) drop-shadow(0 0 0.2vw rgba(255, 215, 0, 0.7));
                            }
                        }

                    }
                }
            }

            .filter-container.search {
                border-radius: 500px;
                padding: 0.65vw 0;
                width: 100%;
                overflow: auto;

                // Search Input
                .search-input {
                    background: none;
                    border: none;
                    color: #d9bb74;
                    font-family: $font-family-primary;
                    font-size: 0.9vw;
                    padding: 0.4vw 1vw 0;    
                    width: -webkit-fill-available;

                    &::placeholder {
                        color: #a8854d;
                    }

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }

    // Filter Buttons
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
            width: 1.5vw;
            height: 1.5vw;
            color: #d9bb74;
        }

        &:hover {
            svg {
                color: #fff6dc;
            }
        }

        &.active {
            background-color: rgba(168, 133, 77, 0.4);
            box-shadow: 0 0 0.4vw rgba(255, 215, 0, 0.5);
        }
    }

    // Inventory Grid
    .list-items {
        position: absolute;
        top: 8vw;
        left: 1vw;
        right: 1vw;
        bottom: 1vw;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
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
            padding: 1.5vw 0.5vw 1.5vw;

            li {
                width: 100%;
                height: 100%;
                background-image: url(/images/player/inventory-bg_item.png);
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
    position: fixed;
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
        background-image: url(/images/player/inventory-bg_item.png);
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
/*
:deep(.multiselect) {
    width: 100%;
    background-color: #291b12;
    border: 0.15vw solid #4b2d17;
    border-radius: 50vw;
    min-height: 2vw;
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

    .multiselect-clear {
        padding: 0.3vw;
    }
}
    */
</style>
