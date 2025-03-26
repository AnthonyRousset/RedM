// gérer les actions bancaires sur plusieurs banques (ex : dépot, retrait, coffre, assurance, etc.)
// vault items : { name: 'item', amount: 0 }
// insurance service ( assurance armes, assurances cheval, assurances santé) 
import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
    state: () => ({
        isLoading: true,
        id: 'nodata',
        exist: false,
        account: 0,
        stock: [],
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
        }
    }),
    actions: {
        update(data) {
            console.log('update', data)
            this.id = data.id
            this.exist = data.exist
            this.account = data.account
            this.isLoading = false
            //this.stock = data.stock
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