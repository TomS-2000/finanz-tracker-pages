<template>
    <div class="flex items-center gap-4">
        <slot name="firstText"></slot>
        <div class="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer transition-colors duration-300"
            @click="click">
            
            <div
                class="mt-1 ml-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md shadow-dark-color transition-transform duration-300"
                :class="changeAttribute ? `translate-x-8 ${firstColor}` : secondColor"
            >
                <slot name="specialIcons"></slot>
            </div>
        </div>
        <slot name="secondText"></slot>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';

export default {
    props: {
        click: {
            type: Function as PropType<() => void>,
            required: true
        },

        changeAttribute: {
            type: Boolean,
            required: true
        },

        firstColor: {
            type: String,
            required: true
        },

        secondColor: {
            type: String,
            required: true
        },
    }
}
</script>