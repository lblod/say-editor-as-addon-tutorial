# Tutorial: Adding say-editor to your Ember.js app.
This section covers the basics on how to add say-editor as an add-on to an Ember app. The editor will implement one plugin, the `@lblod/ember-rdfa-editor-template-variables-manager-plugin`.
This howto should cover the basics to get you started.

## Setting up the editor
To install the add-on run:
 ```ember install @lblod/ember-rdfa-editor```.

Before proceeding, you'll have to create come additional configuration files manually.
```
# In the root folder of your Ember.js app.
mkdir app/config;
touch app/config/editor-document-default-context.js
 ```
In this file, add the following content:
```
const defaultContext = {
  vocab: 'http://data.vlaanderen.be/ns/besluit#',
  prefix: {
    eli: 'http://data.europa.eu/eli/ontology#',
    prov: 'http://www.w3.org/ns/prov#',
    mandaat: 'http://data.vlaanderen.be/ns/mandaat#',
    besluit: 'http://data.vlaanderen.be/ns/besluit#',
    ext: 'http://mu.semte.ch/vocabularies/ext/',
    person: 'http://www.w3.org/ns/person#',
    persoon: 'http://data.vlaanderen.be/ns/persoon#'
    // Default prefixes will evolve over time, depending on the plugins you install.
    // You need to update this file manually.
  }
};

export default JSON.stringify(defaultContext);
```
Here, we define some default vocabularies and prefixes, so you don't need to write the full URI's. At the time of writing,  this file needs to be updated manually. When adding new plugins, always make sure the prefixes are correctly defined.
For now, the provided configuration covers most existing plugins.

Next, we need an additional configuration file.
```
# In the root folder of your Ember.js app.
touch app/config/editor-profiles.js
```
Add the following content:

```
export default {
 all: [
   // This list will contain the plugins you want to run for the 'all' profile.
 ],
  /*  An additional profile may be added,  e.g.
     adminUser: [
      // List of plugins useful for an administrator.
     ]
  */
};
```
This file will be updated when you install plugins. The editor-profiles.js allows you to run different variations of the editor within the same app.

Before proceeding with the installation of our first plugin, let's first make sure the editor is working.

The next steps will seem a little cumbersome, and we're currently working hard to make it easier. For now, we'll have to deal with it. Make sure you check the updates of [rdfa-editor](https://github.com/lblod/ember-rdfa-editor) regularly, as these will probably become obsolete soon.

Create a component called editor-container:
```ember g component editor-container```

Add the following content in the editor-conainer.js
```
import Component from '@ember/component';
import defaultContext from '../config/editor-document-default-context';

export default Component.extend({
  isReady: false,

  setRdfaContext(element){
    element.setAttribute('vocab', JSON.parse(defaultContext)['vocab']);
    element.setAttribute('prefix', this.prefixToAttrString(JSON.parse(defaultContext)['prefix']));
    element.setAttribute('typeof', 'foaf:Document');
    element.setAttribute('resource', '#');
  },

  prefixToAttrString(prefix){
    let attrString = '';
    Object.keys(prefix).forEach(key => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  },

  didInsertElement() {
    this._super(...arguments);
    this.setRdfaContext(this.element);
    this.set('isReady', true);
  }
});
```
Add in `editor-container.hbs`:
```
{{#if this.isReady}}
  {{yield}}
{{/if}}
```
This should end the cumbersome part. Be aware that that you'll have to save the context separately when storing the document.

New, we create a route called `editor/new-document`.  Then we add the component in the associated template like:
```
{{#editor-container}}
  {{rdfa-editor class="rdfa-editor"
    profile="all"
    value=model
    rdfaEditorInit=(action "handleRdfaEditorInit")}}
{{/editor-container}}
 ```
Some explanations might help here:
* The `profile="all"` property, means we'll use the "all" profile defined in app/config/editor-profiles.js. (Remember, this file is still empty so no plugin run at this stage.)
* `value=model` contains an HTML-string, which we will define next. This string is rendered in the editor container.
* `rdfaEditorInit=(action "handleRdfaEditorInit")`, when the editor is all setup, the rdfaEditorInit is called with the editor object as a parameter. This object is your main interface to interact with the content.

Next, we create a controller for `editor/new-document` and add:
```
import Controller from '@ember/controller';

export default Controller.extend({
  editor: null,
  actions: {
    handleRdfaEditorInit(editor){
      if(editor)
        this.set('editor', editor);
    }
  }
});
```
We set the editor as a property of our controller. As stated, this provides the main interface to interact with the document.  Refer to editor-api documentation for more information about this.

In the route  `editor/new-document`, we add:
```
import Route from '@ember/routing/route';

export default Route.extend({

  model(){
    return `
    <h1>Hello World!</h1>
   `;
  }
});
```
Now, when navigating to `editor/new-document`, you should see an editor and be able to type.

## Installing the first plugin

Let's have some fun and install our first plugin:

```
ember install @lblod/ember-rdfa-editor-template-variables-manager-plugin
```

This plugin adds variable management to your document. With this plugin, you can define some locations in your document, where the content should be kept in sync. Refer to the [docs](https://github.com/lblod/ember-rdfa-editor-template-variables-manager-plugin) for more information about this.

Update `app/config/editor-profiles.js` with the following content:
```
export default {
  all: [
    "rdfa-editor-template-variables-manager-plugin"
   // This list will contain the plugins you want to run for the 'all' profile.
 ],
  /*  An additional profile may be added,  e.g.
     adminUser: [
      // List of plugins useful for an administrator.
     ]
  */
};
```
This means the plugin will be availbile for the 'all' profile.

Some styling  is required as well, for now update `app/styles/app.css` to:
```
.ext_metadata{
  user-select: none;
  display: none;
}
.ext_variable {
  user-select: none;
  display: none;
}
```
Finally, update the the route `editor/new-document` to:
```
import Route from '@ember/routing/route';

export default Route.extend({

  model(){
    //The prefix and vocab attributes are defined here manually. You will always have to provide them to the editor.
    return `
    <h1>The variables plugin is working!</h1>

    <div class="ext_variable" typeof="ext:Variable" resource="http://variables/a/random-uri/1">
      <div property="ext:idInSnippet" content="instance-variable-1">instance-variable-1</div>
      <div property="ext:intentionUri" content="http://variables/@work">http://variables/@work</div>
      <div property="ext:variableState" content="initialized">initialized</div>
    </div>
    <div id="instance-variable-1">
        When modifying this text, you will see it changing in another section!
    </div>

    <h2>Another section in the text</h2>

    <div class="ext_variable" typeof="ext:Variable" resource="http://variables/a/random-uri/2">
      <div property="ext:idInSnippet" content="instance-variable-2">instance-variable-2</div>
      <div property="ext:intentionUri" content="http://variables/@work">http://variables/@work</div>
      <div property="ext:variableState" content="initialized">initialized</div>
    </div>
    <div>
    <div id="instance-variable-2">
        When modifying this text, you will see it changing in another section!
    </div>
   `;
  }
});
```
We'll leave tidbits of the HTML context for what it is, please refer to the [documentation of the plugin ](https://github.com/lblod/ember-rdfa-editor-template-variables-manager-plugin) for all required info.

Now navigate to you your route, and have some fun!

# Running the tutorial
## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd say-editor-as-addon-tutorial`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
