const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;


// extension functions
const init = function() {
	return new dashVisible();
}

const dashVisible = new Lang.Class({
	Name: 'hideDash.dashVisible',

	_init: function() {
		this.observer = null;

		// store the values we are going to override
		this.old_x = Main.overview.viewSelector.actor.x;
		this.old_width = Main.overview.viewSelector.actor.get_width();
	},

	enable: function() {
		// global.log("enable hide-dash");
		this.observer = Main.overview.connect("showing", Lang.bind(this, this._hide));
	},

	disable: function() {
		// global.log("disable hide-dash");
		Main.overview.disconnect(this.observer);
		this._show();
	},

	_hide: function() {
		// global.log("show dash");
		Main.overview._dash.actor.hide();
		Main.overview.viewSelector.actor.set_x(0);
		Main.overview.viewSelector.actor.set_width(0);
		Main.overview.viewSelector.actor.queue_redraw();
	},

	_show: function() {
		// global.log("hide dash");
		Main.overview._dash.actor.show();
		Main.overview.viewSelector.actor.set_x(this.old_x);
		Main.overview.viewSelector.actor.set_width(this.old_width);
		Main.overview.viewSelector.actor.queue_redraw();
	}
});
