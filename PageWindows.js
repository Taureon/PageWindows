let instances = [],
	highestZIndex = 0,
	currentInstance = null,

defaultStyles = {
	main: {},
	head: { height: '30px', padding: '5px' },
	icon: { width: '16px', height: '16px' },
	title: { height: '50px' },
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
},

clampWindowPositions = () => {
	for (let i = 0; i < instances.length; i++) {
		if (!instances[i].frozen) {

			//this code activates setters
			instances[i].x *= 1;
			instances[i].y *= 1;
		}
	}
};

window.addEventListener('resize', clampWindowPositions);

document.onmousemove = mouseEvent => {

    //future proofing
    if (!mouseEvent.isTrusted) return;

    for (let movableWindow of movableWindows) {
        if (movableWindow.enable) {
            applyStyle(movableWindow.element, {
                left: (mouseEvent.clientX - movableWindow.offsetX) + 'px',
                top: (mouseEvent.clientY - movableWindow.offsetY) + 'px'
            });
        }
    }
    clampWindowPositions();
};

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

		this.x = x;
		this.y = y;
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
		this.elementMain = createElement('div', mergeObjects(defaultStyles.main, { width: width + 'px', height: height + 'px', 'z-index': highestZIndex++ }), {}, [ this.elementHead, this.elementContent ]);

		document.body.append(this.elementMain);
		instances.push(this);
	}

	get x() { return this.X; }
	set x(x) { return this.X = x; } //TODO: make sure window stays inside tab window
	get y() { return this.Y; }
	set y(y) { return this.Y = y; } //TODO: make sure window stays inside tab window

	clampPosition () {}

	destroy () {
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