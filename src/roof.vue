<template>
  <div >



 
  <div  class="wrapper">


    <VueProductSpinner :class="'renders'"  :images="imgs" :infinite="true" :mouseWheel="false" :speed="5" :slider="false">


 <Loader/>
    </VueProductSpinner>
  </div>


</div>


</template>

<style scoped>

</style>
<script>
import Vue from 'vue'
Vue.component('Loader', require('./components/loader.vue').default);

import VueProductSpinner from "vue-product-spinner";



const images = [...Array(30)].map(
  (_, i) =>
    `/src/assets/roof/renders/${i +
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

.wrapper-container {
  

}




.wrapper {
  

position: absolute;
  width: auto;
    display: block;
    margin: 0 auto;
    text-align: left;
}


.renders{


    position: relative;
    left: 50%;
    bottom: 50%;
    top: -0%;
    transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    z-index: 0;

  
}


</style>
