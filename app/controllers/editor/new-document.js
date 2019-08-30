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
