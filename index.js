import express from "express";
import bodyParser from "body-parser";

const app=express();
const port=process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const posts = [];
let nextIndex=1;

app.post("/post", (req, res) => {
  const newPost = {
    id:nextIndex++,
    title: req.body.post,
    author: req.body.author,
    content: req.body.article,
  };

  posts.push(newPost);
  console.log("New post created:", newPost);
  res.redirect("/entries"); // Or render a success page
});

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

app.get("/faq",(req,res)=>{
    res.render("faq.ejs");
});

app.get("/create",(req,res)=>{
    res.render("newpost.ejs",{
        post:null,
        isEditing:false,
    });
});

app.get("/entries",(req,res)=>{
    res.render("entries.ejs",{
        posts:posts,
    });
});

app.get("/edit/:id",(req,res)=>{
    const postId=parseInt(req.params.id);
    const post=posts.find(p=>p.id===postId);

    if(!post){
        return res.status(404).send("Post not found");
    }

    res.render("newpost.ejs",{
        isEditing:true,
        post:post,
    });
});

app.post("/edit/:id",(req,res)=>{
    const postId=parseInt(req.params.id);
    const post=posts.find(p=>p.id===postId);

    if(!post){
        return res.status(404).send("Post not found");
    }

    post.title=req.body.post;
    post.author=req.body.author;
    post.content=req.body.article;

    res.redirect("/entries");
});

app.post("/delete/:id",(req,res)=>{
    const postId=parseInt(req.params.id);
    const index=posts.findIndex(p=>p.id===postId);

    if(index!=-1){
        posts.splice(index,1);
        console.log("Deleted Journal entry with id "+postId);
    }

    res.redirect("/entries");
});

app.listen(port,()=>{
    console.log("App is running in port "+port);
});


