'use client'

import { CyberMutationCrud } from '@/features/admin/cyber-mutation-crud'
import { blogCrudUi } from '@/features/admin/cyber-crud-ui'
import { adminClient } from '@/lib/api'

export default function AdminBlogPage() {
  return (
    <CyberMutationCrud
      moduleTag="ARTICLES_CMS"
      secCode="SEC_TECHNICAL_DISPATCHES"
      listKey="blog"
      titleKey="title"
      subtitleKey="slug"
      cloneSuffixKey="title"
      ui={blogCrudUi}
      fields={[
        { key: 'title', label: 'Title', dockLabel: '01 // DISPATCH_TITLE', span: 2 },
        { key: 'slug', label: 'Slug', dockLabel: '02 // SLUG / CANONICAL URL', span: 2 },
        { key: 'excerpt', label: 'Excerpt', dockLabel: '05 // EXCERPT_SYNOPSIS', type: 'textarea', span: 2 },
        {
          key: 'content',
          label: 'Content',
          dockLabel: '06 // MARKDOWN_BODY',
          type: 'textarea',
          span: 2,
        },
      ]}
      list={() => adminClient.listBlogPosts()}
      create={(body) =>
        adminClient.createBlogPost({
          body: {
            ...body,
            coverImageUrl: null,
            publishedAt: new Date().toISOString(),
          } as never,
        })
      }
      update={(id, body) =>
        adminClient.updateBlogPost({
          params: { id },
          body: {
            ...body,
            coverImageUrl: null,
            publishedAt: new Date().toISOString(),
          } as never,
        })
      }
      remove={(id) => adminClient.deleteBlogPost({ params: { id } })}
    />
  )
}
