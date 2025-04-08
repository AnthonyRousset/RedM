// gérer les actions bancaires sur plusieurs banques (ex : dépot, retrait, coffre, assurance, etc.)
// vault items : { name: 'item', amount: 0 }
// insurance service ( assurance armes, assurances cheval, assurances santé) 
import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
    state: () => ({
        isLoading: true,
        id: 'nodata',
        exist: false,
        account: 9999, // cents (100 = 1$)
        stock: [
            {
                id: 'weapon_lancaster_rifle',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [0],
                category: 0
            },
            {
                id: 'drug_cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [2],
                category: 0
            }
        ],
        insurance: {
            weapons: {
                active: false,
                price: 0,
                malus: 0
            },
            horse: {
                active: false,
                price: 0,
                malus: 0
            },
            health: {
                active: false,
                price: 0,
                malus: 0
            }
        },
        inventory: [],
        balance: 0,
        stocks: [],
        entity: 'nodata',
        open: false,
        lastActiveTab: 'account'
    }),
    actions: {
        update(data) {
            console.log('update', data)
            this.balance = data.balance || 0
            this.inventory = data.items || []
            this.stocks = data.stocks || []
            this.id = data.id || 'nodata'
            this.entity = data.entity || 'nodata'            //this.stock = data.stock
            //this.insurance = data.insurance
            //this.stock = data.stock
            /*
            if (this.banks.length === 0) {
                this.banks.push(data)
            } else {
                if (this.banks.find(bank => bank.id === data.id)) {
                    this.banks = this.banks.map(bank => bank.id === data.id ? data : bank)
                } else {
                    this.banks.push(data)
                }
            }*/
        },
        createSuccess(data) {
            console.log('createSuccess', data)
            if (this.id === data.id) {
                this.exist = true
            }

            /*const bank = {  
                id: data.id,
                name: "Banque",
                account: 0,
                stock: data.stock   
            }
            this.banks.push(bank)*/
        },
        setLastActiveTab(tab) {
            this.lastActiveTab = tab
        }
    },
    getters: {
        getBankAccountIsCreated(state) {
            return state.exist
            //return state.banks.find(bank => bank.id === state.currentBank)
        },
        getBalanceDollars(state) {
            return Math.floor(state.account / 100)
            //return state.banks.find(bank => bank.id === state.currentBank).account
        }
    }
})  