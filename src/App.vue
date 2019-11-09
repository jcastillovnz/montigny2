<template>
  <div >




<div class="container">
<div class="container-view" >
<h1 class="main-title">MAQUETTE</h1>
<div  class="windows"  >

<router-view ></router-view>
        

</div>
</div>



<div class="container-filter">
    <div class="filter row" id="legend">
      <div class="legend-col-2">
    

    <div class="type">
    
    <div class="type-color" id="color-3piece">
          </div>
          <div class="type-name">
            <span>3 pièces</span>
          </div>


        </div>
  <div class="type">
     
   <div class="type-color" id="color-4piece">
          </div>
          <div class="type-name">
            <span>4 pièces</span>
          </div> 
        
        
        </div>

      </div>
      <div class="legend-col-1">
      </div>
    </div>
    <div class="filter" id="name">
      <div class="filter-title">
        <h2>RESIDENCE</h2>
      </div>
      <div class="filter-button">
        <a >
          <button class="button large active"> 
   Montigny
          </button>
        </a>
      </div>
    </div>

    <div class="filter" id="building">
      <div class="filter-title">
        <h2>IMMEUBLE</h2>
      </div>
      <div class="filter-button" id="button-building">
        <a href="#">
          <button class="button small active"> 
            A
          </button>
        </a>
        <a href="#">
          <button class="button small"> 
            B
          </button>
        </a>
        <a href="#">
          <button class="button small"> 
            C
          </button>
        </a>
      </div>
    </div>

    <div class="filter" id="view">
      <div class="filter-title">
        <h2>VUES</h2>
      </div>
      <div class="filter-button">
    <router-link id="aerienne" tag="button"
        to="/"  class="nav-link button large active"
      >
        Aérienne
       </router-link>
       <router-link id="aerienne" tag="button"
       to="/pedrestian"  class="nav-link button large"
     >
     Piétonne
      </router-link>
 
      </div>
    </div>
    <div class="filter" id="floor">
      <div class="filter-title">
      <h2>NIVEAUX</h2>
      </div>
      <div id="myDIV" class="filter-button">

   <router-link id="aerienne" tag="button"
        to="/1-etage"  class="nav-link button large "
      >
       1<sup>e</sup> Étage
   </router-link>

   <router-link id="aerienne" tag="button"
        to="/rdc"  class="nav-link button large "
      >
      Rdc
   </router-link>
      
    </div>
     </div>
     </div>

</div>






  </div>
</template>

<script>

export default {
name: 'App',
  data () {
    return {

    }
  }
}
</script>

