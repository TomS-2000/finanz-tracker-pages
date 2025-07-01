<template>
  <div>
    <div class="flex justify-center items-center h-screen">
      <h1 class="font-bold underline text-chestnut text-5xl sm:bg-blue-700 hover:text-6xl p-[20px]">App</h1>
      <h1 class="font-bold underline text-red-500 text-5xl sm:bg-blue-700 self-end">App</h1>
      <div class="animate-[wiggle_1s_ease-in-out_infinite] m-100" >gdrhhd</div>
      <div class="transition-[width_height] delay-200 duration-500 ease-in-out w-0 h-0 bg-amber-700 hover:w-40 hover:h-40 z-1000" >Test2</div>
      <div class="transition-[height] delay-700 duration-300 ease-in-out h-0 hover:h-32 z-100" >Test5</div>
      <div>
        <label class="peer">
          <input type="checkbox" checked />
        </label>
        <button class="transition-all not-peer-has-checked:opacity-0 peer-has-checked:block">
          I hide
        </button>
      </div>
      <div>
        <label class="peer">
          <input type="checkbox" checked />
        </label>

        <button class="transition-all transition-discrete not-peer-has-checked:opacity-0 peer-has-checked:block">
          I fade out
        </button>
      </div>
    </div>
    <span class="relative bottom-50 left-60 flex size-50">
      <span class="absolute h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
      <span class="absolute size-6 place-self justify-self-center rounded-full bg-sky-500"></span>
    </span>

    <div class="bg-teal-300 p-20 relative">
  <div class="bg-stone-600 py-12">
    <div class="absolute w-40 h-40 bg-amber-200 left-0 top-0 ">
      ggsgssgehd
    </div>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 p-10 ">
  <!-- Mit Wiederholung -->
  <div class="bg-[url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80')] bg-repeat bg-gray-100 border">
    <p class="p-4 text-center">🔁 <strong>bg-repeat</strong><br>Hintergrundbild wird wiederholt</p>
  </div>

  <!-- Ohne Wiederholung -->
  <div class="bg-[url('./assets.PNG')] bg-no-repeat bg-center bg-gray-10 border">
    <p class="p-4 text-center">🚫 <strong>bg-no-repeat</strong><br>Hintergrundbild wird nur einmal angezeigt</p>
  </div>
</div>

    <div>
      <div>
        <input type="color">
        <input type="file" @change="onFileChange" accept="image/*" />
        <div v-if="isLoading">OCR läuft...</div>

        <h2>Shop: {{ shopName }}</h2>

        <pre>{{ resultText }}</pre>

        <h3>Artikel:</h3>
        <ul>
          <li v-for="(a, index) in artikelListe" :key="index">
            {{ a.name }} – {{ a.preis.toFixed(2) }} €
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="mb-2 inset-shadow-sm inset-shadow-indigo-900 h-20 w-20 bg-indigo-200">bgcbngcbh</div>
  <div class="inset-shadow-sm inset-shadow-indigo-500/50 h-20 w-20 bg-indigo-200" ></div>
  <div class="inset-shadow-sm inset-shadow-indigo-500/50 h-20 w-20 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent">hdhdh</div>
  <div class="border-10 m-4 bg-gradient-to-r from-yellow-400 to-blue-500 bg-clip-border">
  <p class="text-white font-bold">bg-clip-border</p>
</div>

<div class="border-10 border-red-500 m-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-padding p-4">
  <p class="text-white font-bold">bg-clip-padding {{ /*2:10:10 next Flex Grid*/ }}</p>
</div>

<div class="border-4 border-red-500 m-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-content p-4">
  <p class="text-white font-bold">bg-clip-content</p>
</div>
</template>

<script lang="ts">
import Tesseract from 'tesseract.js';

type Artikel = {
  name: string;
  preis: number;
};

export default {
  data() {
    return {
      resultText: "",
      artikelListe: [] as Artikel[],
      shopName: "",
      isLoading: false,
    };
  },

  methods: {
    parseKassenbon(text: string) {
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const ignore = [
        "summe",
        "rückgeld",
        "steuer",
        "datum",
        "kasse",
        "filiale",
        "zeit",
        "bar",
        "brutto",
        "netto",
        "%",
      ];
      const artikel: Artikel[] = [];
      let shop = "";

      for (const line of lines) {
        if (!shop && line.match(/.{3,}$/)) {
          shop = line;
        }

        const lower = line.toLowerCase();
        if (ignore.some((word) => lower.includes(word))) continue;

        let cleanLine = line.replace(/[„~–—−]/g, "-");
        const match = cleanLine.match(
          /(.+?)\s+([-+]?\d+[\.,]\d{2})[\s*€][€*]?[\s]?[AB12](.{1,3})?$/
        );
        if (match) {
          const name = match[1].trim();
          const preis = parseFloat(match[2].replace(",", "."));
          artikel.push({ name, preis });
        }
      }
      this.shopName = shop;
      return artikel;
    },

    async getTextFromPhoto(file: File) {
      this.isLoading = true;
      try {
        const { data } = await Tesseract.recognize(file, "deu", {
          logger: (m) => console.log(m),
        });
        this.resultText = data.text;
        this.artikelListe = this.parseKassenbon(data.text);
      } catch (error) {
        console.error("Fehler bei OCR:", error);
      } finally {
        this.isLoading = false;
      }
    },

    onFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files ? input.files[0] : null;
      if (file) {
        this.getTextFromPhoto(file);
      }
    },
  }
}
</script>

<style scoped>
</style>