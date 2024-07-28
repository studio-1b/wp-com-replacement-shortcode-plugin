function standardizeToLineHeight(fig,lineheight){
    fig.style.display="inline-block";
    fig.style.overflow="hidden";
    fig.style.margin="1px";
    fig.style.padding="0px";
    fig.style.height=lineheight + "px";
    fig.style.width="auto";
    fig.style.maxHeight = fig.style.height;
    fig.style.maxWidth = fig.style.width;
    if(fig.firstElementChild && fig.firstElementChild.tagName=="DIV") {
      fig.firstElementChild.style.height = "100%";
    }
}
function fitToParent(img){
    img.srcset = "";
    img.style.margin="0px";
    img.style.height="100%";
    img.style.width="auto";
    img.style.cursor="pointer";
    img.addEventListener("click", function(e){
        e.cancelBubble=true;
        e.preventDefault();
        const target = e.target;
        var parent = target.parentNode;
        while(parent!=null) {
            parent = parent.parentNode;
            if(parent.fnGetSubFigureList!=null)
                break;
        }
        if (parent==null) return;
        openCarousel(target, parent);
        return false;
    });
    img.addEventListener("complete", checkLoaded);
}
/*
function justifyInlineElements(lineElementList, adjustableLineHeight, unjustifiedWidth, justfifiedWidth){
  const growth = justfifiedWidth/unjustifiedWidth;
  const line = lineElementList;
  for(var j=0; j<line.length; j++) {
    line[j].style.height=Math.round(growth*adjustableLineHeight) + "px";
    line[j].style.maxHeight = line[j].style.height;
    line[j].style.maxWidth="100%";
  }
}*/
function fitTo32Parent(parent,child){
  parent.style.width = parent.clientHeight*3/2;
  if(parent.clientHeight-4>child.clientHeight) child.style.height="100%";
  else if(parent.clientWidth-4>child.clientWidth) child.style.width="100%";
}
function fancyfyLine(lineElementList, lineConfig, adjustableLineHeight, unjustifiedWidth, justfifiedWidth, fnGetImgItem, parentBlock, options){
    const growth = justfifiedWidth/unjustifiedWidth;
    const config = lineConfig;
    const line = lineElementList;
    const rotate_www = 0;

    const sumw = config.reduce((t, s) => t + s.w, 0) -config[config.length-1].w;
    const diffx = config[config.length-1].x - config[0].x;
    const shrink = diffx!=0 ?sumw/diffx :1;
    console.log("shrink");
    console.log(shrink);

    //create a new wrapper around each line, so they don't interfere w each other
    const oldaparent = parentBlock;
    const linediv = document.createElement("DIV");
    parentBlock.appendChild(linediv);
    for(var i=0; i<line.length; i++)
        linediv.appendChild(line[i]);
    parentBlock = linediv;

    // three landscape
        // rotate : big float left 2/3, 2 small 1/3
        // rotate : equal
        // rotate : 2 small 1/3, big float right 2/3
    // three landscape, 1 portrait
    // 1 portrait, three landscape
    // else
    // all equal height
    if(config.length === 3 && ['w','w','w'].every((v, k) => v === config[k].a)) {
        // all images must share same aspect ratio 3:2, so per image adjust
        console.log("www");
        if(options[rotate_www]==0) {
            console.log("W-ww")
            line[0].style.width="65.5%";
            line[0].style.maxWidth="66%";
            line[0].style.height="auto";
            line[0].style.maxHeight="none";
            line[0].style.aspectRatio="3/2";
            line[0].style.float="left";

            line[1].style.width="33%";
            line[1].style.maxWidth="33%";
            line[1].style.height="auto";
            line[1].style.maxHeight="none";
            line[1].style.aspectRatio="3/2";
            line[1].style.display="block";

            line[2].style.width="33%";
            line[2].style.maxWidth="33%";
            line[2].style.height="auto";
            line[2].style.maxHeight="none";
            line[2].style.aspectRatio="3/2";
            line[2].style.display="block";

            fitTo32Parent(line[0],fnGetImgItem(line[0]));
            fitTo32Parent(line[1],fnGetImgItem(line[1]));
            fitTo32Parent(line[2],fnGetImgItem(line[2]));
        } else if(options[rotate_www]==1) {
            console.log("ww-W")
            line[0].style.width="33%";
            line[0].style.maxWidth="33%";
            line[0].style.height="auto";
            line[0].style.maxHeight="none";
            line[0].style.aspectRatio="3/2";
            line[0].style.display="block";

            line[1].style.width="33%";
            line[1].style.maxWidth="33%";
            line[1].style.height="auto";
            line[1].style.maxHeight="none";
            line[1].style.aspectRatio="3/2";
            line[1].style.display="block";

            line[2].style.width="66%";
            line[2].style.maxWidth="66%";
            line[2].style.height="auto";
            line[2].style.maxHeight="none";
            line[2].style.aspectRatio="3/2";
            line[2].style.display="block";
            line[2].style.float="right";
            parentBlock.insertBefore(line[2], line[0]);

            fitTo32Parent(line[0],fnGetImgItem(line[0]));
            fitTo32Parent(line[1],fnGetImgItem(line[1]));
            fitTo32Parent(line[2],fnGetImgItem(line[2]));
        } else {
            console.log("w-w-w justified");
            parentBlock.style.padding="1px";
            line[0].style.clear="both";
            const sum = config.reduce((t, s) => t + s.w, 0);
            const pct = config.map(s => Math.trunc(100*shrink*s.w/sum) + "%");
            for(var i=0; i<line.length; i++) {
                line[i].style.width = pct[i];
                line[i].style.maxWidth = pct[i];
                line[i].style.height = "auto";
                line[i].style.maxHeight="none";
            }
        }
        console.log("options before, options after");
        console.log(options[rotate_www]);
        options[rotate_www] = (++options[rotate_www])%3;
        console.log(options[rotate_www]);
    } else if(config.length === 3 && ['w','w','p'].every((v, k) => v === config[k].a)) {
        //const sum = config.reduce((t, s) => t + s.w, 0);
        console.log("wwp");
        const sum = Math.max(config[0].w,config[1].w) + 2*config[2].w;
        const pct = [ Math.trunc(100*shrink*config[0].w/sum), Math.trunc(100*shrink*config[1].w/sum), Math.trunc(200*shrink*config[2].w/sum) ];
        line[0].style.width=pct[0] + "%";
        line[0].style.maxWidth=pct[0] + "%";
        line[0].style.height="auto";
        line[0].style.maxHeight="none";
        line[0].style.display="block";

        line[1].style.width=pct[1] + "%";
        line[1].style.maxWidth=pct[1] + "%";
        line[1].style.height="auto";
        line[1].style.maxHeight="none";
        line[1].style.display="block";

        line[2].style.width=pct[2] + "%";
        line[2].style.maxWidth=pct[2] + "%";
        line[2].style.height="auto";
        line[2].style.maxHeight="none";
        line[2].style.display="block";
        line[2].style.float="right";
        parentBlock.insertBefore(line[2], line[0]);
    } else if(config.length === 3 && ['p','w','w'].every((v, k) => v === config[k].a)) {
        console.log("pww");
        const sum = Math.max(config[1].w,config[2].w) + 2*config[0].w;
        const pct = [ Math.trunc(200*shrink*config[0].w/sum), Math.trunc(100*shrink*config[1].w/sum), Math.trunc(100*shrink*config[2].w/sum) ];
        line[0].style.width=pct[0] + "%";
        line[0].style.maxWidth=pct[0] + "%";
        line[0].style.height="auto";
        line[0].style.maxHeight="none";
        line[0].style.display="block";
        line[0].style.float="left";

        line[1].style.width=pct[1] + "%";
        line[1].style.maxWidth=pct[1] + "%";
        line[1].style.height="auto";
        line[1].style.maxHeight="none";
        line[1].style.display="block";

        line[2].style.width=pct[2] + "%";
        line[2].style.maxWidth=pct[2] + "%";
        line[2].style.height="auto";
        line[2].style.maxHeight="none";
        line[2].style.display="block";
    } else if(config.length === 4 && ['w','w','w','p'].every((v, k) => v === config[k].a)) {
        console.log("wwwp");
        const sum = Math.max(config[0].w, config[1].w, config[2].w) + 2*config[3].w;
        const pct = [ Math.trunc(100*shrink*config[0].w/sum), Math.trunc(100*shrink*config[1].w/sum), Math.trunc(100*shrink*config[2].w/sum), Math.trunc(300*shrink*config[3].w/sum) ];
        line[0].style.width=pct[0] + "%";
        line[0].style.maxHeight=Math.trunc(config[3].h/3) + "px";
        line[0].style.display="block";

        line[1].style.width=pct[1] + "%";
        line[1].style.maxHeight=Math.trunc(config[3].h/3) + "px";
        line[1].style.display="block";

        line[2].style.width=pct[2] + "%";
        line[2].style.maxHeight=Math.trunc(config[3].h/3) + "px";
        line[2].style.display="block";

        line[3].style.width=pct[3] + "%";
        line[3].style.display="block";
        line[3].style.float="right";
        parentBlock.insertBefore(line[3], line[0]);

        //fitTo32Parent(line[0],fnGetImgItem(line[0]));
        //fitTo32Parent(line[1],fnGetImgItem(line[1]));
        //fitTo32Parent(line[2],fnGetImgItem(line[2]));
    } else {
        console.log("justify using width")
        parentBlock.style.padding="1px";
        line[0].style.clear="both";
        //const growth = linemax/(sum-size[i].w);
        if(line.length==0) shrink=1;
        const sum = config.reduce((t, s) => t + s.w, 0);
        const pct = config.map(s => Math.trunc(100*shrink*s.w/sum) + "%");
        for(var i=0; i<line.length; i++) {
            line[i].style.width = pct[i];
            line[i].style.maxWidth = pct[i];
            line[i].style.height = "auto";
            line[i].style.maxHeight = "none";
        }
    }
}

//https://reintech.io/blog/working-with-onload-event-handler
function getShortcodeGalleryList() {
  //https://www.w3schools.com/jsref/met_document_getelementsbyclassname.asp
  //const classlist = document.getElementsByClassName("gallery");
  //const divlist = collection.filter(s=>s.tagName=="div");
  const divlist = document.querySelectorAll("div.gallery");
  return Array.from(divlist);
}
function getShortcodeFigureList(gallery){
  /* <div id='gallery-3' class='gallery galleryid-11665 gallery-columns-3 gallery-size-thumbnail'>
     <figure class='gallery-item'>
       <div class='gallery-icon landscape'>
         <a href='https://car2graphy.wordpress.com/img_1001-jpg/'>
           <img loading="lazy" decoding="async" width="150" height="150" src="https://car2graphy.wordpress.com/wp-content/uploads/2018/12/img_1001-150x150.jpg" class="attachment-thumbnail size-thumbnail" alt="" />
         </a>
       </div></figure>
     </div>
  */
  const figlist = gallery.querySelectorAll("figure.gallery-item");
  return Array.from(figlist);
}
function getGalleryBlockList() {
  //https://www.w3schools.com/jsref/met_document_getelementsbyclassname.asp
  //const classlist = document.getElementsByClassName("gallery");
  //const divlist = collection.filter(s=>s.tagName=="div");
  const blocklist = document.querySelectorAll("figure.wp-block-gallery");
  return Array.from(blocklist);
}
function getBlockElementFromShortcodeItem(item){
    return item;
}
function getImgSrcFromShortcodeItem(item){
    if(item && item.firstElementChild && item.firstElementChild.firstElementChild)
        return item.firstElementChild.firstElementChild.href;
    else
        return null;
}
function getImgFromShortcodeItem(item){
    return item.firstElementChild.firstElementChild.firstElementChild;
}
function getBlockFigureList(gallery){
  /*
  <figure class="wp-block-gallery has-nested-images columns-default is-cropped wp-block-gallery-1 is-layout-flex wp-block-gallery-is-layout-flex">
    <figure class="wp-block-image size-large"><img decoding="async" data-id="13744" src="https://car2graphy.wordpress.com/wp-content/uploads/2024/06/img_6893.jpg?w=1024" alt="" class="wp-image-13744" /></figure>
    <figure class="wp-block-image size-large"><img decoding="async" data-id="13743" src="https://car2graphy.wordpress.com/wp-content/uploads/2024/06/img_6894.jpg?w=768" alt="" class="wp-image-13743" /></figure>
    <figure class="wp-block-image size-large"><img decoding="async" data-id="13742" src="https://car2graphy.wordpress.com/wp-content/uploads/2024/06/img_6908.jpg?w=1024" alt="" class="wp-image-13742" /></figure>
  </figure>
  */
  const figlist = gallery.querySelectorAll("figure.wp-block-image");
  return Array.from(figlist);
}
function getBlockElementFromBlockItem(item){
    return item;
}
function getImgSrcFromBlockItem(item){
    return null;
}
function getImgFromBlockItem(item){
    return item.firstElementChild;
}
function justifyInlineGallery(parentBlock, fnGetSubFigureList, fnGetBlockItem, fnGetImgReplace, fnGetImgItem, xtraSpaceBetweenItem) {
  console.log("New gallery submitted for justification");
  // wordpress must use medium setting, b/c aspect ratio must be maintained (thumbnail setting sets aspect at 1:1)
  //set parent at 95%
  //fix height of sub-figures @ 420px b/c it 
  //inline figures
  //figure out line breaks
  //expand each line's figures' height until all sub-figures = parent
  parentBlock.style.display="block";
  parentBlock.style.width="100%";
  parentBlock.style.margin="0px";
  parentBlock.style.padding="0px";
  parentBlock.style.backgroundColor="#EEEEEE";

  parentBlock.fnGetSubFigureList=fnGetSubFigureList;
  parentBlock.fnGetBlockItem=fnGetBlockItem;
  parentBlock.fnGetImgReplace=fnGetImgReplace;
  parentBlock.fnGetImgItem=fnGetImgItem;

  // getting all the images, based on gallery type

  const list = fnGetSubFigureList(parentBlock);
  const len = list.length;
  console.log(list);

  // setting the gallery to inline-block, and standard height
  var size = [];
  const ini_lineheight = Math.round(window.innerHeight/6);
  for(var i=0; i<len; i++) {
    const item = list[i];  
    const fig = fnGetBlockItem(item);
    standardizeToLineHeight(fig,ini_lineheight);
    
    const img = fnGetImgItem(item);
    fitToParent(img);
    const src = fnGetImgReplace(item);
    if(src) img.src=src;
    size.push({w:fig.clientWidth, h:fig.clientWidth, a:fig.clientHeight>fig.clientWidth?"p":"w", x:fig.offsetLeft, y:fig.offsetTop});
  }

  // Does the browser need to run a UI cycle, to get adjusted UI widths?
  // mguess is yes, but no it doesn't
  console.log(size);

  var config = [];
  var line = [];
  const linemax = parentBlock.clientWidth-20;
  var sum = 0;
  var currentLine = null;
  var lineList=[];
  var configList=[];
  for(var i=0; i<len; i++) {
    if(currentLine==null) currentLine = list[i].offsetTop;
    if(currentLine==list[i].offsetTop) {
      // continuation
      line.push( list[i] );
      config.push( size[i] );
    } else {
      // end of existing line
      console.log("New line establiushed");
      console.log(line);
      //const options = [rotate_www];
      //fancyfyLine(line, config, 0, 0, linemax, fnGetImgItem, parentBlock, options);
      //rotate_www = options[0];
      lineList.push(line);
      configList.push(config);

      // start of new line
      currentLine = list[i].offsetTop;
      line = [ list[i] ];
      config = [ size[i] ];
    }
  }
  if(line.length!=0) {
    lineList.push(line);
    configList.push(config);
  }
  console.log("Gallery line config:");
  console.log(lineList);
  console.log(configList);
  //const lastgrowth = linemax/(sum);
  //justifyInlineElements(line, ini_lineheight, sum, linemax);
  //fancyfyLine(line, config, 0, 0, linemax, fnGetImgItem, parentBlock, [rotate_www]);

  var rotate_www=0;
  for(var i=0; i<lineList.length; i++) {
    const options = [rotate_www];
    lineList[i][0].style.clear="left";
    fancyfyLine(lineList[i], configList[i], 0, 0, linemax, fnGetImgItem, parentBlock, options);
    //lineList[i][0].style.clear="both";
///    if(i!=0){
//      const br = document.createElement("br");
//      parentBlock.insertBefore(br, lineList[i][0]);
//    }
    rotate_www = options[0];
  }
}

function closeCarousel() {
    window.modalBackground.style.display="none";
    window.modalPicCarousel.style.display="none";
}
function putUp(e) {
    if(window.modalPicCarousel.oldimg)
        window.modalPicCarousel.oldimg.style.border="8px solid transparent";

    const img = modalPicCarousel.display;
    img.src = e.target.src;
    e.target.style.border="8px solid white";

    window.modalPicCarousel.oldimg = e.target;
}
function slideRight(e) {
    if(window.modalPicCarousel.oldimg)
        window.modalPicCarousel.oldimg.style.border="8px solid transparent";

    const img = modalPicCarousel.display;
    img.src = e.target.src;
    e.target.style.border="8px solid white";

    window.modalPicCarousel.oldimg = e.target;
}
function slideLeftRight(e) {
    if(!window.modalPicCarousel)
      return;
      console.log(window.modalPicCarousel.style.display);
    if(window.modalPicCarousel.style.display=="none")
      return;

    const oldthb=window.modalPicCarousel.oldimg;  
    const imgstrip=window.modalPicCarousel.bar;
    console.log(e);  

    const target = e.target;
    const sources = modalPicCarousel.carouselItems;
    var thbsrc = null;
    var thb = null;
    console.log(e.type);
    console.log(target.tagName);

    var found = -1;
    if(oldthb)
      found = sources.indexOf(oldthb.src);
    else
      found = sources.indexOf(modalPicCarousel.display.src);
    console.log(found);
    if(found==-1)
    {
      console.error("slideLeftRight(): Cannot locate current thumbnail:");
      console.error("Old image was displayed in either (first prefereed):");
      console.error(oldthb);
      console.error(modalPicCarousel.display);
      console.error("Cannot find in list of url for images:");
      console.error(sources);
      console.error("which will then be used to find next or prev");
      return;
    }

    var incrementOrDecrement = null;
    if(e.type=="click" && target.tagName=="SPAN") {
        console.log(target.innerHTML);
        if(target.innerHTML=="&gt;") 
          incrementOrDecrement="+";
        else if(target.innerHTML=="&lt;") 
          incrementOrDecrement="-";
        else {
          console.error("slideLeftRight(): span click not handled correctly, only click on < or > valid:");
          console.error(e);
          return;
        }
    } else if(e.type=="keyup") {
      if(e.key=="ArrowRight") 
        incrementOrDecrement="+";
      else if(e.key=="ArrowLeft") 
        incrementOrDecrement="-";
      else if(e.key=="Escape") {
        closeCarousel();
        return;
      } 
      else {
          console.warning("slideLeftRight(): Only ArrowRight and ArrowLeft handled by carousel");
          console.warning(e);
          return;
      }
    } else {
      console.error("slideLeftRight(): Did not find event handler sub-branch for:");
      console.error(e);
      return;
    }

    if(incrementOrDecrement=="+") {
      console.log((found+1)%sources.length);
      found = (found+1)%sources.length;
    } else if(incrementOrDecrement=="-") {
      console.log((sources.length+found-1)%sources.length);
      found = (sources.length+found-1)%sources.length;
    } else {
      console.error("slideLeftRight(): internal error: by now, increment or decrement should be + or -");
      console.error(incrementOrDecrement);
      return;
    }


    thbsrc = sources[found];
    thb = imgstrip.childNodes[found];

    const img = modalPicCarousel.display;
    console.log(thbsrc);
    console.log(img);
    img.src = thbsrc;

    console.log(oldthb);
    console.log(thb);
    thb.style.border="8px solid white";
    thb.scrollIntoView();

    if(oldthb)
      oldthb.style.border="8px solid transparent";

    window.modalPicCarousel.oldimg = thb;
}
function wheelZoom(e){
  const zoom = e.deltaY;
  const units = e.deltaMode;
  const img = modalPicCarousel.display;
  if(!img.originalSize)
    img.originalSize={w:img.clientWidth, h:img.clientHeight};

  var new_w, new_h;
  if(zoom<0) {
    new_w = (img.clientWidth * 1.25);
    new_h = (img.clientHeight * 1.25);
  } else if(zoom>0) {
    new_w = (img.clientWidth / 1.25);
    new_h = (img.clientHeight / 1.25);
  }
  if((new_w<img.originalSize.w) || (new_h<img.originalSize.w)) {
    img.style.width = img.originalSize.w+"px";
    img.style.height = img.originalSize.h+"px";
  } else {
    img.style.width = new_w+"px";
    img.style.height = new_h+"px";
  }
}
function openCarousel(clickedimg, gallery) {
    var modalBackground = window.modalBackground;
    if(!modalBackground) {
        modalBackground = document.createElement("div");
        modalBackground.style.position = "fixed";
        modalBackground.style.top = "0px";
        modalBackground.style.left = "0px";
        modalBackground.style.width = "100%";
        modalBackground.style.height = Math.round(window.innerHeight) + "px"; //"100%";
        modalBackground.style.backgroundColor="rgba(0,0,0,0.5)";
        window.modalBackground = modalBackground;
        document.body.appendChild(modalBackground);
        console.log(window.innerWidth);
        console.log(window.innerHeight);
    }
    modalBackground.style.display="block";
    var modalPicCarousel = window.modalPicCarousel;
    if(!modalPicCarousel) {
        modalPicCarousel = document.createElement("div");
        modalPicCarousel.style.position = "static";
        modalPicCarousel.style.top = "0px";
        modalPicCarousel.style.left = "0px";
        modalPicCarousel.style.width = "100%";
        modalPicCarousel.style.height = "100%";
        window.modalPicCarousel = modalPicCarousel;
        modalBackground.appendChild(modalPicCarousel);
        

        const layout = document.createElement("table");
        layout.style.backgroundColor="green";
        modalPicCarousel.appendChild(layout);
        layout.style.backgroundColor="black";
        layout.style.position = "absolute";
        layout.style.width = "90%";  //Math.round(0.5*modalPicCarousel.clientWidth)+"px";
        layout.style.height = Math.round(0.9*modalPicCarousel.clientHeight)+"px";
        layout.style.top = (Math.round(0.02*modalPicCarousel.clientWidth))+"px";
        layout.style.left = Math.round(0.05*modalPicCarousel.clientHeight)+"px";

        const picture = layout.insertRow(-1);
        picture.style.height = Math.round(0.81*modalPicCarousel.clientHeight)+"px";
        const space = picture.insertCell(0);
        space.style.height = Math.round(0.81*modalPicCarousel.clientHeight)+"px";
        space.style.backgroundColor="black";
        space.style.textAlign="center";
        space.style.verticalAlign="middle";
        space.style.padding="0px";
        const leftArrow = document.createElement("SPAN");
        space.appendChild(leftArrow);
        leftArrow.innerHTML = "<";
        leftArrow.style.verticalAlign="middle";
        leftArrow.style.color="white";
        leftArrow.style.fontSize="48pt";
        leftArrow.style.fontWeight="bold";
        leftArrow.style.backgroundColor="gray";
        leftArrow.style.cursor="pointer";
        leftArrow.addEventListener("click",slideLeftRight);
        const display = document.createElement("IMG");
        display.src="...";
        display.alt="...";
        display.style.verticalAlign="middle";
        display.style.maxWidth = Math.round(0.95*modalPicCarousel.clientWidth)+"px";
        display.style.maxHeight = Math.round(0.81*modalPicCarousel.clientHeight)+"px";
        space.appendChild(display);
        modalPicCarousel.display = display;
        document.body.addEventListener("keyup",slideLeftRight);
        //display.addEventListener("wheel",wheelZoom); //wheel zoom is buggy
        //display.style.height = "100%";
        const rightArrow = document.createElement("SPAN");
        rightArrow.innerHTML = ">";
        rightArrow.style.color="white";
        rightArrow.style.verticalAlign="middle";
        rightArrow.style.fontSize="48pt";
        rightArrow.style.fontWeight="bold";
        rightArrow.style.backgroundColor="gray";
        rightArrow.style.cursor="pointer";
        rightArrow.addEventListener("click",slideLeftRight);
        space.appendChild(rightArrow);

        const strip = layout.insertRow(-1);
        strip.style.height = Math.round(0.13*modalPicCarousel.clientHeight)+"px";
        const bar = strip.insertCell(0);
        bar.style.backgroundColor="#333333";
        bar.style.height = Math.round(0.13*modalPicCarousel.clientHeight)+"px";
        bar.style.width = Math.round(0.81*modalPicCarousel.clientWidth)+"px";
        bar.style.maxWidth = Math.round(0.81*modalPicCarousel.clientWidth)+"px";
        bar.style.textAlign="center";
        bar.style.overflowX="scroll";
        bar.style.overflowY="none";
        bar.noWrap = true;
        modalPicCarousel.bar = bar;
        

        const closeX = document.createElement("IMG");
        closeX.src="https://st.depositphotos.com/1041120/1285/i/450/depositphotos_12851976-stock-illustration-painted-x-mark.jpg";
        modalPicCarousel.appendChild(closeX);
        closeX.style.position = "absolute";
        closeX.style.width="25px";
        closeX.style.height="25px";
        closeX.style.right="5%";
        closeX.style.top="2%";
        closeX.style.cursor="pointer";
        closeX.addEventListener("click", function(e) { console.log("asdasd"); closeCarousel(); });

    }

    modalPicCarousel.style.display="block";
    
//  parentBlock.fnGetSubFigureList=fnGetSubFigureList;
//  parentBlock.fnGetBlockItem=fnGetBlockItem;
//  parentBlock.fnGetImgReplace=fnGetImgReplace;
//  parentBlock.fnGetImgItem=fnGetImgItem;

    const img = modalPicCarousel.display;
    img.src = clickedimg.src;

    const list = gallery.fnGetSubFigureList(gallery);
    const sources = list.map(s=>gallery.fnGetImgItem(s).src);
    const imgstrip = modalPicCarousel.bar;
    imgstrip.innerHTML = "";
    const thb_height = Math.round(0.13*modalPicCarousel.clientHeight)+"px";
    for(var i=0; i<sources.length; i++){
        const thb = document.createElement("IMG");
        thb.src = sources[i]; //gallery.fnGetImgItem(list[i]).src;
        thb.style.height = thb_height;
        //thb.style.height="100%";
        thb.style.width="auto";
        thb.style.border="8px solid transparent";
        thb.style.cursor="pointer";
        thb.addEventListener("click", putUp);
        imgstrip.appendChild(thb);
        if(sources[i]==clickedimg.src) {
            thb.style.border="8px solid white";
            modalPicCarousel.oldimg = thb;
        }
    }
    modalPicCarousel.carouselItems = sources;
}


function checkLoaded() { 
  if (document.readyState === "complete") { 
    // Your code here 
    const list1=getShortcodeGalleryList();
    console.log(list1);
    for(var i=0; i<list1.length; i++)
      justifyInlineGallery(list1[i],getShortcodeFigureList, getBlockElementFromShortcodeItem, getImgSrcFromShortcodeItem, getImgFromShortcodeItem); //object would work better here

    const list2=getGalleryBlockList();
    console.log(list2);
    for(var i=0; i<list2.length; i++)
      justifyInlineGallery(list2[i],getBlockFigureList, getBlockElementFromBlockItem, getImgSrcFromBlockItem,  getImgFromBlockItem, 5); //object would work better here
    
} else { 
    setTimeout(checkLoaded, 10); 
  } 
}
window.addEventListener("load", checkLoaded);
