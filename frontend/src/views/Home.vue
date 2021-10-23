<script setup>
import { Viewer } from "../../viewer/viewer.js";
import ButtonRepo from "@/components/ButtonRepo.vue";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { loadObj } from "@/composable/loadObj.js";

const container = ref(null);

onMounted(() => {
  const viewer = new Viewer(container.value);
  viewer.loadObj("../public/models/citychain.obj", false);
  viewer.loadObj("../public/models/homechain_02.obj", true);

  console.log(viewer.objectManager.selected.name);
});
</script>

<template>
  <div class="absolute flex h-full w-full justify-center">
    <div ref="container" class="w-full border-l-2 box-border bg-gray-500"></div>
  </div>
</template>
