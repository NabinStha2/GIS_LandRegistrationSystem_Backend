const { SetErrorResponse } = require("./responseSetter");

const getPaginatedData = async function (model, reqQuery, select = "+_id") {
  try {
    const {
      query,
      pagination,

      populate,
      lean,
      sort = "-createdAt",
      modFunction,
    } = reqQuery;
    let { limit, cursor, page } = reqQuery;

    page = page ? parseInt(page) : 1;
    cursor = cursor ? parseInt(cursor) : 0;
    limit = limit ? parseInt(limit) : 10;

    const results = pagination
      ? await model
          .find(query)
          .sort(sort || "_id")
          .skip(cursor)
          .limit(limit + 1)
          .populate(populate || "")
          .select(select)
          .lean(lean)
      : await model
          .find(query)
          .sort(sort || "_id")
          .populate(populate || "")
          .select(select)
          .lean(lean);

    const getNewCursor = () => {
      if (results.length === limit + 1) {
        results.pop();
        return cursor + limit;
      }
      return null;
    };
    const next = pagination ? getNewCursor() : null;
    const previous = pagination ? cursor - limit : null;

    const count = await model?.count();
    return {
      previous: pagination ? (previous < 0 ? null : previous) : null,
      next,
      count,
      results: modFunction
        ? await Promise.all(results.map(modFunction))
        : results,
    };
  } catch (err) {
    throw err;
  }
};

const getPaginatedDataCustom = async function (
  model,
  reqQuery,
  select = "+_id"
) {
  try {
    const {
      query,
      pagination,
      populate,
      lean,
      sort = "-createdAt",
      modFunction,
    } = reqQuery;

    let { limit, page } = reqQuery;

    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 25;
    const skipping = (page - 1) * limit;

    const results = pagination
      ? await model
          .find(query)
          .sort(sort || "_id")
          .skip(skipping)
          .limit(limit)
          .populate(populate || "")
          .select(select)
          .lean(lean)
      : await model
          .find(query)
          .sort(sort || "_id")
          .populate(populate || "")
          .select(select)
          .lean(lean);

    const count = await model?.count(query);

    let data = await Promise.all(
      results.filter((x) => {
        return false;
      })
    );

    return {
      count,
      results: modFunction
        ? (await Promise.all(results.map(modFunction))).filter(
            (data) => data != null
          )
        : results,
      paginated: "paginated",
    };
  } catch (err) {
    throw err;
  }
};

exports.getFuzzySearchPaginatedData = async function (
  model,
  reqQuery,
  search,
  select = "+_id"
) {
  try {
    const {
      query,
      cursor,
      page,
      limit,
      pagination,
      populate,
      lean,
      sort,
      modFunction,
    } = reqQuery;
    console.log(`Search :: ${search}`);
    console.log(search ? "search" : "paginated");
    return search
      ? getSearchDocuments(
          model,
          search,
          select,
          { limit, page, sort, query, populate },
          modFunction
        )
      : getPaginatedDataCustom(
          model,
          {
            query,
            cursor,
            page,
            limit,
            pagination,
            populate,
            lean,
            sort,
            modFunction,
          },
          select
        );
  } catch (err) {
    throw err;
  }
};

async function getSearchDocuments(
  model,
  search,
  select = "_id",
  { limit, page, query },
  modFunction
) {
  try {
    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit && limit > 0 ? parseInt(limit) : 25;
    const skipping = (page - 1) * limit;

    if (!modFunction) {
      throw new SetErrorResponse(500, "Search needs mod function");
    }
    let results = await Promise.all(
      (
        await model.fuzzy(search).skip(skipping).limit(limit)
      ).map(async (item) => {
        const modItem = await modFunction(item.document);
        return {
          ...modItem,
          _searchScore: item.similarity,
        };
      })
    );

    results = results.filter((data) => {
      return data._searchScore >= 0.2 && !data.notSending;
    });
    const count = results?.length;

    return {
      count,
      results,
    };
  } catch (err) {
    throw err;
  }
}
