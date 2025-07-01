<template>
    <div class="btn-transition bg-gray-300 dark:bg-gray-900 rounded-xl p-1 px-2 shadow-md shadow-dark-color cursor-pointer" @click="click()">
        <slot></slot>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        click: {
            type: Function,
            required: true
        }
    }
}
</script>
