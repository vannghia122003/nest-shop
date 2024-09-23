import { IconChevronRight } from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet-async'
import { createSearchParams, Link, useLocation, useSearchParams } from 'react-router-dom'

import { postApi, tagApi } from '@/api'
import AutoPagination from '@/components/auto-pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import QUERY_KEY from '@/utils/query-key'
import { ITag } from '@/types/tag'

function BlogList() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tagName = searchParams.get('tag') ?? undefined
  const page = searchParams.get('page') ?? 1
  const { data: postsData } = useQuery({
    queryKey: [QUERY_KEY.POSTS, tagName, page],
    queryFn: () => postApi.getAllPosts({ limit: 6, searchBy: 'tags.name', search: tagName, page }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  })
  const { data: tagsData } = useQuery({
    queryKey: [QUERY_KEY.TAGS],
    queryFn: () => tagApi.getAllTags({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })
  const posts = postsData?.data.data
  const tags = tagsData?.data.data

  const handleFilterPostByTag = (tag: ITag) => {
    if (tagName === tag.name) {
      setSearchParams(createSearchParams({ page: String(1) }))
    } else {
      setSearchParams(createSearchParams({ tag: tag.name, page: String(1) }))
    }
  }

  return (
    <div className="py-8">
      <Helmet>
        <title>News | Nest Shop</title>
        <meta name="description" content="News" />
      </Helmet>

      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9">
            <h2 className="text-2xl font-medium">
              {tagName ? (
                <div>
                  Posts tagged as <span className="text-primary">"{tagName}"</span>
                </div>
              ) : (
                'Posts'
              )}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
              {posts?.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="h-[200px] shrink-0 md:h-auto md:w-[300px]">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="size-full object-cover"
                        />
                      </div>

                      <div className="flex grow items-center">
                        <div className="w-full">
                          <Link to={`/blogs/${post.id}`}>
                            <h3 className="line-clamp-2 break-words text-lg font-semibold">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="mt-2 line-clamp-3 break-words text-sm">
                            {post.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="border-none bg-primary/20"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                            </span>
                            <Button
                              asChild
                              variant="link"
                              className="hover:bg-primary/10"
                              rightSection={<IconChevronRight />}
                            >
                              <Link to={`/blogs/${post.id}`}>Read more</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {postsData && postsData.data.meta.totalPages > 0 && (
              <div className="mt-4">
                <AutoPagination
                  page={postsData.data.meta.currentPage}
                  pageSize={postsData.data.meta.totalPages}
                  pathname={location.pathname}
                  queryParams={{ tag: tagName }}
                />
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-span-3">
            <h2 className="border-b-4 border-primary/50 pb-2 text-2xl font-medium">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2 xs:gap-4">
              {tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={tagName === tag.name ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-1 text-sm"
                  onClick={() => handleFilterPostByTag(tag)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BlogList
