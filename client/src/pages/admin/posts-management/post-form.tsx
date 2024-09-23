import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { fileApi, postApi } from '@/api'
import tagApi from '@/api/tag-api'
import FormEditor from '@/components/form-input/form-editor'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormMultipleSelect from '@/components/form-input/form-multiple-select'
import FormText from '@/components/form-input/form-text'
import { Item } from '@/components/multiple-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ICreatePostBody } from '@/types/post'
import { handleUnprocessableEntityError } from '@/utils/helper'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).min(10),
  thumbnail: z.string().min(1, { message: 'Thumbnail is required' }).url(),
  content: z.string().min(1, { message: 'Content is required' }).min(100),
  description: z.string().trim().min(1, { message: 'Description is required' }).min(10),
  tagIds: z.array(z.number().int().positive())
})
type FormData = z.infer<typeof schema>

function PostForm() {
  const params = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updatingPostId = params.postId
  const [fileThumbnail, setFileThumbnail] = useState<File | null>(null)
  const [tags, setTags] = useState<Item[]>([])
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const createPostMutation = useMutation({ mutationFn: postApi.createPost })
  const updatePostMutation = useMutation({ mutationFn: postApi.updatePost })
  const { data: postData } = useQuery({
    queryKey: [QUERY_KEY.PRODUCT_DETAIL, updatingPostId],
    queryFn: () => postApi.getPostById(+updatingPostId!),
    enabled: Boolean(updatingPostId)
  })
  const { data: tagsData } = useQuery({
    queryKey: [QUERY_KEY.TAGS],
    queryFn: () => tagApi.getAllTags({ limit: -1 })
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      title: '',
      thumbnail: '',
      content: '',
      tagIds: []
    }
  })
  const isPending =
    uploadImageMutation.isPending || createPostMutation.isPending || updatePostMutation.isPending
  const thumbnail = form.watch('thumbnail')

  useEffect(() => {
    if (postData) {
      const tagIds = postData.data.tags.map((tag) => tag.id)
      form.setValue('title', postData.data.title)
      form.setValue('thumbnail', postData.data.thumbnail)
      form.setValue('content', postData.data.content)
      form.setValue('description', postData.data.description)
      form.setValue('tagIds', tagIds)
      setTags(
        tagsData?.data.data
          .filter((tag) => tagIds.includes(tag.id))
          .map((tag) => ({ label: tag.name, value: tag.id })) ?? []
      )
    }
  }, [form, postData, tagsData?.data.data])

  const handleChangeThumbnail = (files: File[], previews: string[]) => {
    setFileThumbnail(files[0])
    form.setValue('thumbnail', previews[0])
  }

  const handleSelectTag = (value: Item[]) => {
    setTags(value)
    form.setValue(
      'tagIds',
      value.map((item) => +item.value)
    )
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const body: ICreatePostBody = { ...data }
    try {
      if (fileThumbnail) {
        const formData = new FormData()
        formData.append('images', fileThumbnail)
        const res = await uploadImageMutation.mutateAsync(formData)
        body.thumbnail = res.data[0]
      }
      if (updatingPostId) {
        const res = await updatePostMutation.mutateAsync({ postId: +updatingPostId, body })
        toast.success(res.message)
      } else {
        const res = await createPostMutation.mutateAsync(body)
        toast.success(res.message)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.POSTS] })
      navigate(PATH.DASHBOARD_POST)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{updatingPostId ? 'Update post' : 'Create post'}</CardTitle>
        <CardDescription>
          {updatingPostId
            ? "Update post here. Click save when you're done."
            : "Create new post here. Click create when you're done."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormText form={form} name="title" label="Title" placeholder="Enter post title" />
              <FormMultipleSelect
                placeholder="Select tags..."
                form={form}
                name="tagIds"
                label="Tags"
                value={tags}
                options={tagsData?.data.data.map((tag) => ({ label: tag.name, value: tag.id }))}
                onSelect={handleSelectTag}
              />
              <FormFileUpload
                form={form}
                name="thumbnail"
                label="Thumbnail"
                value={[thumbnail]}
                onChange={handleChangeThumbnail}
              />
              <FormText
                form={form}
                type="textarea"
                name="description"
                label="Description"
                placeholder="Enter post description"
              />
              <FormEditor
                className="col-span-full"
                form={form}
                name="content"
                label="Content"
                placeholder="Enter post content"
              />
            </div>
            <Button type="submit" className="mt-5" loading={isPending} disabled={isPending}>
              {updatingPostId ? 'Save' : 'Create'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default PostForm
