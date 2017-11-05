import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr(),
  updatedAt: DS.attr(),
  title: DS.attr(),
  episodes: DS.hasMany('episode'),
});
