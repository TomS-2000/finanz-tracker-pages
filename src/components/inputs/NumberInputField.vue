<template>
    <div class="border-1  rounded-xl py-1 px-3 shadow-xl shadow-dark-color focus-within:border-2 focus:border-gray-900" 
    :class="[specialStyle,{ 'bg-gray-500 dark:bg-gray-600': isDisabled }, {'bg-gray-300 dark:bg-gray-900' : !isDisabled}]">
        <input class="border-none outline-none focus:outline-none focus:ring-0 appearance-none input-field w-full"
            :disabled="isDisabled"
            type="number"
            :class="[{'uppercase': isUppercase}]"
            :value="modelValue"
            @keydown="preventInvalidKeys"
            @input="handleInput"
        >
        <slot></slot>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        // Inhalt Uppercase
        isUppercase: {
            type: Boolean,
            required: true
        },
        
        // Spezieller weiterer Style
        specialStyle: {
            type: String,
        },

        isDisabled: {
            type: Boolean,
            required: true
        },

        minValue: {
            type: Number,
        },

        maxValue: {
            type: Number
        },

        // v-model value
        modelValue: {
            type: String,
            required: true
        },
    },

    methods: {

        preventInvalidKeys(e: KeyboardEvent) {
            const input = e.target as HTMLInputElement;
            const invalidKeys = ['e', 'E', '+', '.'];

            if (invalidKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }

            if (e.key === '-') {
                if (input.value.length > 0 || input.value.includes('-')) {
                    e.preventDefault();
                    return;
                }
            }
        },

        handleInput(event: Event) {
            const input = event.target as HTMLInputElement;
            const rawValue = input.value;

            const decimalPattern = /^-?\d*(\.\d{0,2})?$/;
            if (!decimalPattern.test(rawValue)) {
                input.value = this.modelValue;
                return;
            }

            if (rawValue === '') {
                this.$emit('update:modelValue', '');
                return;
            }

            const num = Number(rawValue);
            if (isNaN(num)) return;

            if (
            (this.minValue && num < this.minValue) ||
            (this.maxValue && num > this.maxValue)
            ) {
                input.value = this.modelValue;
                return;
            }

            this.$emit('update:modelValue', rawValue);
        }
    }
}
</script>