class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // console.log(this);
  }

  filter() {
    // 1 filtering

    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'field', 'limit'];

    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, req.query);

    // 2 advance filtering

    let querystr = JSON.stringify(queryObj);
    querystr = JSON.parse(
      querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    // console.log(JSON.parse(querystr));
    this.query = this.query.find(querystr);

    return this;
  }

  sort() {
    // SORTING

    if (this.queryString.sort) {
      // console.log(this.filter.queryString.sort);
      const sortby = this.queryString.sort.split(',').join(' ');
      // console.log(sortby);
      this.query = this.query.sort(sortby); //SORT
    } else {
      this.query = this.query.sort('-price');
    }
    return this;
  }

  limitField() {
    // 3 FIELDS LIMITING

    if (this.queryString.field) {
      console.log(this.queryString.field);
      const fields = this.queryString.field.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields); //SELECT
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // 4 PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limits = this.queryString.limit * 1 || 100;
    const skipd = (page - 1) * limits;
    this.query = this.query.skip(skipd).limit(limits); //SKIP LIMIT

    return this;
  }
}

module.exports = APIFeatures;
