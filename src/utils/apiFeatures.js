

export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }


    pagination() {
        let page = this.queryString.page * 1 || 1
        if (page < 1) page = 1
        let limit = 5
        let skip = (page - 1) * limit
        this.mongooseQuery.find().skip(skip).limit(limit)
        this.page = page
        return this
    }


    filter() {
        const excludeQuery = ["page", "sort", "select", "search"]
        let queryString = { ...this.queryString }
        excludeQuery.forEach((e) => {
            delete queryString[e]
        })
        queryString = JSON.parse(JSON.stringify(queryString).replace(/(gt|gte|lt|lte)/, (m) => `$${m}`))
        this.mongooseQuery.find(queryString)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            this.mongooseQuery.find().sort(this.queryString.sort.replaceAll(",", " "))
        }
        return this
    }

    select() {
        if (this.queryString.select) {
            this.mongooseQuery.find().select(this.queryString.select.replaceAll(",", " "))
        }
        return this
    }

    search() {

        if (this.queryString.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.queryString.search, $options: "i" } },
                    { description: { $regex: this.queryString.search, $options: "i" } },
                ]
            })
        }
        return this
    }
}

