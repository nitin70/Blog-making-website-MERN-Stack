//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const _ = require("lodash");
const homeStartingContent = "Welcome,You can write Your Blog Here.This is a complete Blog website.If you want to add your data go to the cmpose tab maintion above and then Give title to your blog and write your content in the content box. ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "We are The Doge Developers.Doge Developers is a software development company that specializes in creating websites using the MERN stack. We have a team of experienced developers who are dedicated to delivering high-quality web solutions for our clients. Our focus is on delivering fast, user-friendly, and visually appealing websites that help businesses reach their online goals.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postContent = "";
const postID = "";

mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post",postSchema);

app.get("/", function(req,res){

  Post.find({},function(err, foundPost){
    if (!err) {
      res.render("home", {startingContent: homeStartingContent, 
        posts: foundPost
        });
    }
  });
});


app.get("/contact", function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get("/about", function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.get("/posts/:postName", function(req, res){
  
  const requestedTitle = _.lowerCase(req.params.postName);
  Post.findOne({title:req.params.postName},function(err,completePost){
    if (!err) {
      const storedTitle = _.lowerCase(completePost.title);
        res.render("post",{
          pageHeading: completePost.title,
          pageTitle: completePost.content,
          pageId: completePost._id
        });
    }
  });

});


app.post("/compose",function(req,res){

  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;  

  const post = new Post( {
    title: postTitle,
    content: postContent
  });
  post.save();
  res.redirect("/");
});

app.post("/update",function(req,res){
  const button = req.body.button1 ? 'button1' : 'button2';
  const pageid = req.body.pagename;
  if (button == "button2") {
    Post.findByIdAndRemove(pageid,function(err){
      if(!err) {
        console.log("Deleted checked item!");
        res.redirect("/");
      }
    });  
  }
  else {

    Post.findOne({_id:pageid},function(err,completePost){
      if (!err) {
        res.render("edit",{pageMaterial:completePost.content,
          pageid:pageid,
          pageTitle:completePost.title
        });
      }
    });
  }
});
app.post("/edit",function(req,res){
  const editedText = req.body.postbody;
  const pageid = req.body.pageid;
  const pagetitle = req.body.pagetitle;
  console.log(pageid);
  const id = mongoose.Types.ObjectId(pageid);
  Post.findByIdAndUpdate(id, { $set: { content:editedText } }, { new: true }, function(err, post) {
    if (!err){
      res.redirect("/posts/"+pagetitle);
    }
  });
  
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
