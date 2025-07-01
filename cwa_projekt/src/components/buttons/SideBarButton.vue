<template>
    <RouterLink class="p-2 hover:bg-cyan-700/60 btn-transition"
        :class="specialStyle"
        :to="path" 
        @click="click"
        >
        <div class="flex items-center">
            <slot></slot>
            <div class="pl-3">{{ name }}</div>
        </div>
    </RouterLink>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { RouterLink } from 'vue-router';

export default {
    components: {
        RouterLink
    },

    props: {
        path: {
            type: String,
            required: true
        },

        click: {
            type: Function as PropType<() => void>,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        specialStyle: {
            type: String
        }
    }
}
    
</script>