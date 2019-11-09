/*!
 * ThreeSixty: A jQuery plugin for generating a draggable 360 preview from an image sequence.
 * Version: 0.1.2
 * Original author: @nick-jonas
 * Website: http://www.nickjonas.nyc
 * Licensed under the Apache License Version 2.0
 */

$(document).ready(function(){
    (function ( $, window, document, undefined ) {


    var scope,
        pluginName = 'threeSixty',
        defaults = {
            dragDirection: 'horizontal',
            useKeys: false,
            draggable: true
        },
        dragDirections = ['horizontal', 'vertical'],
        options = {},
        $el = {},
        data = [],
        total = 0,
        loaded = 0;

        /**
         * Constructor
         * @param {jQuery Object} element       main jQuery object
         * @param {Object} customOptions        options to override defaults
         */
        function ThreeSixty( element, customOptions ) {
            scope = this;
            this.element = element;
            options = options = $.extend( {}, defaults, customOptions) ;
            this._defaults = defaults;
            this._name = pluginName;

            // make sure string input for drag direction is valid
            if($.inArray(options.dragDirection, dragDirections) < 0){
                options.dragDirection = defaults.dragDirection;
            }

            this.init();
        }

        // PUBLIC API -----------------------------------------------------

        $.fn.destroy = ThreeSixty.prototype.destroy = function(){
            if(options.useKeys === true) $(document).unbind('keydown', this.onKeyDown);
            $(this).removeData();
            $el.html('');
        };

        $.fn.nextFrame = ThreeSixty.prototype.nextFrame = function(){
            $(this).each(function(i){
                var $this = $(this),
                    val = $this.data('lastVal') || 0,
                    thisTotal = $this.data('count');

                val = val + 1;

                $this.data('lastVal', val);

                if(val >= thisTotal) val = val % (thisTotal - 1);
                else if(val <= -thisTotal) val = val % (thisTotal - 1);
                if(val > 0) val = thisTotal - val;

                val = Math.abs(val);


                $this.find('.threesixty-frame').css({visibility: 'hidden'});
                $this.find('.threesixty-frame:eq(' + val + ')').css({ visibility: 'visible'}).css({display: 'block'});
                $this.find('.labels').css({display: 'block'}).css({visibility: 'hidden'});
                $this.find('.labels:eq(' + val + ')').css({ visibility: 'visible'}).css({display: 'block'});

                $this.find('.masks').css({visibility: 'hidden'}).attr("id","false");
                $this.find('.masks:eq(' + val + ')').css({display: 'block'}).css({ visibility: 'visible'}).attr("id","true");
                $this.find('.highlights').css({display: 'none'}).css({visibility: 'hidden'});
                canvas();



            });
        };

        $.fn.prevFrame = ThreeSixty.prototype.prevFrame = function(){
            $(this).each(function(i){
                var $this = $(this),
                    val = $this.data('lastVal') || 0,
                    thisTotal = $this.data('count');

                val = val - 1;

                $this.data('lastVal', val);

                if(val >= thisTotal) val = val % (thisTotal - 1);
                else if(val <= -thisTotal) val = val % (thisTotal - 1);
                if(val > 0) val = thisTotal - val;

                val = Math.abs(val);

                $this.find('.threesixty-frame').css({visibility: 'hidden'});
                $this.find('.threesixty-frame:eq(' + val + ')').css({ visibility: 'visible'}).css({display: 'block'});
                $this.find('.labels').css({display: 'block'}).css({visibility: 'hidden'});
                $this.find('.labels:eq(' + val + ')').css({ visibility: 'visible'}).css({display: 'block'});
                $this.find('.masks').css({visibility: 'hidden'}).attr("id","false");
                $this.find('.masks:eq(' + val + ')').css({display: 'block'}).css({ visibility: 'visible'}).attr("id","true");
                $this.find('.highlights').css({display: 'none'}).css({visibility: 'hidden'});
                canvas();




            });
        };

        // PRIVATE METHODS -------------------------------------------------

        /**
         * Initializiation, called once from constructor
         * @return null
         */
        ThreeSixty.prototype.init = function () {
            var $this = $(this.element);

            // setup main container
            $el = $this;

            // store data attributes for each 360
            $this.each(function(){
                var $this = $(this),
                    path = $this.data('path'),
                    count = $this.data('count');
                data.push({'path': path, 'count': count, 'loaded': 0, '$el': $this});
                total += count;
            });

            _disableTextSelectAndDragIE8();

            this.initLoad();
        };

        /**
         * Start loading all images
         * @return null
         */
        ThreeSixty.prototype.initLoad = function() {
            var i = 0, len = data.length, url, j;
            $el.addClass('preloading');
            for(i; i < len; i++){
                j = 0;
                for(j; j < data[i].count; j++){
                    url = data[i].path.replace('{index}', j);
                    $('<img/>').data('index', i).attr('src', url).load(this.onLoadComplete);
                }
            }
        };

    ThreeSixty.prototype.onLoadComplete = function(e) {
    var index = $(e.currentTarget).data('index'),
    thisObj = data[index];
    thisObj.loaded++;
    if(thisObj.loaded === thisObj.count){
    scope.onLoadAllComplete(index);
    }
    };

    ThreeSixty.prototype.onLoadAllComplete = function(objIndex) {
    var $this = data[objIndex].$el,
    html = '',
    l = data[objIndex].count,
    pathTemplate = data[objIndex].path,
    i = 0;
    // remove preloader
    $this.html('');
    $this.removeClass('preloading');
    // add 360 images
    for(i; i < l; i++){
    var display = (i === 0) ? 'visible' : 'hidden';
    var none = 'hidden'

    path_masks="masks/"
    path_labels="../labels/"

    const path_highlights = [
        {
         id:'highlights_A01_U',
         name:'highlights/A01/U',
        },
        {
            id:'highlights_A02_U',
            name:'highlights/A02/U',
           },
           {
            id:'highlights_A03_U',
            name:'highlights/A03/U',
           },
           {
            id:'highlights_A04_U',
            name:'highlights/A04/U',
           },
           {
            id:'highlights_A05_U',
            name:'highlights/A05/U',
           },
           {
            id:'highlights_A06_U',
            name:'highlights/A06/U',
           },
           {
            id:'highlights_B01_U',
            name:'highlights/B01/U',
           }
           ,
           {
            id:'highlights_B02_U',
            name:'highlights/B02/U',
           }


        ]

extencion=".png"
html += '<img     class="threesixty-frame  renders" style="visibility:' +display + ';" data-index="' + i + '"  id="' + i + '" src="' + pathTemplate.replace('{index}', i) + '"/>';
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  html += '<img   class="masks hide center" alt="'+i+'" crossOrigin = "Anonymous"  style="visibility:' + display + ';" id="true"     data-index="' + i + '"   src="' + path_masks+''+i+extencion+'"/>';
  html += '<img   class="labels  center"  crossOrigin = "Anonymous"    style="visibility:' + display + ';"    data-index="' + i + '"   src="' + path_labels+''+i+extencion+'"/>';


path_highlights.forEach(function(highlight, index) {

    html += '<img class="highlights center"     style="visibility:' + none + ';" data-index="' +i+'"  id="' + highlight.id+'1_'+i+ '" src="' + highlight.name +'1/'+i+extencion+ '"/>';
    html += '<img class="highlights center"     style="visibility:' + none + ';" data-index="' +i+'"  id="' + highlight.id+'2_'+i+ '" src="' + highlight.name +'2/'+i+extencion+ '"/>';
    html += '<img class="highlights center"     style="visibility:' + none + ';" data-index="' +i+'"  id="' + highlight.id+'3_'+i+ '" src="' + highlight.name +'3/'+i+extencion+ '"/>';

  });



            }
            $this.html(html);

            this.attachHandlers(objIndex);
        };

        var startY = 0,
            thisTotal = 0,
            $downElem = null,
            lastY = 0,
            lastX = 0,
            lastVal = 0,
            isMouseDown = false;
        ThreeSixty.prototype.attachHandlers = function(objIndex) {
            var that = this;
            var $this = data[objIndex].$el;

            // add draggable events
            if(options.draggable){
                // if touch events supported, use
                if(typeof document.ontouchstart !== 'undefined' &&
                    typeof document.ontouchmove !== 'undefined' &&
                    typeof document.ontouchend !== 'undefined' &&
                    typeof document.ontouchcancel !== 'undefined'){
                    var elem = $this.get()[0];
                    elem.addEventListener('touchstart', that.onTouchStart);
                    elem.addEventListener('touchmove', that.onTouchMove);
                    elem.addEventListener('touchend', that.onTouchEnd);
                    elem.addEventListener('touchcancel', that.onTouchEnd);
                }
            }

            // mouse down
            $this.mousedown(function(e){
                e.preventDefault();
                thisTotal = $(this).data('count');
                $downElem = $(this);
                startY = e.screenY;
                lastVal = $downElem.data('lastVal') || 0;
                lastX = $downElem.data('lastX') || 0;
                lastY = $downElem.data('lastY') || 0;
                isMouseDown = true;
                $downElem.trigger('down');




            });

            // arrow keys
            if(options.useKeys === true){
                $(document).bind('keydown', that.onKeyDown);
            }
            // mouse up
            $(document, 'html', 'body').mouseup(that.onMouseUp);
            $(document).blur(that.onMouseUp);
            $('body').mousemove(function(e){
                that.onMove(e.screenX, e.screenY);
            });
        };

        ThreeSixty.prototype.onTouchStart = function(e) {
            var touch = e.touches[0];
            //e.preventDefault();
            $downElem = $(e.target).parent();
            thisTotal = $downElem.data('count');
            startX = touch.pageX;
            startY = touch.pageY;
            lastVal = $downElem.data('lastVal') || 0;
            lastX = $downElem.data('lastX') || 0;
            lastY = $downElem.data('lastY') || 0;
            isMouseDown = true;
            $downElem.trigger('down');
        };

        ThreeSixty.prototype.onTouchMove = function(e) {
            e.preventDefault();
            var touch = e.touches[0];
            scope.onMove(touch.pageX, touch.pageY);

        };

        ThreeSixty.prototype.onTouchEnd = function(e) {

        };

        ThreeSixty.prototype.onMove = function(screenX, screenY){
            if(isMouseDown){
                var x = screenX,
                    y = screenY,
                    val = 0;

                $downElem.trigger('move');


                if(options.dragDirection === 'vertical'){
                    if(y > lastY){
                        val = lastVal + 1;
                    }else{
                        val = lastVal - 1;
                    }
                }else{
                    if(x > lastX){
                        val = lastVal + 1;
                    }else if(x === lastX){
                        return;
                    }else{
                        val = lastVal - 1;
                    }
                }

                lastVal = val;
                lastY = y;
                lastX = x;
                $downElem.data('lastY', lastY);
                $downElem.data('lastX', lastX);
                $downElem.data('lastVal', lastVal);
                if(val >= thisTotal) val = val % (thisTotal - 1);
                else if(val <= -thisTotal) val = val % (thisTotal - 1);
                if(val > 0) val = thisTotal - val;
                val = Math.abs(val);



                $downElem.find('.threesixty-frame').css({visibility: 'hidden'});
                $downElem.find('.threesixty-frame:eq(' + val + ')').css({display: 'block'}).css({visibility: 'visible'});
                $downElem.find('.masks').css({visibility: 'hidden'}).attr("id","false")  ;
                $downElem.find('.labels').css({display: 'block'}).css({visibility: 'hidden'});
                $downElem.find('.labels:eq(' + val + ')').css({ visibility: 'visible'}).css({display: 'block'});

                $downElem.find('.masks:eq(' + val + ')').css({display: 'block'}).css({visibility: 'visible'}).attr("id","true");
                $downElem.find('.highlights').css({display: 'none'}).css({visibility: 'hidden'});
                canvas();



            }
        };



    window.onload = function(e) {
    canvas();
      }


    function canvas() {

    var img= document.getElementById('true');
    img.addEventListener('mousemove', function (e) {
      let ctx;

          this.canvas = document.createElement('canvas');
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          ctx=this.canvas.getContext('2d');
          ctx.drawImage(this, 0, 0, this.width, this.height);

        ctx=this.canvas.getContext('2d');

    const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;

    detectar_color(ctx,e,img);


    });





    }





    function detectar_color(ctx,e,img) {


    $(document).unbind("click");
    ////DETECTAR COLORES
    //Covierto Color RGBA a Hexadecimal
    const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;


    r=pixel[0] ;
    g=pixel[1] ;
    b=pixel[2] ;
    console.log("COLOR: #",r+g+b)
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }




    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }


    var hex =rgbToHex(r, g, b);

    console.log(hex);



///////////////////////////////////////////////////////////////////////////////////

    /* A06 - U1 */
    if (hex==="#50509a" || hex==="#181891"  || hex==="#171791" || hex==="#191991" || hex==="#51519a") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A06_U1_";
        var highlight = document.getElementById(url+id);
       document.getElementById("true").setAttribute('title', 'A61-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A06/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A06_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A06 - U1 */


    /* A06 - U2 */
    if (hex==="#b3b3e5" || hex==="#b2b2e4") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A06_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A62-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A06/U2/"
        var level2="../r1/plans/A06/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A06_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A06 - U2 */

         /* A06 - U3 */
    if (hex==="#00008c" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A06_U3_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A63-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A06/U3/"
        var level2="../r1/plans/A06/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A06_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A06 - U3 */

////////////////////////////////////////////////////



    /* A05 - U1 */
    if (hex==="#b7ee00" ) {
    $(document).unbind("click");

    var id = img.alt;
    var url="highlights_A05_U1_";
    var highlight = document.getElementById(url+id);
    document.getElementById("true").setAttribute('title', 'A51-1'); 
    highlight.style.display = "block";
    highlight.style.visibility = "visible";
    $(document).click(function(e){
    e.preventDefault();
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    var url =route+"menu.html"
    var level1="plans/A05/U1/"
    var level2=0
    var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
    var myWindow = window.open(url , "_top", "");
    $(document).unbind("click");
        e.stopImmediatePropagation()
    })

    }
    else
    {
    var id = img.alt;
    var url="highlights_A05_U1_";
    var highlights = document.getElementById(url+id);
    highlights.style.display = "none";
    highlights.style.visibility = "hidden";
    }
    /* A05 - U1 */

        /* A05 - U2 */
        if (hex==="#50d750" || hex==="#51d651" ) {
            $(document).unbind("click");

            var id = img.alt;
            var url="highlights_A05_U2_";
            var highlight = document.getElementById(url+id);
            document.getElementById("true").setAttribute('title', 'A52-2'); 
            highlight.style.display = "block";
            highlight.style.visibility = "visible";
            $(document).click(function(e){
            e.preventDefault();
            var loc = window.location;
            var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
            var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
            var url =route+"menu.html"
            var level1="plans/A05/U2/"
            var level2="../r1/plans/A05/U2/"
            var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
            var myWindow = window.open(url , "_top", "");
            $(document).unbind("click");
                e.stopImmediatePropagation()
            })

            }
            else
            {
            var id = img.alt;
            var url="highlights_A05_U2_";
            var highlights = document.getElementById(url+id);
            highlights.style.display = "none";
            highlights.style.visibility = "hidden";
            }
            /* A05 - U2 */

           /* A05 - U3 */
           if (hex==="#c95454" ) {
            $(document).unbind("click");

            var id = img.alt;
            var url="highlights_A05_U3_";
            var highlight = document.getElementById(url+id);
            document.getElementById("true").setAttribute('title', 'A53-3'); 
            highlight.style.display = "block";
            highlight.style.visibility = "visible";
            $(document).click(function(e){
            e.preventDefault();
            var loc = window.location;
            var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
            var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
            var url =route+"menu.html"
            var level1="plans/A05/U3/"
            var level2="../r1/plans/A05/U3/"
            var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
            var myWindow = window.open(url , "_top", "");
            $(document).unbind("click");
                e.stopImmediatePropagation()
            })

            }
            else
            {
            var id = img.alt;
            var url="highlights_A05_U3_";
            var highlights = document.getElementById(url+id);
            highlights.style.display = "none";
            highlights.style.visibility = "hidden";
            }
            /* A05 - U3 */


///////////////////////////////////////////////////////////////////////////////////

    /* A04 - U1 */
    if (hex==="#b3a42f" || hex==="#b3a330" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A04_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A41-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A04/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A04_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A04 - U1 */


    /* A04 - U2 */
    if (hex==="#cabb55" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A04_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A42-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A04/U2/"
            var level2="../r1/plans/A04/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A04_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A04 - U2 */

         /* A04 - U3 */
    if (hex==="#e1d494" || hex==="#e0d493" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A04_U3_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A43-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A04/U3/"
          var level2="../r1/plans/A04/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A04_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A04 - U3 */


///////////////////////////////////////////////////////////////////////////////////

    /* A03 - U1 */
    if (hex==="#b72c7a" || hex==="#b72d7a") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A03_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A31-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A03/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A03_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A03 - U1 */


    /* A03 - U2 */
    if (hex==="#e194b8" || hex==="#e093b8" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A03_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A32-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A03/U2/"
        var level2="../r1/plans/A03/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A03_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A03 - U2 */

         /* A03 - U3 */
    if (hex==="#ca5594" || hex==="#ca5593" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A03_U3_";
        var highlight = document.getElementById(url+id);

        document.getElementById("true").setAttribute('title', 'A33-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A03/U3/"
            var level2="../r1/plans/A03/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A03_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A03 - U3 */


///////////////////////////////////////////////////////////////////////////////////

    /* A02 - U1 */
    if (hex==="#6de16d" || hex==="33ba7f" || hex==="32b97f" || hex==="#6de06d") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A02_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A21-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A02/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A02_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A02 - U1 */


    /* A02 - U2 */
    if (hex==="#94e194" || hex==="#93e093") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A02_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A22-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A02/U2/"
            var level2="../r1/plans/A02/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A02_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A02 - U2 */

         /* A02 - U3 */
    if (hex==="#e9ece8" || hex==="#e9ece7" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A02_U3_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A23-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A02/U3/"
        var level2="../r1/plans/A02/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A02_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A03 - U3 */


///////////////////////////////////////////////////////////////////////////////////

    /* A01 - U1 */
    if (hex==="#c7d732" || hex==="#c6d633" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A01_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A11-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A01/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A01_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A01 - U1 */


    /* A01 - U2 */
    if (hex==="#ee6738" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A01_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A12-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A01/U2/"
            var level2="../r1/plans/A01/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A01_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A01 - U2 */

         /* A01 - U3 */
    if (hex==="#d3dd9f" ) {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_A01_U3_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'A13-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/A01/U3/"
            var level2="../r1/plans/A01/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_A01_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* A01 - U3 */

///////////////////////////////////////////////////////////////////////////////////

    /* B01 - U1 */
    if (hex==="#5795ca") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_B01_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'B11-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/B01/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_B01_U1_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* B01 - U1 */


    /* B01 - U2 */
    if (hex==="#94b9e2" || hex==="#94b9e1") {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_B01_U2_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'B12-2'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/B01/U2/"
            var level2="../r1/plans/B01/U2/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_B01_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* B01 - U2 */

         /* B01 - U3 */
    if (hex==="#bfcee3" || hex==="#bfcee2")  {
        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_B01_U3_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'B13-3'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/B01/U3/"
        var level2="../r1/plans/B01/U3/"
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
        var id = img.alt;
        var url="highlights_B01_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
        }
     /* B01 - U3 */


///////////////////////////////////////////////////////////////////////////////////

    /* B02 - U1 */
    if (hex==="#a22fb4" || hex==="#a230b4")  {

        $(document).unbind("click");

        var id = img.alt;
        var url="highlights_B02_U1_";
        var highlight = document.getElementById(url+id);
        document.getElementById("true").setAttribute('title', 'B21-1'); 
        highlight.style.display = "block";
        highlight.style.visibility = "visible";
        $(document).click(function(e){
        e.preventDefault();
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        var url =route+"menu.html"
        var level1="plans/B02/U1/"
        var level2=0
        var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
        var myWindow = window.open(url , "_top", "");
        $(document).unbind("click");
            e.stopImmediatePropagation()
        })

        }
        else
        {
            var url="highlights_B02_U1_";
            var highlights = document.getElementById(url+id);
            highlights.style.display = "none";
            highlights.style.visibility = "hidden";
        }
     /* B02 - U1 */

 /* B02 - U2 */
 if (hex==="#7260af" ) {

    $(document).unbind("click");

    var id = img.alt;
    var url="highlights_B02_U2_";
    var highlight = document.getElementById(url+id);
    document.getElementById("true").setAttribute('title', 'B22-2'); 
    highlight.style.display = "block";
    highlight.style.visibility = "visible";
    $(document).click(function(e){
    e.preventDefault();
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    var url =route+"menu.html"
    var level1="plans/B02/U2/"
    var level2="../r1/plans/B02/U2/"
    var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
    var myWindow = window.open(url , "_top", "");
    $(document).unbind("click");
        e.stopImmediatePropagation()
    })

    }
    else
    {
        var url="highlights_B02_U2_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
    }


 /* B02 - U3 */
 if (hex==="#b694e2" || hex==="#b694e1" ) {

    $(document).unbind("click");

    var id = img.alt;
    var url="highlights_B02_U3_";
    var highlight = document.getElementById(url+id);
    document.getElementById("true").setAttribute('title', 'B23-3'); 
    highlight.style.display = "block";
    highlight.style.visibility = "visible";
    $(document).click(function(e){
    e.preventDefault();
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var route= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    var url =route+"menu.html"
    var level1="plans/B02/U3/"
    var level2="../r1/plans/B02/U3/"
    var url =route+"menu.html?level1="+level1+"&level2= "+level2+" "  ;
    var myWindow = window.open(url , "_top", "");
    $(document).unbind("click");
        e.stopImmediatePropagation()
    })

    }
    else
    {
        var url="highlights_B02_U3_";
        var highlights = document.getElementById(url+id);
        highlights.style.display = "none";
        highlights.style.visibility = "hidden";
    }



    if (hex==="#000000") {

    document.getElementById("true").setAttribute('title', '');

    }















    }










        ThreeSixty.prototype.onKeyDown = function(e) {
            switch(e.keyCode){
                case 37: // left
                 $el.prevFrame();
                 //$el.canvas();
                    break;
                case 39: // right
                    $el.nextFrame();
                   // $el.canvas();
                    break;
            }
        };

        ThreeSixty.prototype.onMouseUp = function(e) {
            isMouseDown = false;







        };

        /**
         * Disables text selection and dragging on IE8 and below.
         */
        var _disableTextSelectAndDragIE8 = function() {
          // Disable text selection.
          document.body.onselectstart = function() {
              return false;
          };

          // Disable dragging.
          document.body.ondragstart = function() {
              return false;
          };
        };


        /**
         * A really lightweight plugin wrapper around the constructor,
            preventing against multiple instantiations
         * @param  {Object} options
         * @return {jQuery Object}
         */
        $.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName,
                    new ThreeSixty( this, options ));
                }
            });
        };

    })( jQuery, window, document );









      });
