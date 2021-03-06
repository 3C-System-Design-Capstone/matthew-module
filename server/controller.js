const Sequelize = require('sequelize');
const { Comments, Products } = require('../database/models');
const sizeof = require('object-sizeof');
const { Op } = Sequelize;
const redis = require('../database/redis/index');

const queryParamsHandler = (req, res) => {
  const { id } = req.params;
  const { type, limit, filters } = req.query;
  let field;
  let queryObj;
  if (type === 'relevant') {
    field = 'user';
  } else if (type === 'helpfulButton') {
    field = 'yesRating';
  } else if (type === 'newest') {
    field = 'date';
  }

  if (filters !== '[]') {
    queryObj = { prodRating: { [Op.or]: JSON.parse(filters) }, prodId: id };
  } else {
    queryObj = { prodId: id };
  }

  Comments.findAll({
    order: [[`${field}`, 'DESC']],
    limit: parseInt(limit, 10),
    where: queryObj,
    benchmark: true,
  })
    .then((result) => {
      redis.set(req.originalUrl, JSON.stringify(result));
      res.status(200).send(result);
    })
    .catch((err) => {
      res.send(err);
    });
}

module.exports = {
  get: (req, res) => {
    let areQueryParams = Object.keys(req.query).length > 0;
    if (areQueryParams) {
      queryParamsHandler(req, res);
    } else {
      const { id } = req.params;
      Comments.findAll({ where: { id } })
        .then((result) => {
          redis.set(req.originalUrl, JSON.stringify(result));
          res.status(200).send(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  post: (req, res) => {
    // const {
    //   user,
    //   prodRating,
    //   yesRating,
    //   noRating,
    //   date,
    //   body,
    //   verified,
    //   recommend,
    //   size,
    //   width,
    //   comfort,
    //   quality,
    //   response,
    //   header,
    // } = req.data;

    // const prodId = req.params;

    // Comments.create({
    //   user,
    //   prodRating,
    //   yesRating,
    //   noRating,
    //   date,
    //   body,
    //   verified,
    //   recommend,
    //   size,
    //   width,
    //   comfort,
    //   quality,
    //   response,
    //   prodId,
    //   header,
    // }, (err, data) => {
    //   if (err) {
    //     res.send(err);
    //   } else {
    //     res.send(data);
    //   }
    // });
  },
};