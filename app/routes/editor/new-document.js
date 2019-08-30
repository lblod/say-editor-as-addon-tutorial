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
