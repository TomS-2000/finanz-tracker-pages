<template>
    <div class="bg-white/50 dark:bg-gray-800/50 rounded-full p-1">
        <Search v-show="!isSearchInputShow" class="cursor-pointer btn-transition" @click="toggleSearchInputShow"/>
        <div v-show="isSearchInputShow" class="flex items-center gap-2">
            <Search class="cursor-pointer btn-transition" @click="toggleSearchInputShow"/>
            <InputField v-model="localSearchQuery" input-type="text" :is-uppercase="false" :is-disabled="false"/>
        </div>
        
    </div>
</template>

<script lang="ts">
import { Search } from 'lucide-vue-next';
import InputField from '../inputs/InputField.vue';
import type { PropType } from 'vue';

export default {
    components: {
        Search,
        InputField
    },

    data() {
        return {
            localSearchQuery: this.searchQuery as string,
        }
    },

    props: {
        toggleSearchInputShow: {
            type: Function as PropType<() => void>,
            required: true
        },

        isSearchInputShow: {
            type: Boolean,
            required: true
        },

        searchQuery: {
            type: String,
            required: true
        },

        setSearchQuery: {
            type: Function as PropType<(searchQuery: string) => void>,
            required: true
        }

    },

    watch: {
        localSearchQuery(newQuery) {
            this.setSearchQuery(newQuery);
        },
        searchQuery(newQuery) {
            this.localSearchQuery = newQuery
        }
    }
}

</script>