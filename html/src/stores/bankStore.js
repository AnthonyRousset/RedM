// gérer les actions bancaires sur plusieurs banques (ex : dépot, retrait, coffre, assurance, etc.)
// vault items : { name: 'item', amount: 0 }
// insurance service ( assurance armes, assurances cheval, assurances santé) 

// bank-deposit-{ID}	{ id: string , amount: int }
// bank-withdraw-{ID}	{ id: string , amount: int }
// bank-createAccount-{ID}	{ id: string }
// bank-close-{ID}	{ id: string }
// bank-stock-add-{ID}	{ idBank: string,complexId:string, idItem: string,quantity: int}
// bank-stock-remove-{ID}	{ idBank: string,complexId:string, idItem: string,quantity: int}

import { defineStore } from 'pinia'
import { sendNui } from '../utils/nui'

export const useBankStore = defineStore('bank', {
    state: () => ({
        isLoading: true,
        id: 'nodata',
        exist: false, // si le joueur a un compte ouvert
        account: 9999, // cents en banque (100 = 1$)
        stock: [
            {
                id: 'weapon_lancaster_rifle',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [0],
                type: 's',
                category: 0
            },
            {
                id: 'drug_cocaine',
                quantity: 2,
                quality: 100,
                weight: 1,
                tags: [2],
                type: 's',
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
        balance: 0,
        open: false,
        lastActiveTab: 'account'
    }),
    actions: {
        update(data) {
            console.log('bankStore > update()', data)
            this.id = data.id || this.id
            this.balance = data.balance || this.balance 
            this.stock = data.stock || this.stock
            this.entity = data.entity || this.entity
            this.insurance = data.insurance || this.insurance
            this.open = data.open || this.open
            this.lastActiveTab = data.lastActiveTab || this.lastActiveTab
            this.exist = data.exist || this.exist
            this.account = data.account || this.account
            this.isLoading = data.isLoading || this.isLoading
                

            //this.insurance = data.insurance
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
            console.log('bankStore > createSuccess()', data)
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
            console.log('bankStore > setLastActiveTab()', tab)
            this.lastActiveTab = tab
        },
        sendNuiAddStock(data) {
            sendNui('bank-stock-add-' + this.id, data)
        },
        sendNuiRemoveStock(data) {
            sendNui('bank-stock-remove-' + this.id, data)
        },
        sendNuiCreateAccount() {
            sendNui('bank-createAccount-' + this.id, { id: this.id })
        },
        sendNuiClose() {
            sendNui('bank-close-' + this.id, { id: this.id })
        },
        sendNuiDeposit(data) {
            sendNui('bank-deposit-' + this.id, { id: this.id, amount: data.amount })
        },
        sendNuiWithdraw(data) {
            sendNui('bank-withdraw-' + this.id, { id: this.id, amount: data.amount })
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