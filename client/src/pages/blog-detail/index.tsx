import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { postApi, tagApi } from '@/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import QUERY_KEY from '@/utils/query-key'

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: postsData } = useQuery({
    queryKey: [QUERY_KEY.POSTS],
    queryFn: () => postApi.getAllPosts({ limit: 5, sortBy: 'createdAt:DESC' }),
    staleTime: 5 * 60 * 1000
  })
  const { data: postDetailData } = useQuery({
    queryKey: [QUERY_KEY.POST_DETAIL, id],
    queryFn: () => postApi.getPostById(Number(id!)),
    enabled: Boolean(id)
  })
  const { data: tagsData } = useQuery({
    queryKey: [QUERY_KEY.TAGS],
    queryFn: () => tagApi.getAllTags({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })
  const postList = postsData?.data.data
  const post = postDetailData?.data
  const tags = tagsData?.data.data

  if (!post) return null

  const handleFilterPostByTag = (tagName: string) => {
    navigate({ pathname: '/blogs', search: qs.stringify({ tag: tagName }) })
  }

  return (
    <div className="py-8">
      <Helmet>
        <title>{post.title} | Nest Shop</title>
        <meta name="description" content={post.title} />
      </Helmet>

      <div className="container">
        <div className="grid grid-cols-12 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-9">
            <time className="text-sm font-bold text-muted-foreground">
              {new Date(post.createdAt).toDateString()}
            </time>
            <h1 className="text-3xl font-semibold">{post.title}</h1>
            <div className="mt-4 flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.createdBy.avatar ?? ''} alt={post.createdBy.name} />
                <AvatarFallback>{post.createdBy.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">{post.createdBy.name}</span>
                <span className="text-sm font-medium text-primary">
                  {Math.ceil(post.readingTime)} min read
                </span>
              </div>
            </div>
            <div className="mt-6">
              <p className="mb-5">{post.description}</p>
              <img src={post.thumbnail} alt={post.title} className="size-full object-cover" />
            </div>
            <div
              className="prose mt-2 max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-8 flex flex-wrap gap-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="bg-primary/20">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="col-span-12 mt-8 lg:col-span-3 lg:mt-0">
            <div className="sticky top-[16px]">
              <div>
                <h2 className="border-b-4 border-primary/50 pb-2 text-xl font-medium">
                  Recent posts
                </h2>
                <div className="mt-3 flex flex-col gap-4">
                  {postList?.map((post) => (
                    <Link to={`/blogs/${post.id}`} key={post.id} className="group flex gap-2">
                      <div className="w-[120px] shrink-0 overflow-hidden rounded-md">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="size-full object-cover transition group-hover:scale-110"
                        />
                      </div>
                      <div className="grow">
                        <h3 className="line-clamp-2 text-sm font-medium">{post.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h2 className="border-b-4 border-primary/50 pb-2 text-xl font-medium">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-4">
                  {tags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer py-2 hover:bg-primary/20"
                      onClick={() => handleFilterPostByTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
