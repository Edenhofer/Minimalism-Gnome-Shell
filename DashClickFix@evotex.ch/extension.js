/**
* Desc: this extension "fixes" the dash's default behavior when you
*       click on an icon. The defualt is to launch the app if none is
*       running and to switch to the current instance if it is already
*       running. This extension changes that to instead of switching to
*       it if it is already running it always launches a new instance.
*       It also always open a new window when launching applications
*       from the Overview Search when typing the application name and
*       pressing ENTER (rather than using the mouse).
*
* Author: Gabriel Rossetti
* Author: Rich Sedman
* Date: 2012-07-15
* Version: 2.0
*/
const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const Params = imports.misc.params;

var _onActivateOriginal = null;
var _activateResultOriginal = null;

/**
* The new version of the function, this always lanches a new version of
* the app regardless of if it is already running or not.
*
* @param event the current event
*/
function _onActivate(event) {
	this.emit('launching');

	if (this._onActivateOverride) {
		this._onActivateOverride(event);
	} else {
		this.app.open_new_window(-1);
	}
	Main.overview.hide();
}

/**
* The new version of the function, this always lanches a new version of
* the app from the Overviwe Search typing the application name and
* pressing ENTER; regardless of if it is already running or not.
*
* @param app the app that will be lanched
* @param params the app's launch parameters
*/
function _activateResult(app, params) {
	params = Params.parse(params, { workspace: -1, timestamp: 0 });
	app.open_new_window(params.workspace);
}

/**
* Initialize the extension
*/
function init() {
	_onActivateOriginal = AppDisplay.AppWellIcon.prototype._onActivate;
	_activateResultOriginal = AppDisplay.AppSearchProvider.prototype.activateResult;
}

/**
* Enable the extension
*/
function enable() {
	AppDisplay.AppWellIcon.prototype._onActivate = _onActivate;
	AppDisplay.AppSearchProvider.prototype.activateResult = _activateResult;
}

/**
* Disable the extension
*/
function disable() {
	AppDisplay.AppWellIcon.prototype._onActivate = _onActivateOriginal;
	AppDisplay.AppSearchProvider.prototype.activateResult = _activateResultOriginal;
}
