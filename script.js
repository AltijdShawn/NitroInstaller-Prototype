import Utils from "./lib/allUtils.lib.js";
const Select = (In) => new Utils().getDomElement(In);
let progress = Select(".progress");
progress.value = 0

// for (let i = 0; i < 100;) {
// 	setTimeout(() => {
// 		progress.value = i
// 		i++
// 	}, 100)
// }

var i = 0;
function moveProgressBar(max) {
	if (i == 0) {
		i = 1;
		var elem1 = document.querySelector(".progress");
		var elem2 = document.querySelector(".percentage");
		var width = 10;
		var id = setInterval(frame, 20);
		function frame() {
			if (width >= max) {
				clearInterval(id);
				i = 0;
			} else {
				width++;
				elem1.style.width = width + "%";
				elem2.innerHTML = width + "%";
			}
		}
	}
}
moveProgressBar(100)