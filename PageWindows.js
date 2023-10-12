let instances = [],
	highestZIndex = 0,

defaultStyles = {
	main: {},
	head: { height: '30px', padding: '5px' },
	icon: { width: '16px', height: '16px' },
	title: {},
	button: { wdith: '16px', height: '16px', margin: '4px', 'margin-right': '0px' },
	content: { width: '100%', height: '100%'},
	buttonHolder: { 'padding-right': '4px' }
},

applyAttrbutes = (object, attributes) => {
    for (let key in attributes) object[key] = attributes[key];
    return object;
},

mergeObjects = objs => {
	let result = {};
	for (let obj of objs) applyAttrbutes(result, obj);
	return result;
},

applyStyle = (element, style) => applyAttrbutes(element.style, style),

createElement = (type, style = {}, attributes = {}, children = []) => {
    let element = document.createElement(type);
    applyStyle(element, style);
    applyAttrbutes(element, attributes);
    for (let child of children) element.append(child);
    return element;
};

window.addEventListener('resize', () => {
	for (let i = 0; i < instances.length; i++) {
		let instance = instances[i];
		if (instance.frozen) continue;
	}
});

class PageWindow {
	static defaultWidth = 300;
	static defaultHeight = 200;
	static defaultStyles = defaultStyles;

	constructor ({
		title,
		icon,
		buttons = [],
		x = window.innerWidth / 2,
		y = window.innerHeight / 2,
		width = defaultWidth,
		height = defaultHeight,
		frozen = false,
		resizable = false,
		verticalOrigin = "center",
		horizontalOrigin = "center",
	}) {

		this.X = x;
		this.Y = y;
		this.width = width;
		this.height = height;
		this.frozen = frozen;
		this.resizable = resizable;
		this.verticalOrigin = verticalOrigin;
		this.horizontalOrigin = horizontalOrigin;

		this.isDestroyed = false;

		this.elementButtons = [];
		for (let { icon, tooltip, click } of buttons) {
			this.elementButtons.push(createElement('div', defaultStyles.button, {
				title: tooltip,
				onclick: click
			}), [ icon ]);
		}
		this.elementButtonHolder = createElement('div', defaultStyles.buttonHolder, this.elementButtons);
		this.elementContent = createElement('div', defaultStyles.content);
		this.elementTitle = createElement('div', defaultStyles.title, { innerText: title });
		this.elementIcon = createElement('div', defaultStyles.icon, {}, [ icon ]);
		this.elementHead = createElement('div', defaultStyles.head, { /*make draggable*/ }, [ this.elementIcon, this.elementTitle, this.elementButtonHolder ]);
		this.elementMain = createElement('div', mergeObjects(defaultStyles.main, { 'z-index': highestZIndex++ }), {}, [ this.elementHead, this.elementContent ]);

		instances.push(this);
	}

	set x(x) { this.X = x; }
	set y(y) { this.Y = y; }

	destroy() {
		if (this.isDestroyed) throw new Error('Cannot destroy an already destroyed PageWindow.');
		this.isDestroyed = true;

		for (let button of this.elementButtons) button.remove();
		this.elementButtonHolder.remove();
		this.elementContent.remove();
		this.elementTitle.remove();
		this.elementIcon.remove();
		this.elementHead.remove();
		this.elementMain.remove();

		instance.splice(instance.indexOf(this), 1);
	}
}

window.PageWindow = PageWindow;