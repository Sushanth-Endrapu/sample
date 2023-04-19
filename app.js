//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose=require('mongoose')
const _=require('lodash')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todoListDB")

const itemsSchema={
  name:String
}

const Item=mongoose.model('Item',itemsSchema)

const item1=new Item({
  name:'welcome to todoList'
})

const item2=new Item({
  name:'hi and hello'
})

const item3=new Item({
  name:'welcome and see you'
})

const defaultItems=[item1,item2,item3]

const listSchema={
  name:String,
  items:[itemsSchema]
}

const List=mongoose.model('List',listSchema)

app.get("/", function(req, res) {
// const day = date.getDate();
Item.find({})
  .then((fruits) => {
    if(fruits.length===0){
      Item.insertMany(defaultItems)
      res.redirect('/')
    }else{
        res.render("list", {listTitle: 'Today', newListItems: fruits});
    }
  })
  .catch((err) => {
    console.error(err);
  });
});

app.post("/", function(req, res){

const itemName=req.body.newItem

const listName=req.body.list

const item=new Item({
  name:itemName
})

if(listName==='Today'){
  item.save()
  res.redirect('/')
}else{
  List.findOne({name:listName}).then((foundList)=>
  {
    foundList.items.push(item)
    foundList.save()
    res.redirect('/'+listName)
  }
)
}
});

app.post('/delete',function(req,res){

const checkItemID=req.body.checkbox
const listName=req.body.listName
if(listName==='Today'){
  Item.findByIdAndDelete(checkItemID).exec()
  res.redirect('/')
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemID}}}).then((foundItem)=>{
  }
)
  res.redirect('/'+listName)
}
})

app.get('/:customListName',function(req,res){
  const customListName=_.capitalize(req.params.customListName)
  List.findOne({name:customListName}).then((foundList)=>{
if(!foundList)
{
  const list=new List({
    name:customListName,
    items:defaultItems
  })
  list.save()
  res.redirect("/"+customListName)
}
else{
  res.render('list',{listTitle:foundList.name,newListItems:foundList.items})
}
})
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
