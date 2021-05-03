# NB HTML Template for ProcessWire Development

A package for building static code for later ProcessWire development, using [Gulp](https://gulpjs.com) for the build pipeline and [Handlebars](https://handlebarsjs.com/) for templating.

*Note: Terminal commands are given for `yarn` but `npm` equivalents should also work.*

## Installation

	yarn init

Rename the package, and set the version to 1.0.0.

	yarn install

This will install all dependencies and prepare the package for use.

## Development
First run:

	yarn build

This will copy the `uikit.min.js` file into the `js` folder. It will also copy assets into the `dist` folder.

If you need to run this task again run:

	yarn reset && yarn build

This will reset the project before it is built again.

To start development, run:

	yarn dev

This will start watching the files, and boot the server at http://localhost:8080.

### UIkit Themeing
A custom UIkit theme is created based on the variables/mixins in the files in `src/scss/abstracts/`.

For small projects, tweaking the colour and typography variables in `src/scss/abstracts/_variables.scss` may be enough.

For most projects, you will also want to directly customise the theme using the UIkit variables themselves. These are in `src/scss/abstracts/uikit/_variables.scss`. You can add variables that are used in other UIkit components too - these will override UIkit's defaults.

If you need to significantly change the styling of a UIkit component, you need to add a file in the `uikit` folder containing mixin hooks that extend/override the component.

There are a few empty files there already. These do not need to be used, they are just the most common components that are extended. If you create a brand new file, make sure it is included at the bottom of `src/scss/abstracts/_mixins.scss`.

No SCSS that will be used elsewhere in the main theme should be placed in the `uikit` folder, it is only for the UIkit theme.

See https://github.com/uikit/uikit/tree/develop/src/scss for more information on the above and https://getuikit.com/docs/sass for more information on UIkit themeing in general.

### Creating a Template
To create a new template run:

	yarn cf -t template-name

This will create a new Handlebars template in `src/html` and a JSON file in `src/html/data` using the name you have specified.

### Creating a Component
To create a new component run:

	yarn cf -c component-name

This will create a new Handlebars partial in `src/html/partials/components`, and a new SCSS file in `src/scss/components` with the name you have specified. It will also add the **@import** statement to `main.scss`.

*Note: `-m` will also work*

### Removing a Template
You may not need a template anymore. To remove it, run:

	yarn rf -t template-name

This will remove the Handlebars template.

### Removing a Component
If you no longer require a component, run

	yarn rf -c component-name

If the name matches (beware of hyphen vs camel case in existing components), it will remove both the Handlebars partial and the SCSS file, and also remove the **@import** statement from `main.scss`.

## Handlebars

### Data
A range of data is passed to Handlebars:

* `src/html/data/index.json` - site-wide data including:
	* `nb` - A couple of site-wide variables - the name of the site and the legal name of the client (for the copyright text). These map to the variables used in ProcessWire development. Additional variables could include `clientTel`, `clientEmail` and `clientAddress`.
	* `ukContainer` - The default `.uk-container` size used by the site.
	* `cta` - The default 'Call to Action' text.
	* `menu` - An array of title/name objects that defines the site menu.
	* `social` - An array of social media data.
	* `legal` - These should not need to be changed, as these are standard on all projects.
	* `items` - arrays of items to be rendered on the site.
* A number of variables are generated based on the template name, and passed to `page` e.g. `page.name` (see `build/tasks/html.js`).
* These variables can be overwritten and/or extended by a `[template-name].json` file in `src/html/data`.
* A few helpers (see `build/tasks/html.js`).

### Partials
Where possible, the provided partials should be used (and can be edited where necessary).

## Linting
ESlint and Sasslint are enabled in this package, but in different ways. ESlint should be enabled in your code editor, whereas Sasslint is run while SCSS files are being watched.

*Note: .eslintignore does not appear to work!*

## Release
When the project is complete, run:

	yarn release

This will reset the project and build everything again, and will also run:

	yarn pw

which prepares files for ProcessWire development.
