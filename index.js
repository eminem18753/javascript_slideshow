class Slide
{
	constructor(input)
	{
		this.id=input["id"];
		this.cls=input["cls"];
		this.items=input["items"];
		this.handle=null;
	}
	start()
	{
		function whichTransitionEvent(){
			var t;
			var el = document.createElement('fakeelement');
			var transitions = {
			  'transition':'transitionend',
			  'OTransition':'oTransitionEnd',
			  'MozTransition':'transitionend',
			  'WebkitTransition':'webkitTransitionEnd'
			}

			for(t in transitions){
				if( el.style[t] !== undefined ){
					return transitions[t];
				}
			}
		}
		function fadeOut(component,t)
		{
			var e=document.getElementById(component);
			e.style.transition="opacity "+t+"s linear 0s";
			e.style.opacity=0;
		}
		function fadeIn(component,t)
		{
			var e=document.getElementById(component);
			e.style.transition="opacity "+t+"s linear 0s";
			e.style.opacity=1;
		}
		document.getElementById("left-arrow-container").classList.remove("left-arrow-container");
		document.getElementById("left-arrow-container").classList.add("left-container");
		document.getElementById("left-arrow").classList.remove("left-arrow");
		document.getElementById("right-arrow-container").classList.remove("right-arrow-container");
		document.getElementById("right-arrow-container").classList.add("right-container");
		document.getElementById("right-arrow").classList.remove("right-arrow");
		document.getElementById("left-arrow-container").onclick=function(){return false;};
		document.getElementById("right-arrow-container").onclick=function(){return false;};
		var i=0;
		var delay=1;
		var n=this.items.length;
		var items=this.items;

		var nextImage=function()
		{
			var t=0.3;
			if(i%2==0)
			{
				fadeOut("slide-image",t);
				document.getElementById("slide-image").src=items[Math.floor(((i++)%(2*n))/2)];
				fadeIn("slide-image",t);				
			}
			else
			{
				fadeIn("slide-image",t);
				document.getElementById("slide-image").src=items[Math.floor(((i++)%(2*n))/2)];
				fadeOut("slide-image",t);				
			}
		}
		this.handle=setInterval(nextImage,delay*1000);
	}
	finish()
	{
		clearInterval(this.handle);
		document.getElementById("slide-image").style.opacity=1;
	}
}
class Carousel extends Slide
{
	constructor(input)
	{
		super(input);
	}
	start()
	{	
		function fadeOut(component,t)
		{
			var e=document.getElementById(component);
			e.style.transition="opacity "+t+"s linear 0s";
			e.style.opacity=0;
		}
		function fadeIn(component,t)
		{
			var e=document.getElementById(component);
			e.style.transition="opacity "+t+"s linear 0s";
			e.style.opacity=1;
		}
		var items=this.items;
		var reverse_mapping={};
		for(var i=0;i<items.length;i++)
		{
			reverse_mapping[items[i]]=i;
		}
		var n=items.length;
		document.getElementById("left-arrow-container").classList.add("left-arrow-container");
		document.getElementById("left-arrow-container").classList.remove("left-container");
		document.getElementById("left-arrow").classList.add("left-arrow");
		document.getElementById("right-arrow-container").classList.add("right-arrow-container");
		document.getElementById("right-arrow-container").classList.remove("right-container");
		document.getElementById("right-arrow").classList.add("right-arrow");

		var mySlide = document.getElementById("slide-image");
		mySlide.src=items[0];
		var leftFlag=0;
		var left = function() {
		  return function () {
			 if (mySlide)
			 {
				var previous=items[(reverse_mapping[mySlide.getAttribute("src")]+n-leftFlag)%n];
				var t=0.3;
				if(leftFlag==0)
				{
					fadeIn("slide-image",t);
					mySlide.setAttribute("src",previous);
					fadeOut("slide-image",t);
					leftFlag=1;
					setTimeout(left(),500);
				}
				else
				{
					fadeOut("slide-image",t);
					mySlide.setAttribute("src",previous);
					fadeIn("slide-image",t);
					leftFlag=0;
				}
			 }
		  }
		};
		var rightFlag=0;
		var right = function() {
		  return function () {
			 if (mySlide)
			 {
				var next=items[(reverse_mapping[mySlide.getAttribute("src")]+rightFlag)%n];
				var t=0.3;
				if(rightFlag==0)
				{
					fadeIn("slide-image",t);					
					mySlide.setAttribute("src",next);
					fadeOut("slide-image",t);
					rightFlag=1;
					setTimeout(right(),500);
				}
				else
				{
					fadeOut("slide-image",t);
					mySlide.setAttribute("src",next);
					fadeIn("slide-image",t);
					rightFlag=0;					
				}
			 }
		  }
		};
		this.leftRotate=left();
		this.rightRotate=right();
		document.getElementById("left-arrow-container").addEventListener("click",this.leftRotate,false);
		document.getElementById("right-arrow-container").addEventListener("click",this.rightRotate,false);
	}
	finish()
	{
		document.getElementById("slide-image").style.opacity=1;
		document.getElementById("left-arrow-container").removeEventListener("click", this.leftRotate);
		document.getElementById("right-arrow-container").removeEventListener("click", this.rightRotate);
	}
}
var s = new Slide({
	id: "slide",
	cls: "my-theme",
	items: ["images/1.png", "images/2.png", "images/3.png"]
});
var c = new Carousel({
	id: "slide",
	cls: "my-theme",
	items: ["images/1.png", "images/2.png", "images/3.png"]	
});
window.onload=function()
{
	s.start();
	var state="slide";
	document.getElementById("slideshow-option").addEventListener("click",function(){
		document.getElementById("slide-image").src=s.items[0];
		if(state=="slide")
		{
			document.getElementById("slideshow-option").innerHTML="switch to slideshow";
			s.finish();
			c = new Carousel({
				id: "slide",
				cls: "my-theme",
				items: ["images/1.png", "images/2.png", "images/3.png"]	
			});
			c.start();
			state="carousel";
		}
		else
		{
			document.getElementById("slideshow-option").innerHTML="switch to carousel";
			c.finish();
			s = new Slide({
				id: "slide",
				cls: "my-theme",
				items: ["images/1.png", "images/2.png", "images/3.png"]
			});
			s.start();
			state="slide";
		}
	},false);
}
