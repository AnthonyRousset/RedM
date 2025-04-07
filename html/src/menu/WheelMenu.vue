<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Options disponibles dans le menu
const menuOptions = ref([
    { id: 'emotes', icon: '/images/wheel/emote.png', label: 'Emotes', color: '#805f07' },
    { id: 'documents', icon: '/images/wheel/document.png', label: 'Documents', color: '#6d1f1f' },
    { id: 'social', icon: '/images/wheel/social.png', label: 'Social', color: '#425e1a' },
    { id: 'actions', icon: '/images/wheel/action.png', label: 'Actions', color: '#2c4b63' },
    { id: 'items', icon: '/images/wheel/item.png', label: 'Objets', color: '#6b2a5d' },
    { id: 'commands', icon: '/images/wheel/command.png', label: 'Commandes', color: '#614929' }
])

// Sous-menus pour chaque catégorie
const subMenus = ref({
    emotes: [
        { id: 'dance', icon: '/images/wheel/emotes/dance.png', label: 'Danser' },
        { id: 'greet', icon: '/images/wheel/emotes/greet.png', label: 'Saluer' },
        { id: 'wave', icon: '/images/wheel/emotes/wave.png', label: 'Faire signe' },
        { id: 'smoke', icon: '/images/wheel/emotes/smoke.png', label: 'Fumer' },
        { id: 'drink', icon: '/images/wheel/emotes/drink.png', label: 'Boire' },
        { id: 'sit', icon: '/images/wheel/emotes/sit.png', label: 'S\'asseoir' },
        { id: 'lean', icon: '/images/wheel/emotes/lean.png', label: 'S\'adosser' },
        { id: 'clap', icon: '/images/wheel/emotes/clap.png', label: 'Applaudir' }
    ],
    documents: [
        { id: 'give_letter', icon: '/images/wheel/documents/letter.png', label: 'Lettre' },
        { id: 'give_map', icon: '/images/wheel/documents/map.png', label: 'Carte' },
        { id: 'give_wanted', icon: '/images/wheel/documents/wanted.png', label: 'Avis de recherche' },
        { id: 'give_deed', icon: '/images/wheel/documents/deed.png', label: 'Acte de propriété' }
    ],
    social: [
        { id: 'follow', icon: '/images/wheel/social/follow.png', label: 'Suivre' },
        { id: 'rob', icon: '/images/wheel/social/rob.png', label: 'Braquer' },
        { id: 'hostage', icon: '/images/wheel/social/hostage.png', label: 'Prendre en otage' },
        { id: 'trade', icon: '/images/wheel/social/trade.png', label: 'Échanger' }
    ],
    // Les autres sous-menus seront ajoutés de la même façon
    actions: [
        { id: 'surrender', icon: '/images/wheel/actions/surrender.png', label: 'Se rendre' },
        { id: 'search', icon: '/images/wheel/actions/search.png', label: 'Fouiller' },
        { id: 'pickup', icon: '/images/wheel/actions/pickup.png', label: 'Ramasser' },
        { id: 'craft', icon: '/images/wheel/actions/craft.png', label: 'Fabriquer' }
    ],
    items: [
        { id: 'use_bandage', icon: '/images/wheel/items/bandage.png', label: 'Bandage' },
        { id: 'use_food', icon: '/images/wheel/items/food.png', label: 'Nourriture' },
        { id: 'use_drink', icon: '/images/wheel/items/drink.png', label: 'Boisson' },
        { id: 'use_medicine', icon: '/images/wheel/items/medicine.png', label: 'Médicament' }
    ],
    commands: [
        { id: 'cmd_help', icon: '/images/wheel/commands/help.png', label: 'Aide' },
        { id: 'cmd_report', icon: '/images/wheel/commands/report.png', label: 'Signaler' },
        { id: 'cmd_settings', icon: '/images/wheel/commands/settings.png', label: 'Paramètres' },
        { id: 'cmd_admin', icon: '/images/wheel/commands/admin.png', label: 'Admin' }
    ]
})

// État du menu
const isVisible = ref(false)
const activeCategory = ref(null)
const selectedOption = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const centerPosition = ref({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
const wheelRotation = ref(0)

// Liste des options à afficher (catégories principales ou sous-menu)
const currentOptions = computed(() => {
    if (activeCategory.value) {
        return subMenus.value[activeCategory.value] || []
    }
    return menuOptions.value
})

// Rayon du cercle
const wheelRadius = 15 // en vw

// Ouvrir le menu
const openMenu = () => {
    isVisible.value = true
    activeCategory.value = null
    selectedOption.value = null
    wheelRotation.value = 0
    // Centrer la position
    centerPosition.value = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

// Fermer le menu
/*
const closeMenu = () => {
    isVisible.value = false
    activeCategory.value = null
    selectedOption.value = null
}
*/

// Suivre les mouvements de la souris
const handleMouseMove = (event) => {
    if (!isVisible.value) return
    
    mousePosition.value = { x: event.clientX, y: event.clientY }
    updateSelection()
}

// Mettre à jour la sélection en fonction de la position de la souris
const updateSelection = () => {
    if (!isVisible.value) return
    
    const dx = mousePosition.value.x - centerPosition.value.x
    const dy = mousePosition.value.y - centerPosition.value.y
    
    // Distance depuis le centre
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Convertir la distance en vw pour comparer avec wheelRadius
    const vw = window.innerWidth / 100
    const distanceVw = distance / vw
    
    // Si trop près du centre, pas de sélection
    if (distanceVw < 5) {
        selectedOption.value = null
        return
    }
    
    // Si en dehors du cercle, pas de sélection
    if (distanceVw > wheelRadius + 5) {
        selectedOption.value = null
        return
    }
    
    // Calculer l'angle
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    if (angle < 0) angle += 360
    
    // Déterminer quelle option est sélectionnée en fonction de l'angle
    const optionCount = currentOptions.value.length
    const anglePerOption = 360 / optionCount
    const selectedIndex = Math.floor(((angle + wheelRotation.value) % 360) / anglePerOption)
    
    // Mettre à jour l'option sélectionnée
    selectedOption.value = currentOptions.value[selectedIndex]?.id || null
}

// Gérer le clic
const handleClick = (event) => {
    if (!isVisible.value) return
    
    if (selectedOption.value) {
        if (!activeCategory.value) {
            // Si c'est une catégorie principale, ouvrir le sous-menu
            activeCategory.value = selectedOption.value
            selectedOption.value = null
        } else {
            // Si c'est une option de sous-menu, exécuter l'action
            executeAction(selectedOption.value)
        }
    } else {
        // Si clic au centre quand un sous-menu est actif, revenir au menu principal
        if (activeCategory.value) {
            activeCategory.value = null
            selectedOption.value = null
        } else {
            // Sinon, fermer le menu
            closeMenu()
        }
    }
}

// Exécuter l'action sélectionnée
const executeAction = (actionId) => {
    console.log('Exécution de l\'action:', actionId)
    // TODO: Implémenter la logique d'exécution des actions
    // sendNui('wheel-action', { actionId })
    closeMenu()
}

// Raccourcis clavier
const handleKeyPress = (event) => {
    if (event.key === 'Escape' && isVisible.value) {
        if (activeCategory.value) {
            activeCategory.value = null
            selectedOption.value = null
        } else {
            closeMenu()
        }
    } else if (event.key === 'z' && !isVisible.value) {
        openMenu()
    }
}

// Initialisation et nettoyage
onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyPress)
    
    // Ouvrir le menu automatiquement pour le développement (à commenter en production)
    setTimeout(openMenu, 1000)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('click', handleClick)
    document.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
    <div class="wheel-menu" v-if="isVisible">
        <!-- Fond semi-transparent -->
        <div class="wheel-backdrop"></div>
        
        <!-- Cercle central -->
        <div class="wheel-center">
            <div class="center-icon">
                <span v-if="activeCategory">Retour</span>
                <span v-else>Fermer</span>
            </div>
        </div>
        
        <!-- Options du menu -->
        <div class="wheel-options">
            <div 
                v-for="(option, index) in currentOptions" 
                :key="option.id"
                class="wheel-option"
                :class="{ 'selected': selectedOption === option.id }"
                :style="{
                    '--index': index,
                    '--total': currentOptions.length,
                    '--color': option.color || '#805f07'
                }"
            >
                <div class="option-content">
                    <div class="option-text">{{ option.label }}</div>
                </div>
            </div>
        </div>
        
        <!-- Titre du menu actif -->
        <div class="wheel-title" v-if="activeCategory">
            {{ menuOptions.find(o => o.id === activeCategory)?.label }}
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
$wheel-size: 30vw;
$wheel-radius: 15vw;
$option-size: 5vw;

.wheel-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    pointer-events: all;
    
    .wheel-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(3px);
    }
    
    .wheel-center {
        position: absolute;
        width: 8vw;
        height: 8vw;
        border-radius: 50%;
        background: radial-gradient(circle, #291b12 60%, #4b2d17 100%);
        border: 0.25vw solid #805f07;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        box-shadow: 0 0 1vw rgba(0, 0, 0, 0.5), inset 0 0 0.5vw rgba(0, 0, 0, 0.5);
        
        .center-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            
            img {
                width: 3vw;
                height: 3vw;
                object-fit: contain;
                margin-bottom: 0.5vw;
            }
            
            span {
                color: $color-text-light;
                font-family: $font-family-primary;
                font-size: 0.9vw;
                text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
            }
        }
    }
    
    .wheel-options {
        position: absolute;
        width: $wheel-size;
        height: $wheel-size;
        border-radius: 50%;
        
        .wheel-option {
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: left center;
            transform: rotate(calc(360deg / var(--total) * var(--index))) translateX($wheel-radius) rotate(calc(-360deg / var(--total) * var(--index))) translateX(-50%) translateY(-50%);
            transition: all 0.3s ease-out;
            
            &.selected {
                transform: rotate(calc(360deg / var(--total) * var(--index))) translateX(calc($wheel-radius + 1vw)) rotate(calc(-360deg / var(--total) * var(--index))) translateX(-50%) translateY(-50%) scale(1.15);
                
                .option-content {
                    background: radial-gradient(circle, var(--color) 0%, #291b12 100%);
                    border-color: var(--color);
                    filter: brightness(1.2);
                    box-shadow: 0 0 1vw var(--color), inset 0 0 0.5vw rgba(255, 255, 255, 0.3);
                }
            }
            
            .option-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: radial-gradient(circle, #291b12 0%, #1e130c 100%);
                border: 0.2vw solid #805f07;
                border-radius: 1vw;
                padding: 0.8vw 1.5vw;
                box-shadow: 0 0 0.5vw rgba(0, 0, 0, 0.5), inset 0 0 0.3vw rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease-out;
                min-width: 10vw;
                text-align: center;
                
                &:hover {
                    border-color: lighten(#805f07, 10%);
                }
                
                .option-text {
                    color: $color-text-light;
                    font-family: $font-family-primary;
                    font-size: 1.2vw;
                    text-align: center;
                    text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
                    white-space: nowrap;
                }
            }
        }
    }
    
    .wheel-title {
        position: absolute;
        top: 2vw;
        width: 100%;
        text-align: center;
        color: $color-text-light;
        font-family: $font-family-primary;
        font-size: 2vw;
        text-shadow: 0.1vw 0.1vw 0.3vw rgba(0, 0, 0, 0.8);
        letter-spacing: 0.1vw;
        
        &:after {
            content: '';
            display: block;
            width: 20vw;
            height: 0.2vw;
            background: linear-gradient(to right, transparent, $color-gold, transparent);
            margin: 0.5vw auto 0;
        }
    }
}
</style> 