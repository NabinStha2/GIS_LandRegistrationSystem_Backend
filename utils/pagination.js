const { SetErrorResponse } = require("./responseSetter.js");

// const getPaginatedData = async function ({ model, reqQuery, select = "+_id" }) {
//   try {
//     const {
//       query,
//       pagination,
//       populate,
//       lean,
//       sort = "-createdAt",
//       modFunction,
//     } = reqQuery;
//     let { limit, cursor, page } = reqQuery;

//     page = page ? parseInt(page) : 1;
//     cursor = cursor ? parseInt(cursor) : 0;
//     limit = limit ? parseInt(limit) : 10;

//     const results = pagination
//       ? await model
//           .find(query)
//           .sort(sort || "_id")
//           .skip(cursor)
//           .limit(limit + 1)
//           .populate(populate || "")
//           .select(select)
//           .lean(lean)
//       : await model
//           .find(query)
//           .sort(sort || "_id")
//           .populate(populate || "")
//           .select(select)
//           .lean(lean);

//     const getNewCursor = () => {
//       if (results.length === limit + 1) {
//         results.pop();
//         return cursor + limit;
//       }
//       return null;
//     };
//     const next = pagination ? getNewCursor() : null;
//     const previous = pagination ? cursor - limit : null;
//     const count = await model?.count();

//     return {
//       previous: pagination ? (previous < 0 ? null : previous) : null,
//       next,
//       count,
//       results: modFunction
//         ? await Promise.all(results.map(modFunction))
//         : results,
//     };
//   } catch (err) {
//     throw err;
//   }
// };

exports.getFuzzySearchPaginatedData = async function ({
  model,
  reqQuery,
  search,
  select = "+_id",
}) {
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
    return search
      ? getSearchDocuments({
          model: model,
          search: search,
          select: select,
          pagination,
          limit,
          page,
          cursor,
          sort,
          query,
          populate,
          modFunction: modFunction,
        })
      : getPaginatedDataCustom({
          model: model,
          reqQuery: {
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
          select: select,
        });
  } catch (err) {
    throw err;
  }
};

async function getSearchDocuments({
  model,
  search,
  select = "_id",
  limit,
  page,
  pagination,
  query,
  sort,
  cursor,
  populate,
  modFunction,
}) {
  try {
    page = page && page > 0 ? parseInt(page) : 1;
    limit = limit && limit > 0 ? parseInt(limit) : 25;
    const skipping = (page - 1) * limit;
    // cursor = cursor ? parseInt(cursor) : 0;

    if (!modFunction) {
      throw new SetErrorResponse(500, "Search needs mod function");
    }
    let results = await Promise.all(
      // await model
      //   .fuzzy(search)
      //   .skip(cursor)
      //   .limit(limit + 1)
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

    // const getNewCursor = () => {
    //   if (results.length === limit + 1) {
    //     results.pop();
    //     return cursor + limit;
    //   }
    //   return null;
    // };
    // const next = pagination ? getNewCursor() : null;
    // const previous = pagination ? cursor - limit : null;
    // const count = await model?.count(query);

    let res = await Promise.all(
      (
        await model.fuzzy(search)
      ).map(async (item) => {
        const modItem = await modFunction(item.document);
        return {
          ...modItem,
          _searchScore: item.similarity,
        };
      })
    );
    const count = res.filter((data) => {
      return data._searchScore >= 0.2 && !data.notSending;
    }).length;

    return {
      // previous: pagination ? (previous < 0 ? null : previous) : null,
      // next,
      count,
      totalPages: Math.ceil(count / limit),
      currentPageNumber: page,
      results,
    };
  } catch (err) {
    throw err;
  }
}

const getPaginatedDataCustom = async function ({
  model,
  reqQuery,
  select = "+_id",
}) {
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

    // let data = await Promise.all(
    //   results.filter((x) => {
    //     return false;
    //   })
    // );

    return {
      count,
      totalPages: Math.ceil(count / limit),
      currentPageNumber: page,
      results: modFunction
        ? (await Promise.all(results.map(modFunction))).filter(
            (data) => data != null
          )
        : results,
    };
  } catch (err) {
    throw err;
  }
};
