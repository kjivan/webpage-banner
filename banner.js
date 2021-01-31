var d = document.createElement("div");
d.style.position = "sticky";
d.style.top = "0px";
d.style.zIndex = "2147483647";
d.style.width = "100%";
d.style.height = "30px";
d.style.padding = "2px";
d.style.fontSize = "20px";
d.style.textAlign = "left";
d.style.backgroundColor = "#E53935";
d.style.color = "#333333";
d.append(document.createTextNode("Production Environment"));

document.body.insertBefore(d, document.body.firstChild);
