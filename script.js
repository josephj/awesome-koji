var VERTICAL_TYPE = "Vertical";
var USECASE_TYPE = "UseCase";

// Item class 
var Item = function(text,value,type){
  this.text = text;
  this.value = value;
  this.type = type;
}

var VerticalItem = function(text,value){
  Item.call(this,text,value,VERTICAL_TYPE);
}
var UseCaseItem =function(text,value){
  Item.call(this,text,value,USECASE_TYPE);
}

var Filter = function(){
  this.verticals = [];
  this.usecases = [];  
};

Filter.prototype.getSelectedTagIds = function(){
  var ids = this.verticals.map(function (vertical) {
    return vertical.value;
  }).join(',');
  ids += ",";
  ids += this.usecases.map(function (usecases) {
    return usecases.value;
  }).join(',');
  return ids;
};

Filter.prototype.getItems = function(itemType){
  if(itemType === VERTICAL_TYPE) return this.verticals;
  else if(itemType === USECASE_TYPE) return this.usecases;
};

Filter.prototype.add = function(txt,val,type){
  var newItem;
  if(type === VERTICAL_TYPE){
    newItem = new VerticalItem(txt,val);
    this.verticals.push(newItem);
  }
  else if(type === USECASE_TYPE){
    newItem = new UseCaseItem(txt,val);
    this.usecases.push(newItem);
  }
};

Filter.prototype.remove = function(val,type){
  var items = this.getItems(type);
  var newItems = items.filter(function (i) {
    return i.value != val;      
  });

  if(type === VERTICAL_TYPE) {
    this.verticals = newItems;
  }
  else if(type === USECASE_TYPE) {
    this.usecases = newItems;
  }
}

Filter.prototype.showList = function(){
  var element = "";
  $("#conditions").empty();
  if(!this.verticals.length && !this.usecases.length){
    element = "<div class='itemBlank'>Search...</div>";
  }
  else{
    for(let i = 0; i < this.verticals.length; i++){
      element += "<div class='item verticalItem' onclick='filterItemClick(this)' data-value='"
        + this.verticals[i].value + "'>" 
        + this.verticals[i].text + "</div>";
    }
    for(let i = 0; i < this.usecases.length; i++){
      element += "<div class='item usecaseItem' onclick='filterItemClick(this)' data-value='" 
        + this.usecases[i].value + "'>" 
        + this.usecases[i].text + "</div>";
    }  
  }

  $("#conditions").append(element);

  // dynamic filter by Tags
  //var tagIds = this.getSelectedTagIds(); 
  //$(".stackla-widget").attr("data-tags",tagIds);
};

// main code
var $filter = new Filter();
var $widgetId;

$(document).ready(function(){
  initialize();
  var verticalItems = $(".searchVerticalItem");
  var usecaseItems = $(".searchUseCaseItem");

  for(let i = 0 ; i< verticalItems.length; i++){
    verticalItems[i].addEventListener('change',function(e){
      sideBarVerticalChange(e);
    });
  }
  for(let i = 0 ; i< usecaseItems.length; i++){
    usecaseItems[i].addEventListener('change',function(e){
      sideBarUsecaseChange(e);
    });
  }
});

function filterItemClick(e){
  var val = $(e).data('value');
  var type, elems;

  if($(e).hasClass("verticalItem")){
    type = VERTICAL_TYPE;
    elems = $(".searchVerticalItem");
  }
  else if($(e).hasClass("usecaseItem")){
    elems = $(".searchUseCaseItem");
    type = USECASE_TYPE;
  }

  $filter.remove(val,type);

  for(let i = 0; i < elems.length; i++){   
    if(elems[i].value == val){
      elems[i].checked = !elems[i].checked;
    }
  }
  $filter.showList();

  // TODO
  //StacklaFluidWidget.changeFilter(data-id, 72731);
}

function sideBarItemChange(e,type){
  var val = e.target.value;
  var txt = $(e.target).parent()[0].innerText;
  if($(e.target).is(':checked')){
    $filter.add(txt,val,type);
  }
  else{
    $filter.remove(val,type);
  }
  
  $filter.showList();
}

function sideBarVerticalChange(e){
  sideBarItemChange(e,VERTICAL_TYPE);
}
function sideBarUsecaseChange(e){
  sideBarItemChange(e,USECASE_TYPE);
}

function getVerticalItem(value){
  var items = $filter.verticals;
  return this.getItem(items,value);
}

function getItem(items,value){
  for (let i = 0; i < items.length; i++) { 
    if(items[i].value == value){
      return items[i];
    }
  }
  return null;
}

function getUseCaseItem(value){
  var items = $filter.usecases;
  return this.getItem(items,value);
}

function initialize(){
  this.$widgetId = $(".stackla-widget").attr("data-id");
  $filter.showList();
}
