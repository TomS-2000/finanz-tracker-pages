<template>
    <div class="border-1  rounded-xl py-1 px-3 shadow-xl shadow-dark-color focus-within:border-2 focus:border-gray-900" 
    :class="[specialStyle,{ 'bg-gray-500 dark:bg-gray-600': isDisabled }, {'bg-gray-300 dark:bg-gray-900' : !isDisabled}]">
        <input class="border-none outline-none focus:outline-none focus:ring-0 appearance-none input-field w-full"
            :disabled="isDisabled"
            :type="inputType" 
            :class="[{'uppercase': isUppercase}]"
            :value="modelValue"
            :maxlength="maxLength"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        <slot></slot>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        // Input Typ
        inputType: {
            type: String,
            required: true
        },

        // Inhalt Uppercase
        isUppercase: {
            type: Boolean,
            required: true
        },
        
        // Spezieller weiterer Style
        specialStyle: {
            type: String,
        },

        // max. Zeichen
        maxLength: {
            type: Number,
        },

        isDisabled: {
            type: Boolean,
            required: true
        },

        // v-model value
        modelValue: {
            type: String,
            required: true
        },
    }
}
</script>