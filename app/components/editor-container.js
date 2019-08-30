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
