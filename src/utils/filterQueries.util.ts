export class FilterQueries {
    constructor(public query, public queryString, public prejection = {}) {}

    filter() {
        const queryObject = { ...this.queryString }

        const fieldExclude = ['sort', 'filter', 'page', 'fields']

        fieldExclude.forEach((el) => delete queryObject[el])

        let queryStr = JSON.stringify(queryObject)
        
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|ne)\b/g, (match) => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr)).select(this.prejection)
    }
    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            const obj = {}
            const number = Number(sortBy[0])
            sortBy.forEach((field) => {
                obj[field] = number
            })

            delete obj[sortBy[0]]

            this.query.sort(obj)
            return this
        }
        return this
    }
    limitField() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query.select(fields)
            return this
        }
        return this
    }
    paginate() {
        const page = this.queryString.page || 1
        const limit = this.queryString.limit || 10
        const skip = limit * (page - 1)
        this.query.skip(skip).limit(limit)
        return this
    }
}