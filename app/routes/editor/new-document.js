import Route from '@ember/routing/route';

export default Route.extend({

  model(){
    //The prefix and vocab attributes are defined here manually. You will always have to provide them to the editor.
    return `
    <h1>Hello World!</h1>
   `;
  }
});
