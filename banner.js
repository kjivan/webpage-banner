var d = document.createElement("div");
d.style.position = "sticky";
d.style.top = "0px";
d.style.zIndex = "16777271";
d.style.width = "100%";
d.style.height = "30px";
d.style.padding = "2px";
d.style.fontSize = "20px";
d.style.backgroundColor = "red";
d.style.color = "black";
d.append(document.createTextNode("Production Environment"));

document.body.insertBefore(d, document.body.firstChild);
