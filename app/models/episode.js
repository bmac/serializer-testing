import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr(),
  updatedAt: DS.attr(),
  title: DS.attr(),
  duration: DS.attr(),
  image: DS.attr(),
  enclosureUrl: DS.attr(),
  podcast: DS.belongsTo('podcast'),
});
