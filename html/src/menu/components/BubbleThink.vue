<script setup>

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    who: {
        type: String,
        required: true
    }
})

</script>

<template>
    <div class="bubble-think">
        <div class="bubble-think-content">
            <div class="bubble-think-text">
                {{ text }}
            </div>
        </div>
    </div>
</template> 

<style lang="scss" scoped>
    .bubble-think {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .bubble-think-content {
            position: absolute;
            top: 0;
            left: 0;    
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .bubble-think-text {
                font-size: 1.5vw;
                color: #f5e6c9;
                text-align: center;
                text-shadow: 0.1vw 0.1vw 0.2vw rgba(0, 0, 0, 0.8);
                letter-spacing: 0.1vw;
            }
        }   
    }
</style>
