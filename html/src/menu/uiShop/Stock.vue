<script setup>
/*
shop-stock-add-uniq-{ID}	{ id: string, complexId: string, shopId: string }
shop-stock-add-stack-{ID}	{ id: string, amount: int, shopId: string }
shop-stock-remove-uniq-{ID}	{ id: string, complexId: string, shopId: string }
shop-stock-remove-stack-{ID}	{ id: string, amount: int, shopId: string }
*/
import { ref, onMounted, onUnmounted } from 'vue';
import Inventory from '../components/inventory.vue';
import QuantityModal from '../components/QuantityModal.vue';
import { useShopStore } from '../../stores/shopStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useUiStore } from '../../stores/uiStore';

const shopStore = useShopStore();
const playerStore = usePlayerStore();
const uiStore = useUiStore();

const quantityModalIsOpen = ref(false);
const selectedItem = ref(null);

const checkStock = (item) => {
    if (item.quantity > 1) {
        selectedItem.value = item;
        quantityModalIsOpen.value = true;
        // Utiliser le uiStore pour fermer le modal de l'inventaire
        uiStore.closeInventoryModal = true;
        // Déclencher un événement pour fermer le modal de l'inventaire
        window.dispatchEvent(new Event('close-inventory-modal'));
    } else {
        shopstockToInventory(item, 1);
    }
};

const handleQuantityConfirm = (quantity) => {
    if (selectedItem.value) {
        shopstockToInventory(selectedItem.value, quantity);
        selectedItem.value = null;
    }
};

const inventoryToShopstock = (item, quantity) => {
    console.log('inventoryToShopstock', item, quantity);
    if (item.type === 'u') {
        shopStore.sendNuiAddStockUniq({ complexId: item.complexId });
    } else {
        shopStore.sendNuiAddStockStack({ idItem: item.id, quantity: quantity });
    }
};

const shopstockToInventory = (item, quantity) => {
    console.log('shopstockToInventory', item, quantity);
    if (item.type === 'u') {
        shopStore.sendNuiRemoveStockUniq({ complexId: item.complexId });
    } else {
        shopStore.sendNuiRemoveStockStack({ idItem: item.id, quantity: quantity });
    }
};

// Écouter les événements pour fermer le modal
onMounted(() => {
    window.addEventListener('close-shop-modal', () => {
        quantityModalIsOpen.value = false;
    });
});

onUnmounted(() => {
    window.removeEventListener('close-shop-modal', () => {
        quantityModalIsOpen.value = false;
    });
});
</script>

<template>
    <div class="shop-stock">
        <div class="bag">
            <Inventory 
                :idEntity="shopStore.id" 
                :inventory="playerStore.inventory" 
                @itemSelected="inventoryToShopstock"
                to="shop" 
            />
        </div>
        <img src="/images/circle-arrows-left-right.png" alt="" class="circle-arrows-left-right">
        <div class="stock">
            <div class="emplacements">
                <PerfectScrollbar>
                    <ul>
                        <li v-for="index in 25" :key="index" 
                            :class="{ 'empty': !shopStore.stock[index - 1] }"
                            @click="checkStock(shopStore.stock[index - 1])"
                        >
                            <img v-if="shopStore.stock && shopStore.stock[index - 1]"
                                :src="'/images/items/' + shopStore.stock[index - 1].id + '.png'" alt="">
                            <div v-if="shopStore.stock && shopStore.stock[index - 1]" class="quantity">
                                {{ shopStore.stock[index - 1]?.quantity }}
                            </div>
                        </li>
                    </ul>
                </PerfectScrollbar>
            </div>
            <div class="information">
                Seulement 25 objets sont stockables dans le stock.
            </div>
        </div>
    </div>

    <QuantityModal
        v-model="quantityModalIsOpen"
        to="shop" 
        person="Marchand" 
        title="Quantité à retirer" 
        :item="selectedItem"
        @confirm="handleQuantityConfirm" 
        @cancel="quantityModalIsOpen = false" 
    />
</template>

<style scoped>
.shop-stock {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    >img {
        width: 7vw;
        height: 7vw;
    }

    .bag {
        position: absolute;
        top: calc(50% - 18vw);
        left: 13vw;
    }

    .stock {
        position: absolute;
        top: calc(50% - 18vw);
        right: 19vw;
        width: 23vw;
        height: 37.2vw;
        background-image: url(/images/shop/shop-bg-stock.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        .emplacements {
            position: absolute;
            bottom: 4.5vw;
            top: 1vw;
            mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);

            .ps {
                max-height: 100%;
            }

            ul {
                height: 100%;
                list-style: none;
                margin: 0 2vw;
                padding: 0;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1vw;
                width: calc(100% - 4vw);
                padding-top: 1vw;
                padding-bottom: 2vw;

                li {
                    background-color: rgb(0 0 0 / 40%);
                    box-shadow: inset 0 0 0.5vw 0.1vw rgba(0, 0, 0, 0.59);
                    border-radius: 0.25vw;
                    display: flex;
                    position: relative;
                    justify-content: center;
                    transition: all 0.2s ease;
                    aspect-ratio: 1;


                    &:not(.empty) {
                        cursor: pointer;

                        &:hover {
                            box-shadow: 0 0 0.5vw 0.1vw rgba(255, 215, 0, 0.3);
                            border-color: rgba(255, 215, 0, 0.4);
                        }
                    }

                    img {
                        width: 80%;
                        height: 100%;
                        object-fit: contain;
                    }

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
        }

        .information {
            position: absolute;
            bottom: 1.5vw;
            left: 0;
            padding: 0 2.5vw;
            width: 18vw;
            text-align: center;
            font-size: 0.9vw;
            color: #d9bb74;
            text-shadow: 0.05vw 0.05vw 0.1vw rgba(0, 0, 0, 0.8);
        }
    }

}
</style>