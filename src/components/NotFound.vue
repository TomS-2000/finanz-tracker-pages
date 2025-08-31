<template>
    <div class="flex flex-col h-full w-full items-center justify-center font-semibold">

        <!-- Fehlertext -->
        <div class="text-6xl mb-10">{{ t('notFoundErrorMsg') }}</div>

        <!-- Fehlercode -->
        <div class="text-4xl text-gray-500">{{ t('notFoundErrorCode') }}</div>
        
    </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const {t, locale} = useI18n();
        return {t, locale};
    }
}
</script>