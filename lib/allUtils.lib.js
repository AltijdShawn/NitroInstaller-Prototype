/**
 * @type Class
 * @name "Utils"
 * @comment "This class defines all utils"
 * @author "xA_Emiloetjex"
 */

export default class Utils {
	constructor() { }
	/**
	* @type Function
	* @name "makeid"
	* @comment "Generates an random string of characters"
	* @param {Number} length - The length of the string
	* @returns {String} - The random string

	* @author "xA_Emiloetjex"
	*/
	makeid(length) {
		let result = '';
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	/**
	 * @type Function
	 * @name "getDomElement"
	 * @comment "Returns a DOM element"
	 * @params ({String} selector)
	 * @returns {HTMLElement}
	 
	 * @author "xA_Emiloetjex"
	 */
	getDomElement(selector) {
		return document.querySelector(selector);
	}

	/**
	 * @type Function
	 * @name "someFunction"
	 * @comment "Just testing something"
	 * @params ({any} _args, {void} callback)
	 */
	someFunction(_args, callback) {
		callback(_args);
	}
}

const GetDomElement = new Utils().getDomElement;

export class InfoUtils {
	constructor() { }
	displayInfo(where, text) {
		const element = GetDomElement(where);
		element.innerHTML = text;
	}
	getResolution(target) {
		if (target == window) {
			return {
				width: window.innerWidth,
				height: window.innerHeight
			};
		} else {
			const element = target;
			const width = element.clientWidth;
			const height = element.clientHeight;
			return {
				width,
				height
			};
		}
	}
	getTitle() {
		return document.title;
	}
}

export class Cookies {
	constructor() { }
	Set(cname, cvalue, exdays) {
		const d = new Date();
		if (exdays == undefined) exdays = 30;

		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		let expires = 'expires=' + d.toGMTString();
		document.cookie =
			cname + '=' + cvalue + ';' + expires + ';path=/;' + 'secure=true;';
	}
	Get(cname) {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}
	Check(cname) {
		let cookie = this.Get(cname);
		if (cookie == '' || cookie == undefined || cookie == null) {
			return false;
		} else {
			return true;
		}
	}
	CheckIf(cname, cvalue) {
		if (this.Get(cname) == cvalue) return true;
		else return false;
	}
	CheckIfCB(cname, cvalue, callback) {
		if (this.Get(cname) == cvalue) callback(true);
		else callback(false);
	}
}

const DEFAULT_OPTIONS = {
	autoClose: 5000,
	position: 'top-right',
	onClose: () => { },
	canClose: true,
	showProgress: true
};

export class Toast {
	#toastElem;
	#autoCloseInterval;
	#progressInterval;
	#removeBinded;
	#timeVisible = 0;
	#autoClose;
	#isPaused = false;
	#unpause;
	#pause;
	#visibilityChange;
	#shouldUnPause;

	constructor(options) {
		this.#toastElem = document.createElement('div');
		this.#toastElem.classList.add('toast');
		requestAnimationFrame(() => {
			this.#toastElem.classList.add('show');
		});
		this.#removeBinded = this.remove.bind(this);
		this.#unpause = () => (this.#isPaused = false);
		this.#pause = () => (this.#isPaused = true);
		this.#visibilityChange = () => {
			this.#shouldUnPause = document.visibilityState === 'visible';
		};
		this.update({ ...DEFAULT_OPTIONS, ...options });
	}

	set autoClose(value) {
		this.#autoClose = value;
		this.#timeVisible = 0;
		if (value === false) return;

		let lastTime;
		const func = time => {
			if (this.#shouldUnPause) {
				lastTime = null;
				this.#shouldUnPause = false;
			}
			if (lastTime == null) {
				lastTime = time;
				this.#autoCloseInterval = requestAnimationFrame(func);
				return;
			}
			if (!this.#isPaused) {
				this.#timeVisible += time - lastTime;
				if (this.#timeVisible >= this.#autoClose) {
					this.remove();
					return;
				}
			}

			lastTime = time;
			this.#autoCloseInterval = requestAnimationFrame(func);
		};

		this.#autoCloseInterval = requestAnimationFrame(func);
	}

	set position(value) {
		const currentContainer = this.#toastElem.parentElement;
		const selector = `.toast-container[data-position="${value}"]`;
		const container =
			document.querySelector(selector) || createContainer(value);
		container.append(this.#toastElem);
		if (currentContainer == null || currentContainer.hasChildNodes()) return;
		currentContainer.remove();
	}

	set text(value) {
		// this.#toastElem.textContent = value
		this.#toastElem.innerHTML = value;
	}

	set canClose(value) {
		this.#toastElem.classList.toggle('can-close', value);
		if (value) {
			this.#toastElem.addEventListener('click', this.#removeBinded);
		} else {
			this.#toastElem.removeEventListener('click', this.#removeBinded);
		}
	}

	set showProgress(value) {
		this.#toastElem.classList.toggle('progress', value);
		this.#toastElem.style.setProperty('--progress', 1);

		if (value) {
			const func = () => {
				if (!this.#isPaused) {
					this.#toastElem.style.setProperty(
						'--progress',
						1 - this.#timeVisible / this.#autoClose
					);
				}
				this.#progressInterval = requestAnimationFrame(func);
			};

			this.#progressInterval = requestAnimationFrame(func);
		}
	}

	set pauseOnHover(value) {
		if (value) {
			this.#toastElem.addEventListener('mouseover', this.#pause);
			this.#toastElem.addEventListener('mouseleave', this.#unpause);
		} else {
			this.#toastElem.removeEventListener('mouseover', this.#pause);
			this.#toastElem.removeEventListener('mouseleave', this.#unpause);
		}
	}

	set pauseOnFocusLoss(value) {
		if (value) {
			document.addEventListener('visibilitychange', this.#visibilityChange);
		} else {
			document.removeEventListener('visibilitychange', this.#visibilityChange);
		}
	}

	set class(value) {
		this.#toastElem.classList.add(value);
	}

	update(options) {
		Object.entries(options).forEach(([key, value]) => {
			this[key] = value;
		});
	}

	remove() {
		cancelAnimationFrame(this.#autoCloseInterval);
		cancelAnimationFrame(this.#progressInterval);
		const container = this.#toastElem.parentElement;
		this.#toastElem.classList.remove('show');
		this.#toastElem.addEventListener('transitionend', () => {
			this.#toastElem.remove();
			if (container.hasChildNodes()) return;
			container.remove();
		});
		this.onClose();
	}
}

function createContainer(position) {
	const container = document.createElement('div');
	container.classList.add('toast-container');
	container.dataset.position = position;
	document.body.append(container);
	return container;
}
