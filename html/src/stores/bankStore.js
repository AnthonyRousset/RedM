// gérer les actions bancaires sur plusieurs banques (ex : dépot, retrait, coffre, assurance, etc.)
// vault items : { name: 'item', amount: 0 }
// insurance service ( assurance armes, assurances cheval, assurances santé) 
import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
    state: () => ({
        currentBank: 1,
        banks: [
            { id: 1, name: 'Banque', account: 100, stock: [] },
        ], // { id: 0, name: 'Banque', account: 0, stock: [] }
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
            this.currentBank = data.id
            if (this.banks.length === 0) {
                this.banks.push(data)
            } else {
                if (this.banks.find(bank => bank.id === data.id)) {
                    this.banks = this.banks.map(bank => bank.id === data.id ? data : bank)
                } else {
                    this.banks.push(data)
                }
            }
        },
        createSuccess(data) {
            const bank = {  
                id: data.id,
                name: "Banque",
                account: 0,
                stock: data.stock   
            }
            this.banks.push(bank)
        },
        updateInsurance(data) {
            this.insurance = data.insurance
        },
        updateStock(data) { 
            this.stock = data.stock
        },
        updateBalance(data) {
            this.account = data.account
        }
    },
    getters: {
        getBank(state) {
            return state.banks.find(bank => bank.id === state.currentBank)
        },
        getBalance(state) {
            
            return state.banks.find(bank => bank.id === state.currentBank).account
        }
    }
})  