<template>
    <div class="fixed top-0 left-0 flex justify-center items-center min-w-0 min-h-0 w-screen h-screen bg-gray-600/30 dark:bg-gray-100/30 z-5">
        <div class="w-[80vw] theme-colors p-3 rounded-2xl shadow-xl shadow-dark-color">
            <div class="flex flex-col gap-4">
                
                <!-- Formular Header -->
                <div class="flex justify-between">
                    <div class="sm:text-4xl">{{ t('formNewEntryLabel') }}</div>
                    <div class="cursor-pointer btn-transition" @click="closeFinanceForm()">
                        <CircleX class="sm:size-10 "/>
                    </div>
                </div>

                <!-- Formular (Inputs) -->
                <div class="flex max-sm:flex-col justify-around py-4 gap-3 max-h-[calc(80vh-8rem)] overflow-y-auto">
                    
                    <!-- 1. Spalte Formular -->
                    <div class="flex flex-col flex-1 gap-4">

                        <!-- Titel -->
                        <div class="flex flex-col">
                            <div>
                                {{ t('formTitleLabel') }}
                            </div>
                            <InputField v-model="formData.name" input-type="text" :is-uppercase="false" :max-length="50" :is-disabled="false" :class="{ 'border-red-500': !isNameValid }"/>
                        </div>

                        <!-- From -->
                        <div class="flex flex-col">
                            <div>
                                {{ t('formFromLabel') }}
                            </div>
                            <InputField v-model="formData.from" input-type="text" :is-uppercase="false" :max-length="40" :is-disabled="false"/>
                        </div>

                        <!-- Kategorien -->
                        <div class="flex flex-col gap-3 border-1 p-2 rounded-2xl">
                            <div class="flex justify-between items-center cursor-pointer" @click="toggleIsCategoryOpen">
                                <div v-if="formData.categories.every(category => !category.checked)">
                                    {{ t('formCategoryLabel') }}
                                </div>
                                <div v-else class="flex flex-wrap gap-2">
                                    <div v-for="category in getCheckedCategories" :key="category.cat">
                                        <span class="p-1 px-2 rounded-2xl border-1" :style="{ backgroundColor: category.color }">
                                            {{ category.cat }}
                                        </span>
                                    </div>
                                </div>
                                
                                <div><ChevronDown/></div>
                            </div>
                        
                            <Transition
                                name = "fade-out"
                                enter-active-class="transition-all duration-400 ease-in"
                                enter-from-class="opacity-0 -translate-y-2"
                                enter-to-class="opacity-100 translate-y-0"
                            >
                                <div v-show="isCategoryOpen" class="flex flex-col gap-1.5 text-lg">
                                    <div v-for="category in formData.categories" :key="category.cat" class="flex justify-between gap-3 items-center">
                                        <div class="flex gap-3 pl-1">
                                            <input type="checkbox" :checked="category.checked" @change="changeCategoryChecked(category.cat)">
                                            <span>{{ category.cat }}</span>
                                        </div>
                                        <div class="flex gap-3">
                                            <input type="color" class="rounded-full w-10" :value="category.color" @change="(e) => changeCategoryColor(category.cat, (e.target as HTMLInputElement).value)">
                                            <NormalButton class="group" :click="() => deleteCategory(category.cat)">
                                                <Trash class="size-5 group-hover:text-red-600"/>
                                            </NormalButton>
                                        </div>     
                                    </div>

                                    <NormalButton v-if="!isCategoryAddInput" class="w-fit mt-1" :click="openCategoryInput">
                                        <div  class="flex gap-3 items-center">
                                            <CirclePlus class="size-5"/> {{ t('formNewCategoryLabel') }}
                                        </div>
                                    </NormalButton>

                                    <div v-else class="flex gap-3 pl-1 items-center mt-1">
                                        <InputField v-model="newCategory" input-type="text" :is-disabled="false" :is-uppercase="false"/>
                                        <input v-model="newCategoryColor" type="color" class="rounded-full w-10">
                                        <NormalButton :click="addCategory"><CirclePlus class="size-5"/></NormalButton>
                                        <NormalButton :click="closeCategoryInput"><CircleX class="size-5"/></NormalButton>
                                    </div>

                                </div>
                            </Transition>
                        </div>

                        <!-- Datum -->
                        <div class="flex flex-col">
                            <div>
                                {{ t('formDateLabel') }}
                            </div>
                        <InputField v-model="formData.date" input-type="datetime-local" :is-uppercase="true" :is-disabled="false" :class="{ 'border-red-500': !isDateValid }"/>
                        </div>

                        <!-- Wiederkehrend? -->
                        <SliderButton :click="toggleAgain" :change-attribute="formData.isRecurring" first-color="bg-green-600" second-color="bg-white dark:bg-gray-900">
                            <template v-slot:firstText><span>{{ t('formAgainLabel') }}</span></template>
                        </SliderButton>

                        <!-- Wiederkehrender Zyklus -->
                        <div v-if="formData.isRecurring" class="flex flex-col gap-1">
                            <div>{{ t('formCycleLabel') }}</div>

                            <div class="flex flex-col cursor-pointer" @click="toggleRecurringOptions">

                                <div class="border-1 rounded-2xl" :class="recurringOptionsOpen ? 'border-b-0 rounded-b-none': ''">
                                    <div class="p-2 flex justify-between">
                                        <div v-if="formData.recurringCycle && formData.recurringCycle !== 'none'">
                                            {{ t(formData.recurringCycle) }}
                                        </div>
                                        <div v-else>
                                            test
                                        </div>
                                        <div>
                                            <ChevronDown/>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- ausgeklappter Bereich Zyklus -->
                                <Transition
                                    name = "fade-out"
                                    enter-active-class="transition-all duration-400 ease-in"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                >
                                    <div v-show="recurringOptionsOpen" class="border-1 rounded-b-2xl theme-colors">
                                        <div v-for="option in recurringOptions" :key="option" @click.stop="changeRecurringOption(option)" class="p-1 pl-2 pt-2 hover:hover:bg-cyan-700/60 last:rounded-b-2xl" >
                                            <span>{{ t(option) }}</span>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                        
                        
                        <!-- Benachrichtigung? -->
                        <SliderButton :click="toggleNotification" :change-attribute="formData.isNotification" first-color="bg-green-600" second-color="bg-white dark:bg-gray-900">
                            <template v-slot:firstText><span>{{ t('formNotificationLabel') }}</span></template>
                        </SliderButton>
                        
                        <!-- Benachrichtigungsdatum -->
                        <template v-if="formData.isNotification">
                            <div class="flex flex-col">
                                <div>
                                    {{ t('formNotificationDateLabel') }}
                                </div>
                                <InputField v-model="formData.notificationDate" input-type="datetime-local" :is-uppercase="true" :is-disabled="false" :class="{ 'border-red-500': !isNotificationDateValid }"/>
                            </div>
                        </template>

                        <!-- Benachrichtigungstext -->
                        <template v-if="formData.isNotification">
                            <div class="flex flex-col">
                                <div>
                                    {{ t('formNotificationMsgLabel') }}
                                </div>
                                <TextAreaField v-model="formData.notificationText" :max-length="80" :class="{ 'border-red-500': !isNotificationTextValid }"/>
                            </div>
                        </template>
                    </div>

                    <!-- 2. Spalte Formular -->
                    <div class="flex flex-col flex-1 gap-4">
                        
                        <!-- Preis -->
                        <div class="flex flex-col">
                            <div>
                                {{ t('formPriceLabel') }}
                            </div>
                            <NumberInputField v-model="formData.value" :is-uppercase="false" special-style="flex gap-1" :max-value="maxValue" :min-value="minValue" :is-disabled="isValueDisabled" :class="{ 'border-red-500': !isValueValid }">
                                <ChevronDown class="cursor-pointer" @click.stop="toggleExtraValues"/>
                            </NumberInputField>

                            <!-- Extra Values (ausklappbare untergeordnete Preise) -->
                            <Transition
                                name = "fade-out"
                                enter-active-class="transition-all duration-400 ease-in"
                                enter-from-class="opacity-0 -translate-y-2"
                                enter-to-class="opacity-100 translate-y-0"
                            >
                                <ExtraValue v-show="isExtraValuesOpen" 
                                :value-list="formData.valueList"
                                :invalide-list="invalidValueListIndexes"
                                :add-initial-entry-to-list="addInitialEntryToList"
                                :delete-value-list-entry="deleteValueListEntry"
                                :delete-all-entries="deleteAllEntries"/>
                            </Transition>
                        </div>

                        <!-- Kassenbon Bild zu Text -->
                        <div>
                            <div class="flex flex-wrap gap-2">
                                <label for="file-input" class="flex gap-2 items-center">
                                    <span>{{ t('formBillLabel') }}:</span>
                                    <Camera class="size-7 btn-transition cursor-pointer"/>
                                </label>
                                <ScanText v-show="imagePath && !isLoadingTextFromPhoto" class="size-7 btn-transition cursor-pointer" @click="extractTextFromPhoto"/>
                                <Trash v-show="imagePath" class="size-7 btn-transition cursor-pointer" @click="removeFilePath"/>
                            </div>
                            <input hidden id="file-input" type="file" accept=".png, .jpg, .jpeg, .gif" @change="onFileChange"/>
                            <span class="flex gap-2" v-if="isLoadingTextFromPhoto">{{ t('formScanPhotoLodingLabel') }}
                                <LoaderCircle class="animate-spin"/>
                            </span>
                        </div>
                        
                        <img v-if="imagePath" :src="imagePath" alt="Preview" class="rounded-xl w-64"/>
                        
                        <!-- Beschreibung -->
                        <div class="flex flex-col">
                            <div>
                                {{ t('formDecriptionLabel') }}
                            </div>
                            <TextAreaField v-model="formData.description" :min-width="40" :max-length="200"/>
                        </div>
                    </div>
                </div>

                <!-- Hinzufügen Button -->
                <NormalButton :click="addFormData" class="self-center text-2xl">
                    <span v-if="isUpdate">{{ t('formUpdateButtonLabel') }}</span>
                    <span v-else>{{ t('formAddButtonLabel') }}</span>
                </NormalButton>
                
            </div>     
        </div>     
    </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/state';
import { useI18n } from 'vue-i18n';
import { CircleX, ChevronDown, CirclePlus, Trash, Camera, ScanText, LoaderCircle } from 'lucide-vue-next';
import InputField from './../inputs/InputField.vue';
import TextAreaField from './../inputs/TextAreaField.vue';
import SliderButton from './../buttons/SliderButton.vue';
import NormalButton from './../buttons/NormalButton.vue';
import type { PropType } from 'vue';
import type { Finance } from '@/state';
import ExtraValue from './ExtraValues.vue';
import { getTextFromPhoto } from '@/photoToText';
import NumberInputField from '../inputs/NumberInputField.vue';

type RecurringOptions = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

type FormData = {
    id: number,
    name: string,
    value: string,
    valueList: {title: string, value: string}[]
    from: string,
    categories: {cat: string, color: string, checked: boolean}[],
    date: string,
    description: string,
    isRecurring: boolean,
    recurringCycle: RecurringOptions,
    isNotification: boolean,
    notificationDate: string,
    notificationText: string
}

export default {
    components: {
        CircleX,
        ChevronDown,
        CirclePlus,
        Trash,
        Camera,
        ScanText,
        LoaderCircle,
        InputField,
        NumberInputField,
        TextAreaField,
        SliderButton,
        NormalButton,
        ExtraValue,
    },

    setup() {
        const state = useGlobalStore();
        const {t} = useI18n();
        return {state, t};
    },

    data() {
        return {
            formData: {
                id: -1 as number,
                name: '' as string,
                value: '' as number | '',
                valueList: [] as {title: string, value: string}[],
                from: '',
                date: '' as string,
                categories: [] as {cat: string, color: string, checked: boolean}[],
                description: '' as string,
                isRecurring: false,
                recurringCycle: 'none',
                isNotification: false,
                notificationDate: '' as string,
                notificationText: '' as string,
            } as FormData,
            imagePath: '' as string,
            imageFile: null as File | null,
            isCategoryOpen: false as boolean,
            isUpdate: false as boolean,
            isCategoryAddInput: false as boolean,
            isLoadingTextFromPhoto: false as boolean,
            newCategory: '' as string,
            newCategoryColor: '#FFFFFF' as string,
            recurringOptions: ['daily','weekly', 'monthly', 'yearly'] as RecurringOptions[],
            recurringOptionsOpen: false as boolean,
            isExtraValuesOpen: false as boolean,
            isValueDisabled: false as boolean,
            invalidValueListIndexes: [] as {index: number, type: string}[],
            isNameValid: true as boolean,
            isValueValid: true as boolean,
            isDateValid: true as boolean,
            isNotificationDateValid: true as boolean,
            isNotificationTextValid: true as boolean,
            maxValue : 1000000000000 as number,
            minValue : -1000000000000 as number,
        }
    },

    props: {
        closeFinanceForm: {
            type: Function,
            required: true
        },

        updateData: {
            type: Object as PropType<Finance | null>
        }
    },

    methods: {
        toggleAgain() {
            if(this.formData.isRecurring) {
                this.formData.recurringCycle = 'none';
            } else {
                this.formData.recurringCycle = 'monthly';
            }

            this.formData.isRecurring = !this.formData.isRecurring; 
        },

        toggleExtraValues() {
            if(this.formData.valueList.length > 0) {
                this.isExtraValuesOpen = true;
            } else {
                this.isExtraValuesOpen = !this.isExtraValuesOpen;
            }  
        },

        addInitialEntryToList() {
            if(this.formData.valueList.length === 0) {
                this.formData.value = '';
                this.isValueDisabled = true;
            }

            this.formData.valueList.push({title: '', value: ''});
        },

        deleteValueListEntry(index: number) {
            if(this.formData.valueList.length === 1){
                this.isValueDisabled = false;
            }

            this.formData.valueList.splice(index, 1);
        },

        deleteAllEntries() {
            this.isValueDisabled = false;
            this.formData.valueList = [];
        },

        toggleRecurringOptions() {
            this.recurringOptionsOpen = !this.recurringOptionsOpen;
        },

        changeRecurringOption(option: RecurringOptions) {
            this.formData.recurringCycle = option;
            this.recurringOptionsOpen = false;
        },

        toggleNotification() {
            this.formData.isNotification = !this.formData.isNotification;
        },

        toggleIsCategoryOpen() {
            this.isCategoryOpen = !this.isCategoryOpen;
        },

        changeCategoryChecked(cat: string) {
            this.formData.categories = this.formData.categories.map(category => category.cat === cat ? {...category, checked:!category.checked} : category);
        },

        changeCategoryColor(cat: string, color: string) {
            this.formData.categories = this.formData.categories.map(category => category.cat === cat ? {...category, color: color} : category);
            this.state.categories = this.formData.categories.map(category => ({cat: category.cat, color: category.color}));
        },

        onFileChange(e: Event) {
            const input = e.target as HTMLInputElement;
            if(!input.files || input.files.length === 0) {
                return;
            }

            const file = input.files[0];
            this.imageFile = file;

            input.value = '';

            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = () => {
                    this.imagePath = reader.result as string
                }
                reader.readAsDataURL(file)
            } else {
                this.imagePath = ''
            }
        },

        removeFilePath() {
            this.imagePath = '';
            this.imageFile = null;
        },

        async extractTextFromPhoto() {
            let valueList : {title: string, value: string}[] | undefined = [];
            if(this.imageFile) {
                this.isLoadingTextFromPhoto = true;
                valueList = await getTextFromPhoto(this.imageFile);
                this.isLoadingTextFromPhoto = false;
            }

            if(valueList && valueList.length > 0) {
                for(let i = 0; i < valueList.length; i++) {
                    this.formData.valueList.push(valueList[i]);
                }
                this.isExtraValuesOpen = true;
                this.isValueDisabled = true;
            }
        },

        addFormData() {
            let value: number = this.state.parseToFixed2(Number(this.formData.value));
            let isValueValid: boolean = (value != null && value !== 0 && value <= this.maxValue  && value >= this.minValue);

            let isValueListValid: boolean = this.formData.valueList.length === 0 || this.formData.valueList.every(vli => vli.title && vli.value);

            if(isValueValid && this.formData.date && this.formData.name
                && (!this.formData.isNotification || (this.formData.notificationDate && this.formData.notificationText))
                && isValueListValid
            ) {
                
                this.state.checkPushInVisibleList(this.formData.date);

                let valueList = this.formData.valueList.filter(vli => vli.title && vli.value).map(vli => ({ title: vli.title, value: this.state.parseToFixed2(Number(vli.value)) }));

                const financeObj: Finance = {
                    id: this.isUpdate ? this.formData.id : this.state.nextFinanceId,
                    name: this.formData.name,
                    value: valueList.length > 0 ? (this.state.parseToFixed2(valueList.reduce((sum, vli) => sum + vli.value, 0)) ?? 0) : value,
                    valueList: valueList,
                    from: this.formData.from,
                    date: this.formData.date,
                    categories: this.formData.categories
                        .filter(category => category.checked)
                        .map(category => category.cat),
                    description: this.formData.description,
                    isRecurring: this.formData.isRecurring,
                    recurringCycle: this.formData.recurringCycle,
                    isNotification: this.formData.isNotification,
                    notificationDate: this.formData.notificationDate,
                    notificationText: this.formData.notificationText,
                    isExtraValuesVisible: false
                }

                // Update
                if(this.isUpdate && this.updateData) {
                    this.state.finances = this.state.finances.map(finance => finance.id === financeObj.id ? financeObj : finance);
                    this.state.totalAmount += this.state.parseToFixed2((Number(this.formData.value) - this.updateData.value));
                    this.state.totalAmount = this.state.parseToFixed2(this.state.totalAmount);
                // Add
                } else {
                    this.state.finances = [...this.state.finances, financeObj];
                    this.state.totalAmount += this.state.parseToFixed2(Number(this.formData.value));
                    this.state.totalAmount = this.state.parseToFixed2(this.state.totalAmount);
                    this.formData.id = this.state.nextFinanceId;
                    this.state.nextFinanceId++;
                }

                console.log(financeObj);
                
                this.closeFinanceForm();
            } else {
                if(!this.formData.name) { this.isNameValid = false; } else { this.isNameValid = true; }
                
                if(!this.formData.date) { this.isDateValid = false; } else { this.isDateValid = true; }
                
                if(!isValueValid) { this.isValueValid = false; } else { this.isValueValid = true; }

                if(this.formData.isNotification && !this.formData.notificationDate) {
                    this.isNotificationDateValid = false;
                } else { this.isNotificationDateValid = true; }

                if(this.formData.isNotification && !this.formData.notificationText) {
                    this.isNotificationTextValid = false;
                } else { this.isNotificationTextValid = true; }

                this.invalidValueListIndexes = [];
                if(!isValueListValid) {
                    for(let i = 0; i < this.formData.valueList.length; i++){
                        if(!this.formData.valueList[i].title && !this.formData.valueList[i].value) {
                            this.invalidValueListIndexes.push({index: i, type: 'both'});
                        } else if (!this.formData.valueList[i].title) {
                            this.invalidValueListIndexes.push({index: i, type: 'title'});
                        } else if (!this.formData.valueList[i].value) {
                            this.invalidValueListIndexes.push({index: i, type: 'value'});
                        }
                    }
                }
            }
        },

        openCategoryInput() {
            this.isCategoryAddInput = true;
        },

        closeCategoryInput() {
            this.isCategoryAddInput = false;
        },

        addCategory() {
            const isUnique = this.state.categories.every(cat => cat.cat != this.newCategory);

            if(this.newCategory.length > 0 && this.newCategoryColor && isUnique) {
                this.state.categories = [...this.state.categories, {cat: this.newCategory, color: this.newCategoryColor}];
                this.formData.categories = [...this.formData.categories, {cat: this.newCategory, color: this.newCategoryColor, checked: false}];
                this.isCategoryAddInput = false;
                this.newCategory = '';
                this.newCategoryColor = '#FFFFFF';
            }   
        },

        deleteCategory(cat: string) {
            this.state.categories = this.state.categories.filter(category => category.cat != cat);
            this.formData.categories = this.formData.categories.filter(category => category.cat != cat);

            for(let i = 0; i < this.state.finances.length; i++) {
                let categoryIndex = this.state.finances[i].categories.findIndex(category => category === cat);

                if(categoryIndex !== -1) {
                    this.state.finances[i].categories.splice(categoryIndex, 1);
                }
            }
        }
    },

    computed: {
        getCheckedCategories() : {cat: string, color: string}[]{
            return this.formData.categories.filter(category => category.checked);
        }
    },

    watch: {
        'formData.valueList': {
            handler(newValueList : {title: string, value: number | ''}[]) {
                let valueList = newValueList.filter(vli => vli.title && vli.value).map(vli => ({title: vli.title, value: this.state.parseToFixed2(Number(vli.value)) }));
                if(valueList.length > 0) {
                    this.formData.value = valueList.reduce((sum, vli) => sum + vli.value, 0).toFixed(2) ?? 0;
                }
            },
            deep: true 
        },
    },

    beforeMount() {

        if(this.updateData) {
            this.formData = {
                id: this.updateData.id,
                name: this.updateData.name,
                value: this.updateData.value.toFixed(2),
                valueList: this.updateData.valueList.map(vli => ({ title: vli.title, value: vli.value.toFixed(2) })),
                from: this.updateData.from,
                date: this.updateData.date,
                categories: this.state.categories.map((category: {cat: string, color: string}) => {
                    const found = this.updateData?.categories.find(cat => cat === category.cat);
                    return { ...category, checked: !!found };
                }),
                description: this.updateData.description,
                isRecurring: this.updateData.isRecurring,
                recurringCycle: this.updateData.recurringCycle,
                isNotification: this.updateData.isNotification,
                notificationDate: this.updateData.notificationDate,
                notificationText: this.updateData.notificationText,
            }

            if(this.updateData.valueList.length > 0) {
                this.isExtraValuesOpen = true;
                this.isValueDisabled = true;
            }

            this.isUpdate = true;
        } else {

            this.formData.categories = this.state.categories.map((category: {cat: string, color: string}) => {
                return { ...category, checked: false };
            });

            this.isUpdate = false;
        }
    }
}
</script>