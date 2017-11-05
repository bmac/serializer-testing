import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Ember from 'ember'
const { get } = Ember

class FakeSnapshot {
  constructor(owner, modelName, description) {
    this.owner = owner;
    this.type = owner.factoryFor('model:' + modelName).class;
    this.description = description;
    this.id = description.id;
    this.modelName = modelName;
  }

  eachAttribute(callback, binding) {
    this.type.eachAttribute(callback.bind(binding));
  }

  eachRelationship(callback, binding) {
    this.type.eachRelationship(callback.bind(binding));
  }

  attr(key) {
    return this.description[key];
  }

  belongsTo(key) {
    let modelName = get(this.type, 'relationshipsByName').get(key).type
    return new FakeSnapshot(this.owner, modelName, this.description[key]);
  }

  has(key) {
    return !!this.description[key];
  }
}

module('Unit | Serializer | application', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.createSnapshot = function(type, description) {
      return new FakeSnapshot(this.owner, type, description)
    }
  })

  test('serializeIntoHash', function(assert) {
    let serializer = this.owner.lookup('serializer:application');

    let data = {};

    let snapshot = this.createSnapshot('episode', {
      id: 1,
      createdAt: 1489550400000,
      updatedAt: 1489550400000,
      title: '087: The JSON API and Orbit.js with Dan Gebhardt',
      duration: '45 Minutes',
      image: 'https://example.com/image.svg',
      enclosureUrl: 'https://example.com/audio.mp3',
      podcast: {
        id: 2,
        createdAt: 1489550400000,
        updatedAt: 1489550400000,
        title: '087: The JSON API and Orbit.js with Dan Gebhardt',
      }
    })

    serializer.serializeIntoHash(data, 'episode', snapshot, { includeId: true });

    assert.deepEqual(data, {
      "data": {
        "attributes": {
          "created-at": 1489550400000,
          "duration": "45 Minutes",
          "enclosure-url": "https://example.com/audio.mp3",
          "image": "https://example.com/image.svg",
          "title": "087: The JSON API and Orbit.js with Dan Gebhardt",
          "updated-at": 1489550400000
        },
        "id": 1,
        "relationships": {
          "podcast": {
            "data": {
              "id": 2,
              "type": "podcasts"
            }
          }
        },
        "type": "episodes"
      }
    });
  });



  // serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

  // let normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);


  // normalize
  // serialize
});
