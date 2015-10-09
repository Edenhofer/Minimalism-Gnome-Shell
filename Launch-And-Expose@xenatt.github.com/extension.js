const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Main = imports.ui.main;
const Layout = imports.ui.layout;
const Overview = imports.ui.overview;
const overviewControls = imports.ui.overviewControls;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const panel = imports.ui.panel;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Icons in [extension folder]/img
const expose_iconPath = Me.path + '/img/windowslist.svg';
const launchpad_iconPath = Me.path + '/img/logo.svg';
let launchpad_button, expose_button, rb_index;

//I try to write code with New Lang({}) style but wont work.
function init() {
    init_launchpad();
    init_expose();
}

function enable() {
    enable_launchpad();
    enable_expose();
}

function disable() {
    disable_launchpad();
    disable_expose();

}

function init_expose() {
    expose_button = new St.Bin({ style_class: 'panel-button',
    reactive: true,
    can_focus: true,
    x_fill: true,
    y_fill: true,
    track_hover: true });
    let expose_icon = new St.Icon({
        gicon: Gio.icon_new_for_string(expose_iconPath),
        style_class: 'system-status-icon expose-icon'});
        // Add Class expose-icon for easy theme.
        expose_button.set_child(expose_icon);
        // Set icon size to 1.3 em.
        expose_button.connect('button-press-event', function(){
            if (!Main.overview.visible) {
                Main.overview.toggle();
            } else {
                if (Main.overview.viewSelector._showAppsButton.checked) {
                    Main.overview.viewSelector._showAppsButton.checked = false;
                } else {
                    Main.overview.toggle();
                }
            }
        });
    }

    function enable_expose() {
        rb_index = Main.panel._rightBox.get_children();
        Main.panel._rightBox.insert_child_at_index(expose_button, rb_index.length +1);
    }

    function disable_expose() {
        Main.panel._rightBox.remove_child(expose_button);
    }

    function init_launchpad() {
        launchpad_button = new St.Bin({ style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: true,
        track_hover: true });
        let launchpad_icon = new St.Icon({
            gicon: Gio.icon_new_for_string(launchpad_iconPath),
            // Add Class launchpad-icon for easy theme.
            style_class: 'system-status-icon launchpad-icon' });
            launchpad_button.set_child(launchpad_icon);
            // Set icon size to 1.3 em.
            launchpad_button.connect('button-press-event', function(){
                if (!Main.overview.visible) {
                    Main.overview.toggle();Main.overview.viewSelector._showAppsButton.checked = true;
                } else {
                    if (Main.overview.viewSelector._showAppsButton.checked) {
                        Main.overview.viewSelector._showAppsButton.checked = false;
                        Main.overview.toggle();
                    } else {
                        Main.overview.viewSelector._showAppsButton.checked = true;
                    }
                }
            });
        }

        function enable_launchpad() {
            Main.panel._leftBox.insert_child_at_index(launchpad_button, 0);
            activitiesButton = Main.panel.statusArea['activities'];
            activitiesButton.container.hide();
        }

        function disable_launchpad() {
            Main.panel._leftBox.remove_child(launchpad_button);
            activitiesButton.container.show();
        }
