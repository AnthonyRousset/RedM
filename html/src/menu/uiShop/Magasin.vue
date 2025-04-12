<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useShopStore } from '../../stores/shopStore';
import { useUiStore } from '../../stores/uiStore';
import { usePlayerStore } from '../../stores/playerStore';

import itemsData from '../../data/items.json'
import Inventory from '../components/inventory.vue'
import QuantityModal from '../components/QuantityModal.vue'
import Item from '../components/item.vue'
import ModalSell from './magasin/ModalSell.vue'
import ModalBuy from './magasin/ModalBuy.vue'


const uiStore = useUiStore();
const shopStore = useShopStore();



const items = ref(itemsData.items)
const tags = ref(itemsData.tags)
const JSONfilters = ref(itemsData.filters.filter(filter => filter.activate)) // seulement les activate = true 

const selectedFilter = ref('');
const refreshKey = ref(0); // Clé de rafraîchissement pour forcer le rendu
const searchValue = ref('');
const quantitySell = ref(false);
const quantityBuy = ref(false);
const selectedItem = ref(null);
const switchShop = ref('buy');

// Copie locale de l'inventaire pour éviter de modifier le tableau original
const localStock = ref([]);
const error = ref('')
    

// Initialiser la copie locale
onMounted(() => {
    localStock.value = [...shopStore.stock]

    // Écouter les événements pour fermer le modal
    window.addEventListener('close-inventory-modal', () => {
        quantitySell.value = false;
        quantityBuy.value = false;
    });
});
// Mettre à jour la copie locale lorsque l'inventaire change
watch(() => shopStore.stock, (newStock) => {
    localStock.value = [...newStock];
}, { deep: true });

// Inventaire filtré
const filteredStock = computed(() => {
    return localStock.value.filter(item => {

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

// Ouvre le modal d'achat pour un article
const buyItem = (item) => {
    console.log('Achat', item)
    if (item.quantity > 1) {
        window.dispatchEvent(new Event('close-inventory-modal'))
        uiStore.closeInventoryModal = true
        selectedItem.value = item
        quantityBuy.value = true
        console.log('quantityBuy', quantityBuy.value)
    } else {
        processBuy(item, 1)
    }
}

// Achat d'un article
const processBuy = (item, quantity) => {
    // Logique d'achat
    console.log('Achat de', quantity, 'unité(s) de', item.name)
    // Ici, vous pouvez ajouter la logique pour envoyer l'achat au serveur
}

// Ouvre le modal de vente pour un article
const sellItem = (item) => {
    console.log('Vendre', item)
    if (item.quantity > 1) {
        selectedItem.value = item
        quantitySell.value = true
        uiStore.closeInventoryModal = true
        window.dispatchEvent(new Event('close-inventory-modal'))
        console.log('quantitySell', quantitySell.value)
    } else {
        processSell(item, 1)
    }
}

// Vente d'un article
const processSell = (item, quantity) => {
    // Logique de vente
    console.log('Vente de', quantity, 'unité(s) de', item.name)
    // Ici, vous pouvez ajouter la logique pour envoyer la vente au serveur
}

function search() {
    refreshKey.value++
}

</script>

<template>
    <div class="shop-magasin" v-if="switchShop === 'buy'">
        <div class="title">
            <span>General store</span>
        </div>
        <div class="filters">
            <div class="categories">
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
            <div class="search">
                <input type="text" placeholder="Rechercher" class="search-input" @input="search" v-model="searchValue">
            </div>
        </div>
        <div class="items">
            <PerfectScrollbar>
                <ul>
                    <li v-for="(item, index) in filteredStock" :key="item.id + '-' + index + '-' + refreshKey"
                        @click="buyItem(item)"
                        v-show="shopStore.inItemCatalogue(item)">
                        <Item type="shop" :sellQuantity="item.quantity" :sellPrice="item.sellPrice" :item="item" @showTooltip="showTooltip" @hideTooltip="hideTooltip" />
                    </li>
                </ul>
            </PerfectScrollbar>
        </div>
        <div class="gotosell" @click="switchShop = 'sell'">
            <span>Vendre</span>
        </div>
    </div>
    <div class="shop-magasin" v-if="switchShop === 'sell'">
        <div class="title">
            <span>General store</span>
        </div>
        <div class="filters">
            <div class="categories">
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
            <div class="search">
                <input type="text" placeholder="Rechercher" class="search-input" @input="search" v-model="searchValue">
            </div>
        </div>
        <div class="items">
            <PerfectScrollbar>
                <ul>
                    <li v-for="(item, index) in filteredStock" :key="item.id + '-' + index + '-' + refreshKey"
                        @click="sellItem(item)" 
                        v-show="shopStore.inItemCatalogue(item)">
                        <Item type="shop" :buyQuantity="shopStore.getBuyQuantity(item)" :buyPrice="shopStore.getBuyPrice(item)" :item="item" @showTooltip="showTooltip" @hideTooltip="hideTooltip" />
                    </li>
                </ul>
            </PerfectScrollbar>
        </div>
        <div class="gotosell" @click="switchShop = 'buy'">
            <span>Acheter </span>
        </div>
    </div>

    <!-- Modal de vente -->
    <ModalSell v-if="quantitySell" :item="selectedItem" @close="quantitySell = false" @confirm="processSell" />

    <!-- Modal d'achat -->
    <ModalBuy v-if="quantityBuy" :item="selectedItem" @close="quantityBuy = false" @confirm="processBuy" />

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

@mixin filter-container {
    border-radius: 500px;
    overflow: hidden;
    background-color: #29160ab8;
    border: 0.15vw solid #4b2d17;
    padding: 0.3vw;
    display: flex;
    box-shadow: inset 0 0.05vw 0.2vw rgba(0, 0, 0, 0.3);
}

.shop-magasin {
    position: relative;
    width: 58vw;
    top: 1vw;
    height: 38.1vw;
    background-image: url(/images/shop/shop-bg-sellbuy2.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .title {
        font-family: 'Rustler', 'Wantedo', 'Bevan', 'IM Fell English SC', 'Special Elite', 'Oswald', sans-serif;
        font-size: 2.5vw;
        letter-spacing: 0.2vw;
        color: #ffffffe7;
        text-align: center;
        font-weight: 100;
        margin-top: 2vw;

        span {
            position: relative;
            z-index: 1;
            top: -1.5vw;
        }

        &::after {
            content: '';
            position: absolute;
            top: -4vw;
            left: 50%;
            width: 23vw;
            height: 10vw;
            transform: translateX(-50%);
            z-index: 0;
            background-image: url(/images/shop/shop-bg-welcome.png);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
        }
    }

    .filters {
        display: flex;
        justify-content: center;
        margin-top: 1vw;
        gap: 2vw;

        .categories {
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

        .search {
            @include filter-container;
            border-radius: 500px;
            padding: 0.65vw 0;
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


    .items {
        position: absolute;
        top: 9vw;
        left: 2vw;
        right: 2vw;
        bottom: 2vw;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);

        .item {
            position: relative;
            width: 100%;
            height: 90%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding-bottom: 10%;
        }
        .price {
            bottom: 0;
            right: 0;
            background-color: rgb(0 0 0 / 28%);
            color: white;
        }
        .ps {
            max-height: 100%;
        }

        ul {
            max-height: 100%;
            list-style: none;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 0.8vw;
            padding: 1.5vw 0.5vw 1.5vw;

            li {
                width: 100%;
                height: 100%;
                background-color: #0000006c;
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
</style>