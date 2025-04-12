<script setup>
import { ref } from 'vue';

import { useShopStore } from '../../stores/shopStore';

const shopStore = useShopStore();

const shopView = ref('admin');
const currentPage = ref(1);
const totalPages = ref(5);

const prevPage = () => {
    currentPage.value--;
};
const nextPage = () => {
    currentPage.value++;
};

const goToPage = (page) => {
    currentPage.value = page;
    // ajouter le sons page-turn.mp3 
    const audio = new Audio('../../../public/sounds/page-turn.mp3');
    audio.volume = 1;
    audio.loop = false;
    audio.muted = false;
    audio.load();
    audio.play();
};

</script>

<template>
    <div class="shop-admin" v-if="shopView === 'admin'">
        <div class="shop-admin-container">
            <div class="pages-container">
                <div class="page" v-if="currentPage === 1">
                    <!-- Page 1 : Solde du magasin -->
                    <div class="left">
                        <div class="shop-admin-balance">
                            <h3>Solde du magasin</h3>
                            <div class="balance-amount">
                                <span class="label">Total :</span>
                                <span class="amount">{{ shopStore.balance }}$</span>
                            </div>
                            <div class="balance-actions">
                                <button class="deposit" @click="handleDeposit">Déposer</button>
                                <button class="withdraw" @click="handleWithdraw">Retirer</button>
                            </div>
                        </div>
                    </div>

                    <!-- Page 2 : Les employés -->
                    <div class="right">
                        <div class="shop-admin-employees">
                            <h3>Liste des employés</h3>
                            <div class="employees-list">
                                <div v-for="employee in shopStore.employees" :key="employee.id" class="employee-card">
                                    <span class="name">{{ employee.name }}</span>
                                    <span class="role">{{ employee.role }}</span>
                                    <span class="salary">{{ employee.salary }}$/jour</span>
                                    <div class="actions">
                                        <button
                                            @click="handleEmployeeAction(employee.id, 'promote')">Promouvoir</button>
                                        <button @click="handleEmployeeAction(employee.id, 'fire')">Licencier</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="turn-right" @click="goToPage(2)">
                            <span>Liste des clients →</span>
                        </div>
                    </div>
                </div>

                <div class="page" v-if="currentPage === 2">
                    <!-- Page 3 : Liste des clients -->
                    <div class="left">
                        <div class="shop-admin-clients">
                            <h3>Liste des clients</h3>
                            <div class="clients-list">
                                <div v-for="client in shopStore.clients" :key="client.id" class="client-card">
                                    <span class="name">{{ client.name }}</span>
                                    <span class="purchases">Achats : {{ client.totalPurchases }}$</span>
                                    <span class="last-visit">Dernière visite : {{ client.lastVisit }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="turn-left" @click="goToPage(1)">
                            <span>← Liste des employés</span>
                        </div>
                    </div>

                    <!-- Page 4 : Liste des commandes -->
                    <div class="right">
                        <div class="shop-admin-orders">
                            <h3>Liste des commandes</h3>
                            <div class="orders-list">
                                <div v-for="order in shopStore.orders" :key="order.id" class="order-card">
                                    <span class="id">Commande #{{ order.id }}</span>
                                    <span class="client">{{ order.clientName }}</span>
                                    <span class="amount">{{ order.amount }}$</span>
                                    <span class="status" :class="order.status">{{ order.status }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="turn-right" @click="goToPage(3)">
                            <span>Machine de coton →</span>
                        </div>
                    </div>
                </div>

                <div class="page" v-if="currentPage === 3">
                    <!-- Page 5 : Machine de coton -->
                    <div class="left">
                        <div class="shop-admin-cotton">
                            <h3>Machine de coton</h3>
                            <div class="cotton-stats">
                                <div class="stat">
                                    <span class="label">Production journalière :</span>
                                    <span class="value">{{ shopStore.cottonProduction }}/jour</span>
                                </div>
                                <div class="stat">
                                    <span class="label">Stock actuel :</span>
                                    <span class="value">{{ shopStore.cottonStock }} unités</span>
                                </div>
                                <div class="stat">
                                    <span class="label">Prix de vente :</span>
                                    <span class="value">{{ shopStore.cottonPrice }}$/unité</span>
                                </div>
                            </div>
                            <div class="cotton-actions">
                                <button @click="handleCottonAction('start')">Démarrer la production</button>
                                <button @click="handleCottonAction('stop')">Arrêter la production</button>
                                <button @click="handleCottonAction('sell')">Vendre le stock</button>
                            </div>
                        </div>
                        <div class="turn-left" @click="goToPage(2)">
                            <span>← Liste des commandes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shop-admin {
    width: 73vw;
    height: 60vw;
    background-image: url('/images/shop/shop-bg-gestion.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
}


.shop-admin-container {
    top: 2vw;
    right: 11vw;
    left: 8.5vw;
    bottom: 5vw;
    position: absolute;

    .pages-container {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: transform 0.3s ease;

        .page {
            flex: 0 0 100%;
            display: flex;

            .left {
                left: 0vw;
                position: absolute;
                width: 21vw;
                top: 3vw;
                height: calc(100% - 8vw);
                padding: 1vw;
            }

            .right {
                right: 0vw;
                position: absolute;
                width: 23vw;
                top: 3vw;
                height: calc(100% - 8vw);
                padding: 1vw;
            }
        }
        
    }

    .shop-admin-pagination {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;

        button {
            padding: 5px 10px;
            border: 1px solid #8B4513;
            background: transparent;
            color: #8B4513;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover:not(:disabled) {
                background: #8B4513;
                color: #FFF;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }

    .shop-admin-balance,
    .shop-admin-employees,
    .shop-admin-clients,
    .shop-admin-orders,
    .shop-admin-cotton {

        h3 {
            color: #8B4513;
            margin-bottom: 15px;
            text-align: center;
        }
    }

    .balance-amount {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .amount {
            font-size: 24px;
            color: #8B4513;
            font-weight: bold;
        }
    }

    .balance-actions {
        display: flex;
        gap: 10px;

        button {
            flex: 1;
            padding: 10px;
            border: 1px solid #8B4513;
            background: transparent;
            color: #8B4513;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: #8B4513;
                color: #FFF;
            }
        }
    }

    .employees-list,
    .clients-list,
    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 400px;
        overflow-y: auto;
    }

    .employee-card,
    .client-card,
    .order-card {
        background: rgba(139, 69, 19, 0.1);
        padding: 15px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .actions {
            display: flex;
            gap: 5px;

            button {
                padding: 5px 10px;
                border: 1px solid #8B4513;
                background: transparent;
                color: #8B4513;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    background: #8B4513;
                    color: #FFF;
                }
            }
        }
    }

    .cotton-stats {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;

        .stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: rgba(139, 69, 19, 0.1);
            border-radius: 4px;

            .value {
                color: #8B4513;
                font-weight: bold;
            }
        }
    }

    .cotton-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;

        button {
            padding: 10px;
            border: 1px solid #8B4513;
            background: transparent;
            color: #8B4513;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: #8B4513;
                color: #FFF;
            }
        }
    }

    .turn-left,
    .turn-right {
        position: absolute;
        bottom: 20px;
        padding: 10px 20px;
        background: rgba(139, 69, 19, 0.7);
        color: #FFF;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: #8B4513;
        }
    }

    .turn-left {
        left: 50%;
        transform: translateX(-50%);
    }

    .turn-right {
        right: 50%;
        transform: translateX(50%);
    }
}
</style>