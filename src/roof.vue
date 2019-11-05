<template>
  <div >



 
  <div id="app" class="wrapper center">
    <VueProductSpinner :class="'renders'"  :images="imgs" :infinite="true" :speed="5" :slider="false">
 Cargando
    </VueProductSpinner>
  </div>


</div>


</template>

<style scoped>

</style>
<script>
import VueProductSpinner from "vue-product-spinner";


const images = [...Array(30)].map(
  (_, i) =>
    `https://jcastillovnz.github.io/montigny/iframes/roof/renders/${i +
      1}.jpg`
);



export default {
  name: "App",
  components: {
    VueProductSpinner
  },
  data() {
    return {
      imgs: images
    };
  }
};
</script>

<style >

@import '/../src/css/estilos.css';
.vue-product-spinner,
.vue-product-spinner img {
  max-width: 100%;
  margin-left: 0%;

  
}

</style>
