const modal = document.getElementById('modal');
const modalOpen = document.getElementById('open-modal');
const modalClose = document.getElementById('close-modal');
const form = document.querySelector('form');
const webSiteNameElement = document.getElementById('website-name');
const webSiteAddressElement = document.getElementById('website-address');
const bookMarksContainer = document.getElementById('bookmarks-container');
let bookMarks = new Array();

function openModal() {
	modal.classList.add('open-modal');
	webSiteNameElement.focus();
};

modalOpen.addEventListener('click', openModal);
modalClose.addEventListener('click', () => {modal.classList.remove('open-modal')});
window.addEventListener('click', event => {event.target === modal ? modal.classList.remove('open-modal') : null});

function validate(nameValue, addressValue) {
	const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	const regEx = new RegExp(expression);

	if (!nameValue || !addressValue) {
		alert('submit values for both fields');

		return false;
	} else if (!addressValue.match(regEx)) {
		alert('provide valid webSite address');

		return false;
	} else {
		return true;
	};
};

function buildBookMarks() {
	bookMarksContainer.textContent = '';

	bookMarks.forEach(bookMark => {
		const { name, address } = bookMark;

		const item = document.createElement('div');

		item.classList.add('item');

		const closeIcon = document.createElement('i');

		closeIcon.classList.add('fas', 'fa-times');
		closeIcon.setAttribute('title', 'delete bookMark');
		closeIcon.setAttribute('onclick', `deleteBookMark('${address}')`);

		const linkInformation = document.createElement('div');

		linkInformation.classList.add('name');

		const favicon = document.createElement('img');

		favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${address}`);
		favicon.setAttribute('alt', 'favicon');

		const link = document.createElement('a');

		link.setAttribute('href', `${address}`);
		link.setAttribute('target', '_blank');

		link.textContent = name;

		linkInformation.append(favicon, link);
		item.append(closeIcon, linkInformation);
		bookMarksContainer.appendChild(item);
	});
};

function fetchBookMarks() {
	if (localStorage.getItem('bookMarks')) {
		bookMarks = JSON.parse(localStorage.getItem('bookMarks'));
	} else {
		bookMarks = [
			{
				name: "Qur'ān",
				address: 'https://quran.com'
			},
			{
				name: 'BookMarker',
				address: 'https://book.marker'
			}
		];

		localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
	};

	buildBookMarks();
};

function deleteBookMark(address) {
	bookMarks.forEach((bookMark, i) => {
		if (bookMark.address === address) {
			bookMarks.splice(i, 1);
		};
	});
	localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
	fetchBookMarks();
};

function saveBookMark(event) {
	event.preventDefault();

	const nameValue = webSiteNameElement.value;
	let addressValue = webSiteAddressElement.value;

	if (!addressValue.includes('http://', 'https://')) {
		addressValue = `https://${addressValue}`;
	};

	if (!validate(nameValue, addressValue)) {
		return false;
	};

	const bookMark = {
		name: nameValue,
		address: addressValue
	};

	bookMarks.push(bookMark);
	localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
	fetchBookMarks();
	form.reset();
	webSiteNameElement.focus();
};

form.addEventListener('submit', saveBookMark);

fetchBookMarks();