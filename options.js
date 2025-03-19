import { Settings } from './Settings.js';

/**
 *
 * @returns {Promise<Settings>}
 */
async function getSettings()
{
	const result = await chrome.storage.local.get(['settings']);
	const settings = result.settings;
	return Object.assign(new Settings(), settings ?? {});
}

/**
 *
 * @param {Settings} settings
 * @returns {Promise<void>}
 */
async function setSettings(settings)
{
	await chrome.storage.local.set({'settings': settings});
}

async function saveSettings()
{
	const settings = await getSettings();

	settings.focus_tab = document.getElementById('focus-tab').selectedIndex === 0;

	for (let item of settings.menu)
	{
		item.name = document.getElementById('option-name-' + item.id)?.value ?? item.name;
		item.url = document.getElementById('option-url-' + item.id)?.value ?? item.url;
		item.enabled = document.getElementById('option-enabled-' + item.id)?.checked ?? item.enabled;
		item.multi = document.getElementById('option-multi-' + item.id)?.checked ?? item.multi;
	}

	settings.multi.name = document.getElementById('option-name-' + settings.multi.name)?.value ?? settings.multi.name;
	settings.multi.enabled = document.getElementById('option-enabled-' + settings.multi.id)?.checked ?? settings.multi.enabled;

	await setSettings(settings);

	// Update status to let user know options were saved.
	const status = document.getElementById('status');
	status.innerHTML = 'Changes Applied...';
	setTimeout(function() {
		status.innerHTML = '';
	}, 750);
}

// Restores select box state to saved value from localStorage.
async function loadSettings()
{
	const settings = await getSettings();

	document.getElementById('focus-tab').selectedIndex = settings.focus_tab ? 0 : 1;

	for (let item of settings.menu)
	{
		document.getElementById('option-name-' + item.id).value = item.name;
		document.getElementById('option-url-' + item.id).value = item.url;
		document.getElementById('option-enabled-' + item.id).checked = item.enabled;
		document.getElementById('option-multi-' + item.id).checked = item.multi;
	}

	document.getElementById('option-name-' + settings.multi.id).value = settings.multi.name;
	document.getElementById('option-enabled-' + settings.multi.id).checked = settings.multi.enabled;
}

window.addEventListener('load', async function() {
	await loadSettings();

	document.getElementById('saveSettings').addEventListener('click', saveSettings);
	document.getElementById('loadSettings').addEventListener('click', loadSettings);
});