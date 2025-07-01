<template>
    <div class="border-1 bg-gray-300 dark:bg-gray-900 rounded-xl py-1 px-3 shadow-xl shadow-dark-color focus-within:border-2 focus:border-gray-900" :class="specialStyle">
        <input class="border-none outline-none focus:outline-none focus:ring-0 appearance-none input-field w-full" 
            :type="inputType" 
            :class="isUppercase ? 'uppercase': ''"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        <slot></slot>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        inputType: {
            type: String,
            required: true
        },

        isUppercase: {
            type: Boolean,
            required: true
        },

        specialStyle: {
            type: String,
        },

        modelValue: {
            type: [String, Number],
            required: true
        },
    }
}
</script>