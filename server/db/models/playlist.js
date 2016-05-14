'use strict';

const db = require('../db');
const addArtistList = require('./plugins/addArtistList');
const DataTypes = db.Sequelize;

module.exports = db.define('playlist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set: function (val) {
      this.setDataValue('name', val.trim());
    }
  },
  artists: {
    type: DataTypes.VIRTUAL
  }
}, {
  scopes: {
    populated: () => ({ // function form lets us refer to undefined models
      include: [{
        model: db.model('song'),
        include: [{
          model: db.model('artist'),
        }]
      }]
    })
  },
  instanceMethods: {
    addArtistList: addArtistList
  },
  hooks: { // automatically adds an artist list if we have songs
    afterFind: function (queryResult) {
      if (!Array.isArray(queryResult)) queryResult = [queryResult];
      queryResult.forEach(item => item.addArtistList());
    }
  }
});
