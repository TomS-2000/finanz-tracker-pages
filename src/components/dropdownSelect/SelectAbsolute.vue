<template>
    <div class="relative border-1 p-1 pl-2 rounded-2xl sm:font-semibold cursor-pointer" :class=" topWidth + (filterOptionsOpen ? ' border-b-0 rounded-t-2xl rounded-b-none border-2' : '')">

            <!-- Header -->
            <div @click="toggleFilterOptions" class="flex justify-between">
				<div v-if="filter">
					{{ isFilterTranslation ? t(filter) : filter}}
				</div>
				<div v-else>
					{{ t(filterLabel) }}
				</div>
				<div>
					<ChevronDown/>
				</div>
			</div>
			
            <!-- ausgeklappter Bereich -->
			<Transition
				name = "fade-out"
				enter-active-class="transition-all duration-400 ease-in"
				enter-from-class="opacity-0 -translate-y-1"
				enter-to-class="opacity-100 translate-y-0"
			>
				<div v-show="filterOptionsOpen" class="absolute top-8 -left-0.5 z-3 px-1 pt-1 border-2 rounded-b-3xl theme-colors max-h-40 overflow-y-auto scrollbar-hide" :class="bottomWidth">
					<div v-for="filter in filterOptions" :key="filter" @click="changeFilter(filter)" class="p-1 pl-2 hover:hover:bg-cyan-700/60 btn-transition last:rounded-b-2xl" >
						<span>{{ isFilterTranslation ? t(filter) : filter }}</span>
					</div>
				</div>
			</Transition>
		</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDown } from 'lucide-vue-next';


export default {

    components: {
        ChevronDown,
    },

    setup() {
        const { t } = useI18n();

        return { t };
    },

    props: {

        // Funktion: öffen / schließen ausklappbaren Bereich
        toggleFilterOptions : {
            type: Function as PropType<() => void>,
            required: true
        },

        // ist ausgeklappter Berich offen
        filterOptionsOpen : {
            type: Boolean,
            required: true
        },

        // Filter Optionen (Filter-Werte)
        filterOptions : {
            type: Object as PropType<string[] | null>,
            required: true
        },

        // Filter Wert
        filter : {
            type: String,
            required: true
        },

        // Filter soll übersetzt werden
        isFilterTranslation : {
            type: Boolean,
            required: true
        },

        // Funktion: Filter wechseln
        changeFilter : {
            type: Function as PropType<(filter: string) => void>,
            required: true
        },

        // Label das angezeigt wird wenn kein Filter ausgewählt ist
        filterLabel : {
            type: String,
            required: true
        },

        // Header Weite
        topWidth: {
            type: String,
            required: true
        },

        // Weite des unteren Bereichs
        bottomWidth: {
            type: String,
            required: true
        }

    }
}
</script>