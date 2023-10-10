let instances = [],
	highestZIndex = 0;

window.addEventListener('resize', () => {
	for (let i = 0; i < instances.length; i++) {
		let instance = instances[i];
		if (instance.frozen) continue;
	}
});

class PageWindow {
	static defaultWidth = 300;
	static defaultheight = 200;

	constructor ({
		title,
		icon,
		buttons = [],
		x = window.innerWidth / 2,
		y = window.innerHeight / 2,
		width = defaultWidth,
		height = defaultheight,
		frozen = false,
		resizable = false,
		verticalOrigin = "center",
		horizontalOrigin = "center",
	}) {

		this.icon = icon;
		this.title = title;
		this.tooltip = tooltip;

		this.X = x;
		this.Y = y;
		this.width = width;
		this.height = height;
		this.frozen = frozen;
		this.resizable = resizable;
		this.verticalOrigin = verticalOrigin;
		this.horizontalOrigin = horizontalOrigin;

		this.isDestroyed = false;

		//TODO: actually do stuff with html elements

		instances.push(this);
	}
	set x(x) {
		this.X = x;
	}
	set y(y) {
		this.Y = y;
	}
	destroy() {
		if (this.isDestroyed) throw new Error('Cannot destroy an already destroyed PageWindow.');
		this.isDestroyed = true;

		instance.splice(instance.indexOf(this), 1);
	}
}

window.PageWindow = PageWindow;