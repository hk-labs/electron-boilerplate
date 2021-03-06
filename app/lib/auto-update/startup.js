//noinspection NpmUsedModulesInstalled
const {app} = require('electron');
const {spawn} = require('child_process');
const path = require('path');

/**
 * Squirrel events management (windows)
 */
function executeSquirrelCommand(args, done) {
  const updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  const child = spawn(updateDotExe, args, { detached: true });
  child.on('close', () => done());
}

function install(done) {
  const target = path.basename(process.execPath);
  executeSquirrelCommand(
    ['--createShortcut', target, ' --shortcut-locations=Desktop,StartMenu'],
    done
  );
}

function uninstall(done) {
  const target = path.basename(process.execPath);
  executeSquirrelCommand(['--removeShortcut', target], done);
}

/**
 * Squirrel events (only windows). Used to manage squirrel events (if any).
 * Always quit after that.
 */
function handleStartupEvent(callback) {
  const squirrelCommand = process.argv[1];

  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      install(app.quit);
      break;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      uninstall(app.quit);
      break;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      uninstall(app.quit);
      break;

    case '--squirrel-firstrun':
      // do something on windows first run
      app.quit();
      break;

    default:
      callback();
  }
}

module.exports = handleStartupEvent;
