const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;
const Config = imports.misc.config;

function getShellVersion() {
	let version = 0;
	try {
		// e.g. GNOME 3.38.1 yields version 38
		version = Config.PACKAGE_VERSION.split(".").map(function(v) {return +v;})[1];
	} catch(error) {
		log('hide-dash | could not get shell version!');
	}
	return version;
};

// extension functions
function init() {
	return new dashVisible();
}

const dashVisible = new Lang.Class({
	Name: 'hideDash.dashVisible',

	_init: function() {
		this.observer = null;
		this.isNewVersion = false;

		// log('hide-dash init | shell version: ' + Config.PACKAGE_VERSION);
		let version = getShellVersion();
		if (version > 34) {
			this._dash = Main.overview.dash;
			this.isNewVersion = true;
		} else if (version == 34) {
			this._dash = Main.overview._dash;
			this.isNewVersion = true;
		} else {
			this._dash = Main.overview._dash;
		}

		// store the values we are going to override
		if (this.isNewVersion) {
			this.old_x = Main.overview.viewSelector.x;
			this.old_width = Main.overview.viewSelector.get_width();
		} else {
			this.old_x = Main.overview.viewSelector.actor.x;
			this.old_width = Main.overview.viewSelector.actor.get_width();
		}
		// log('hide-dash init | x: ' + this.old_x + ' | width: ' + this.old_width);
	},

	enable: function() {
		// log("hide-dash enable");
		this.observer = Main.overview.connect("showing", Lang.bind(this, this._hide));
	},

	disable: function() {
		// log("hide-dash disable");
		Main.overview.disconnect(this.observer);
		this._show();
	},

	_hide: function() {
		// log("hide-dash hide");
		if (this._dash) {
			if (this.isNewVersion) {
				this._dash.hide();
				Main.overview.viewSelector.set_x(0);
				Main.overview.viewSelector.set_width(0);
				Main.overview.viewSelector.queue_redraw();
			} else {
				this._dash.actor.hide();
				Main.overview.viewSelector.actor.set_x(0);
				Main.overview.viewSelector.actor.set_width(0);
				Main.overview.viewSelector.actor.queue_redraw();
			}
		}
	},

	_show: function() {
		// log("hide-dash show");
		if (this._dash) {
			if (this.isNewVersion) {
				this._dash.show();
				Main.overview.viewSelector.set_x(this.old_x);
				Main.overview.viewSelector.set_width(this.old_width);
				Main.overview.viewSelector.queue_redraw();
			} else {
				this._dash.actor.show();
				Main.overview.viewSelector.actor.set_x(this.old_x);
				Main.overview.viewSelector.actor.set_width(this.old_width);
				Main.overview.viewSelector.actor.queue_redraw();
			}
		}
	}
});
