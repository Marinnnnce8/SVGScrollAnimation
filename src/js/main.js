/**
 * Main JS
 *
 * @copyright 2021 NB Communication Ltd
 *
 */

const main = {

	init: () => {

		nb.profilerStart('main.init');

		main.drawSVGs();

		// Content
		const blocks = uk.$$('.content');
		if (blocks.length) {

			blocks.forEach((block) => {

				// Apply UIkit table component
				uk.$$('table', block).forEach((el) => {
					uk.addClass(el, 'uk-table');
					uk.wrapAll(el, '<div class="uk-overflow-auto">');
				});

				// Inline Images UIkit Lightbox/Scrollspy
				(uk.$$('a[href]', block).filter((a) => {
					return uk.attr(a, 'href').match(/\.(jpg|jpeg|png|gif|webp)/i);
				})).forEach((a) => {

					const figure = a.parentElement;
					if (figure.nodeName !== 'FIGURE') {
						uk.wrapAll(a, '<figure>');
						figure = a.parentElement;
					}

					const img = uk.$('img', a);
					if (uk.hasAttr(img, 'class')) {
						uk.addClass(figure, uk.attr(img, 'class'));
						uk.removeAttr(img, 'class');
					}

					const caption = uk.$('figcaption', figure);

					// uk-lightbox
					uk.attr(figure, 'data-uk-lightbox', 'animation: fade');
					if (caption) uk.attr(a, 'data-caption', nb.wrap(uk.html(caption), 'div'));
				});
			});
		}

		main.mmenu();

		nb.profilerStop('main.init');
	},

	mmenu: () => {

		const el = uk.$('#mmenu');
		if (!el) return;

		const menu = new Mmenu(el,
			{
				extensions: [
					'border-full',
					'fullscreen',
					'position-front',
				],
			},
			{
				classNames: {
					selected: 'uk-active'
				},
				transitionDuration: 256
			}
		);

		uk.removeClass(el, 'uk-hidden');

		const toggle = uk.$('.uk-navbar-toggle');
		if (toggle) {

			const toggleIcons = uk.$$('span', toggle);
			const toggler = (open) => {
				uk[`${open ? 'add' : 'remove'}Class`](toggle, 'uk-open');
				uk.addClass(toggleIcons[open ? 0 : 1], 'uk-hidden');
				uk.removeClass(toggleIcons[open ? 1 : 0], 'uk-hidden');
			};

			menu.API.bind('close:start', () => toggler(false));
			uk.on(toggle, 'click', () => toggler(!uk.hasClass(this, 'uk-open')));
		}
	},

	pathPrepare: (obj) => {
		console.log(obj.getTotalLength());
		const lineLength = obj.getTotalLength();
		obj.style.strokeDasharray = lineLength;
		obj.style.strokeDashoffset = lineLength;
		// obj.css('stroke-dasharray', lineLength);
		// obj.css('stroke-dashoffset', lineLength);
	},

	drawSVGs: () => {

		const word = document.getElementById('word');
		const dot = document.getElementById('dot');

		// prepare SVG
		main.pathPrepare(word);
		main.pathPrepare(dot);

		// init controller
		const controller = new ScrollMagic.Controller();

		// build tween
		const tween = new TimelineMax()
			.add(TweenMax.to(word, 0.9, { strokeDashoffset: 0, ease: Linear.easeNone })) // draw word for 0.9
			.add(TweenMax.to(dot, 0.1, { strokeDashoffset: 0, ease: Linear.easeNone }))  // draw dot for 0.1
			.add(TweenMax.to('path', 1, { stroke: '#33629c', ease: Linear.easeNone }), 0);			// change color during the whole thing

		// build scene
		const scene = new ScrollMagic.Scene({ triggerElement: '#trigger1', duration: 200, tweenChanges: true })
			.setTween(tween)
			.addIndicators() // add indicators (requires plugin)
			.addTo(controller);
	}
};

uk.ready(() => main.init());
