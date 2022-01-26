import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const providesList = (resultsWithIds, tagType) => {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
};

export const jokesApi = createApi({
  reducerPath: "jokesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3002/",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ order }) => {
        return `posts?_sort=id&_order=${order}`;
      },
      providesTags: (result) => providesList(result, "Post"),
    }),
    getOnePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    createPost: builder.mutation({
      query: ({ ...body }) => ({
        url: `posts`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetOnePostMutation,
  useUpdatePostMutation,
} = jokesApi;
