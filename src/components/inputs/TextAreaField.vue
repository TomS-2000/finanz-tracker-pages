<template>
    <div class="border-1 bg-gray-300 dark:bg-gray-900 rounded-xl py-1 px-3 shadow-xl shadow-dark-color focus-within:border-2 focus:border-gray-900">
        <textarea :maxlength="maxLength" class="border-none outline-none focus:outline-none focus:ring-0 appearance-none w-full max-h-50 min-h-6" 
            :class="minWidth ? `min-w-${minWidth}` : ''" 
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        // minimale Weite
        minWidth: {
            type: Number,
        },

        maxLength: {
            type: Number,
        },

        // v-model value
        modelValue: {
            type: [String, Number],
            required: true
        },
    }
}
</script>