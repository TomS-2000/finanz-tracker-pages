<template>
    <div class="flex flex-1 sm:flex-2 flex-col gap-1 border-2 rounded-2xl pr-2 p-1 shadow-xl shadow-dark-color min-h-0 h-fit max-h-full">
        <div class="flex justify-between items-center pl-1 p-1">
            <span class="sm:text-xl font-semibold">{{ t('notificationTabLabel') }}</span>
            <NormalButton :click="deleteAllNotifications" class="group">
                <div class="flex gap-1 font-semibold group-hover:text-red-600">
                    <Trash></Trash> <span>{{t('formDeleteAllPriceEntriesButton')}}</span>
                </div>
            </NormalButton>
        </div>

        <div v-if="state.notifications.length > 0" class="text-sm overflow-y-auto min-h-0">
            <div class="flex flex-col gap-2 p-1">
                <div v-for="notification in visiableNotifications" :key="notification.notificationID" class="border-2 rounded-2xl shadow-md shadow-dark-color cursor-pointer" @click="toFinanceDetail(notification.fromID)">
                    <div class="group flex gap-2 justify-between items-center p-2">
                        <div class="flex flex-col w-full">
                            <div class="break-words">{{ notification.notificationText }}</div>
                            <div class="text-xs self-end">{{ notification.notificationDate.slice(0,-3) }}</div>
                        </div>
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:text-red-600 btn-transition" @click.stop="deleteNotification(notification.notificationID)">
                            <Trash class="size-5"/>
                        </div>
                    </div>  
                </div>
                <div ref="loadMoreNotificationTrigger" class="h-1"></div>
            </div>
        </div>
        <div v-else class="text-xl p-1">
            {{ t('notificationTabNotFoundText') }}
        </div>
    </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/state';
import { Trash } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import NormalButton from '../buttons/NormalButton.vue';

export default {
    components: {
        Trash,
        NormalButton
    },

    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return {state , t};
    },

    data() {
        return {
            visibleCount: 20,
            observer: null as null | IntersectionObserver,
        }
    },

    methods: {
        deleteNotification(id: number) {
            this.state.notifications = this.state.notifications.filter(n => n.notificationID !== id);
        },

        deleteAllNotifications() {
            this.state.notifications = [];
        },

        toFinanceDetail(fromID : number) {
            this.$router.push(`/finance/${fromID}`);
        },

        setupNotificationObserver() {
            this.observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        this.visibleCount += 30;
                    } 
                },
                { rootMargin: '50px' }
            )
            this.$nextTick(() => {
                if (this.$refs.loadMoreNotificationTrigger) {
                    this.observer!.observe(this.$refs.loadMoreNotificationTrigger as Element)
                }
            })
        },
    },

    computed: {
        visiableNotifications() {
            return this.state.notifications.slice(0, this.visibleCount);
        }
    },

    mounted() {
        this.setupNotificationObserver()
    },

    beforeUnmount() {
        if (this.observer && this.$refs.loadMoreNotificationTrigger) {
            this.observer.unobserve(this.$refs.loadMoreNotificationTrigger as Element)
        }
    },
}
</script>