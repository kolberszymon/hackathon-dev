<script setup>
import { Viewer } from "../../viewer/viewer.js";
import ButtonRepo from "@/components/ButtonRepo.vue";
import { computed, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

const container = ref(null);

onMounted(() => {
  console.log("test");
  console.log(container.value);
  const viewer = new Viewer(container.value);
});
</script>

<template>
  <div class="bg-gray-100">
    <div class="flex mt-8 lg:flex-shrink-0 lg:mt-0">
      <ButtonRepo />
      <div class="flex"></div>
      <div ref="container" class="w-full border-l-2 box-border"></div>
    </div>
  </div>
</template>
