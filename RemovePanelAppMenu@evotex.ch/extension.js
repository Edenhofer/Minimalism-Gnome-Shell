/**
* Desc: this extension removes the App Menu (the one next to the "Activities" button)
*       from the Panel
*
* Author: Gabriel Rossetti
* Date: 2013-02-27
* Version: 1.4
*/
const Panel = imports.ui.main.panel;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

/**
* Initialize the extension
*/
function init() {}

/**
* Enable the extension
*/
function enable() {
	let value = GLib.Variant.new('a{sv}', { 'Gtk/ShellShowsAppMenu': GLib.Variant.new('i', 0) });
	let xsetting = new Gio.Settings({ schema: 'org.gnome.settings-daemon.plugins.xsettings' });
	xsetting.set_value('overrides', value);

	Panel._leftBox.get_child_at_index(1).hide();
}

/**
* Disable the extension
*/
function disable() {
	Panel._leftBox.get_child_at_index(1).show();

	let value = GLib.Variant.new('a{sv}', { 'Gtk/ShellShowsAppMenu': GLib.Variant.new('i', 1) });
	let xsetting = new Gio.Settings({ schema: 'org.gnome.settings-daemon.plugins.xsettings' });
	xsetting.set_value('overrides', value);
}
