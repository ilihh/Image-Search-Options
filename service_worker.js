import { Settings } from './Settings.js';

/**
 *
 * @returns {Promise<Settings>}
 */
async function getSettings()
{
	const result = await chrome.storage.local.get(['settings']);
	const settings = result.settings ?? {};
	return Object.assign(new Settings(), settings ?? {});
}

async function doSearch(info, tab)
{
	const src = info.srcUrl;

	if (src.indexOf('data:') === 0)
	{
		// incompatible
		alert('Not Compatible With Data URIs');
		return true;
	}

	const settings = await getSettings();
	const id = parseInt(info.menuItemId);
	for (const item of settings.getItems(id))
	{
		const url = item.url + encodeURIComponent(src);
		chrome.tabs.create({ url: url, active: settings.focus_tab });
	}

	return true;
}

async function createMenu()
{
	const settings = await getSettings();

	chrome.contextMenus.removeAll();

	for (const item of settings.menu)
	{
		if (item.enabled)
		{
			chrome.contextMenus.create(settings.contextMenuItem(item));
		}
	}

	if (settings.multi.enabled)
	{
		chrome.contextMenus.create(settings.contextMenuItem(settings.multi));
	}
}

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName !== 'local')
	{
		return;
	}

	createMenu();
});
chrome.runtime.onInstalled.addListener(createMenu);
chrome.runtime.onStartup.addListener(createMenu);
chrome.contextMenus.onClicked.addListener(doSearch);