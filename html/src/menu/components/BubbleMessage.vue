<script setup>
const props = defineProps({
    message: {
        type: String,
        required: true
    },
    person: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'player', // 'player' ou 'banker' ou 'inventory' ou 'vendor'
        validator: (value) => ['player', 'banker', 'inventory', 'vendor'].includes(value)
    },
    active: {
        type: Boolean,
        default: false
    },
    positionLeft: {
        type: Number,
        default: 0
    },
    positionRight: {
        type: Number,
        default: 0
    }, 
    positionTop: {
        type: Number,
        default: 0
    },
    positionBottom: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <div 
        class="bubble-message bubble-conversation" 
        :class="{ 
            'message': type === 'message', 
            'think': type === 'think',
            'active': active && message 
        }"
        :style="{
            left: positionLeft ? `${positionLeft}vw` : undefined,
            right: positionRight ? `${positionRight}vw` : undefined,
            top: positionTop ? `${positionTop}vw` : undefined,
            bottom: positionBottom ? `${positionBottom}vw` : undefined
        }"
    >
        <div v-if="type !== 'error'" class="person">{{ person }}</div>
        <span>{{ message }}</span>
    </div>
</template>

<style lang="scss" scoped>
.bubble-message {
    position: absolute;
    font-size: 1vw;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.5s ease;
    opacity: 0;

    &.bubble-conversation {

        &.message,
        &.think {
            &.active {
                opacity: 1 !important;
            }
        }

        &.think {
            right: 30.25vw;
            width: 18.55vw;
            height: 12.15vw;
            top: 4.05vw;
            background-image: url('/images/bubble-think.png');

            span {
                font-size: 0.9vw;
                padding: 2.85vw 4.5vw 0 3.75vw;
                display: inline-block;
                text-align: center;
            }

            .person {
                position: absolute;
                top: -0.75vw;
                left: calc(50% - 1vw);
                transform: translateX(-50%);
                width: calc(initial - 50%);
                background-color: rgb(77, 27, 27);
                color: #ffffff;
                font-size: 1vw;
                text-align: center;
                padding: 0.25vw 0.5vw;
                border-radius: 0.25vw;
            }
        }

        &.message {
            left: 28.75vw;
            width: 17.55vw;
            height: 11.15vw;
            top: -2.15vw;
            background-image: url('/images/bubble-message.png');

            span {
                font-size: 1vw;
                padding: 2.5vw 4.15vw 0 2.15vw;
                display: inline-block;
                text-align: center;
            }

            .person {
                position: absolute;
                top: -0.5vw;
                left: calc(50% - 1vw);
                transform: translateX(-50%);
                width: calc(initial - 50%);
                background-color: rgb(77, 27, 27);
                color: #ffffff;
                font-size: 1vw;
                text-align: center;
                padding: 0.25vw 0.5vw;
                border-radius: 0.25vw;
            }
        }

        &.inventory {
            margin-bottom: 1vw;
            background: rgba(41, 27, 18, 0.9);
            border-color: #805f07;
        }
    }
}
</style>


