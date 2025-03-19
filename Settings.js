export class SearchOption
{
	id = 0;

	name = '';

	url = '';

	enabled = false;

	multi = false;

	/**
	 *
	 * @param {Number} id
	 * @param {string} name
	 * @param {string} url
	 * @param {boolean} enabled
	 * @param {boolean} multi
	 */
	constructor(id, name, url, enabled = true, multi = true)
	{
		this.id = id;
		this.name = name;
		this.url = url;
		this.enabled = enabled;
		this.multi = multi;
	}
}

export class Settings
{
	/**
	 *
	 * @type {boolean}
	 */
	focus_tab = true;

	/**
	 *
	 * @type {SearchOption[]}
	 */
	menu = [];

	constructor(menu = null, multi = null, focus_tab = true)
	{
		this.menu = menu ?? this._defaultMenu();
		this.multi = multi ?? new SearchOption(-1, "ALL", "", true, true);
		this.focus_tab = focus_tab;
	}

	_defaultMenu()
	{
		return [
			new SearchOption(0, 'SauceNAO Search', 'https://saucenao.com/search.php?db=999&url='),
			new SearchOption(1, 'IQDB Search', 'https://iqdb.org/?url='),
			new SearchOption(2, 'TinEye Search', 'https://tineye.com/search/?url='),
			new SearchOption(3, 'Google Search', 'https://lens.google.com/uploadbyurl?url='),
			new SearchOption(10, 'Bing Search', 'https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIHMP&sbisrc=UrlPaste&q=imgurl:'),
			new SearchOption(4, 'Other Search 1', 'https://other-site-1', false, false),
			new SearchOption(5, 'Other Search 2', 'https://other-site-2', false, false),
			new SearchOption(6, 'Other Search 3', 'https://other-site-3', false, false),
			new SearchOption(7, 'Other Search 4', 'https://other-site-4', false, false),
			new SearchOption(8, 'Other Search 5', 'https://other-site-5', false, false),
			new SearchOption(9, 'Other Search 6', 'https://other-site-6', false, false),
		];
	}

	/**
	 *
	 * @param {Number} id
	 * @returns {SearchOption[]}
	 */
	getItems(id)
	{
		if (id === this.multi.id)
		{
			return this.menu.filter(x => x.enabled && x.multi);
		}

		return this.menu.filter(x => x.id === id);
	}

	contextMenuItem(item)
	{
		return {
			'title': item.name,
			'id': item.id.toString(),
			'contexts': ["image"],
		}
	}
}