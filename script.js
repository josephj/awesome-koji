const VERTICAL_TYPE = "Vertical";
const VERTICAL_ITEM_CLSNAME = "verticalItem";
const USECASE_TYPE = "UseCase";
const USECASE_ITEM_CLSNAME = "usecaseItem";

// Item class 
var Item = function(text,value,type){
  this.text = text;
  this.value = value;
  this.type = type;
}

var VerticalItem = function(text,value) {
  Item.call(this,text,value,VERTICAL_TYPE); 
}
var UseCaseItem = function(text,value){
  Item.call(this,text,value,USECASE_TYPE);
}

var Filter = function(){
  this.verticals = [];
  this.usecases = [];
};

Filter.prototype.getSelectedTagIds = function(){
  var ids = this.verticals.map((vertical) => {
    return vertical.value;
  }).join(',');
  ids += ",";

  ids += this.usecases.map((usecases) => {
    return usecases.value;
  }).join(',');
  return ids;
};

Filter.prototype.getFilterItems = function(itemType){
  return (itemType === VERTICAL_TYPE) ? this.verticals : (itemType === USECASE_TYPE) ? this.usecases : null;
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
  var items = this.getFilterItems(type);
  var newItems = items.filter((i) => {
    return i.value != val;      
  });

  if(type === VERTICAL_TYPE) {
    this.verticals = newItems;
  }
  else if(type === USECASE_TYPE) {
    this.usecases = newItems;
  }
}

Filter.prototype.createItemHtml = function(){
  
  if(!this.verticals.length && !this.usecases.length)
    return "<div class='itemBlank'>Search...</div>";
 
  var itemHtmls = "";
  $.each(this.verticals,function(index,elem){
    itemHtmls += `<div class='item ${VERTICAL_ITEM_CLSNAME}' onclick='filterItemClick(this)' data-value='${elem.value}'>${elem.text}</div>`;
  });
  $.each(this.usecases,function(index,elem){
    itemHtmls += `<div class='item ${USECASE_ITEM_CLSNAME}' onclick='filterItemClick(this)' data-value='${elem.value}'>${elem.text}</div>`;
  });
  
  return itemHtmls;
}

Filter.prototype.showList = function(){
  $("#conditions").empty();
  $("#conditions").append(this.createItemHtml());

  // dynamic filter by Tags
  //var tagIds = this.getSelectedTagIds(); 
  //$(".stackla-widget").attr("data-tags",tagIds);
};

// main code
var $filter = new Filter();
var $widgetId;

$(document).ready(function(){
  initialize();

  $('#sidebar').on('change', '.searchVerticalItem, .searchUseCaseItem', (e) => {
    if($(e.target).hasClass("searchVerticalItem")){
      sideBarVerticalChange(e);
    }
    else if($(e.target).hasClass("searchUseCaseItem")){
      sideBarUsecaseChange(e);
    }
  });
});

function initialize(){
  this.$widgetId = $(".stackla-widget").attr("data-id");
  $filter.showList();
}

function filterItemClick(e){
  var val = $(e).data('value');
  var type, elems;
  
  if($(e).hasClass(VERTICAL_ITEM_CLSNAME)){
    type = VERTICAL_TYPE;
    elems = $(".searchVerticalItem");
  }
  else if($(e).hasClass(USECASE_ITEM_CLSNAME)){
    elems = $(".searchUseCaseItem");
    type = USECASE_TYPE;
  }
 
  $filter.remove(val,type);

  $.each(elems, function(idx,elem){
    if(elem.value == val) elem.checked = !elem.checked;
  })

  $filter.showList();

  // TODO
  //StacklaFluidWidget.changeFilter(data-id, 72731);
}

function sideBarItemChange(e,type){
  var val = e.target.value;
  var txt = $(e.target).parent()[0].innerText;

  ($(e.target).is(':checked')) ? $filter.add(txt,val,type) : $filter.remove(val,type);

  $filter.showList();
}

function sideBarVerticalChange(e){
  sideBarItemChange(e,VERTICAL_TYPE);
}
function sideBarUsecaseChange(e){
  sideBarItemChange(e,USECASE_TYPE);
}