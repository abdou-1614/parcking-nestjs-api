export class FilterQueries {
    constructor(public query, public queryString, public projection = {}) {}
  
    filter() {
      const queryObject = { ...this.queryString };
      // ignore excluded fields from queryObject
      const fieldsToExclude = ['sort', 'limit', 'page', 'fields'];
      fieldsToExclude.forEach((el) => delete queryObject[el]);
  
      let queryStr = JSON.stringify(queryObject);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|ne)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr)).select(this.projection);
      return this;
    }
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query.sort(sortBy);
        return this;
      }
      return this;
    }
  
    limitField() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query.select(fields);
        return this;
      }
      return this;
    }
  
    paginate() {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 20;
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
      return this;
    }
  }