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
        // Router Pfad (zu)
        path: {
            type: String,
            required: true
        },

        // Funktion bei Klick
        click: {
            type: Function as PropType<() => void>,
            required: true
        },

        // Bezeichnung des Buttons
        name: {
            type: String,
            required: true
        },

        // Spezieller weiterer Style
        specialStyle: {
            type: String
        }
    }
}
    
</script>