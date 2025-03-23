// gérer le personnage (ex : nom, vie, force, etc.) 

import { defineStore } from 'pinia'

export const useCaracterStore = defineStore('caracter', {
    state: () => ({
        name: '',
        health: 0, // augmente les points de vie (10% par point)
        strength: 0, // augmente les degats aux poings (10% par point)
        dexterity: 0, // augmente l'endurance (10% par point)   
        intelligence: 0, // vitesse de craft (10% par point)    
        luck: 0,  // augmente les probabilités de succès (5% par point)
        phisique:{
            age: 0,
            sexe: '',
            taille: 0,
            poids: 0,
            couleur: '',
            couleur_cheveux: '',
            couleur_yeux: '',
            health: 0,
        },
        vetement:{
            tshirt: '',
            pantalon: '',
            chaussure: '',
            ceinture: '',
            gants: '',
            casque: '',
            ceinture: '',
        },
        accessoire:{
            bracelet: '',
            ceinture: '',
        }
    }),
    actions: {
        setName(name) { 
            this.name = name
        },
        setHealth(health) {
            this.health = health
        },
        setStrength(strength) {
            this.strength = strength
        },
        setDexterity(dexterity) {
            this.dexterity = dexterity
        },
        setIntelligence(intelligence) {
            this.intelligence = intelligence
        },
        setAge(age) {
            this.phisique.age = age
        },
        setSexe(sexe) {
            this.phisique.sexe = sexe
        },
        setTaille(taille) { 
            this.phisique.taille = taille
        },
        setPoids(poids) {
            this.phisique.poids = poids
        },
        setCouleur(couleur) {   
            this.phisique.couleur = couleur
        },
        setCouleur_cheveux(couleur_cheveux) {
            this.phisique.couleur_cheveux = couleur_cheveux
        },
        setCouleur_yeux(couleur_yeux) { 
            this.phisique.couleur_yeux = couleur_yeux
        },
        setLuck(luck) {
            this.luck = luck
        },
        setPhisique(phisique) {
            this.phisique = phisique
        },
        setVetement(vetement) {
            this.vetement = vetement
        },
        setAccessoire(accessoire) {
            this.accessoire = accessoire
        }
    }
})  
