<template>
    <button class="btn-transition bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400
    dark:bg-gradient-to-b dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 
    rounded-xl p-1 px-2 shadow-md shadow-dark-color cursor-pointer hover:ring-1" 
    @click="click()">
        <slot></slot>
    </button>
</template>

<script lang="ts">
export default {
    props: {
        // Button Funktion bei Klick
        click: {
            type: Function,
            required: true
        }
    }
}
</script>
