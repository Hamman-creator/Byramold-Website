import {defineField, defineType} from 'sanity'

export const insightType = defineType({
  name: 'insight',
  title: 'Insights',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description:
        'The URL-friendly version of the article title. Click Generate after entering the title.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Agriculture', value: 'agriculture'},
          {title: 'Investment', value: 'investment'},
          {title: 'Business', value: 'business'},
          {title: 'Technology', value: 'technology'},
          {title: 'Partnerships', value: 'partnerships'},
          {title: 'Company Updates', value: 'company'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description:
        'Main image displayed on the Insights page and at the top of the article.',
      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description:
            'Briefly describe the image for accessibility and search engines.',
          validation: (rule) => rule.required(),
        }),
      ],

      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'summary',
      title: 'Article Summary',
      type: 'text',
      rows: 4,
      description:
        'A short summary displayed on the Insights page and article cards.',
      validation: (rule) => rule.required().max(300),
    }),

    defineField({
      name: 'body',
      title: 'Article Content',
      type: 'array',

      of: [
        {
          type: 'block',

          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],

          lists: [
            {title: 'Bullet List', value: 'bullet'},
            {title: 'Numbered List', value: 'number'},
          ],

          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],

            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',

                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',

                    validation: (rule) =>
                      rule.uri({
                        scheme: ['http', 'https', 'mailto'],
                      }),
                  },
                ],
              },
            ],
          },
        },

        {
          type: 'image',
          options: {
            hotspot: true,
          },

          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            },

            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],

      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Byramold Investments Ltd',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'featured',
      title: 'Featured Insight',
      type: 'boolean',
      description:
        'Turn this on if you want this article displayed as the featured article on the Insights page.',
      initialValue: false,
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description:
        'Optional title for search engines. If left empty, the article title will be used.',
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description:
        'Short description intended for search engine results.',
      validation: (rule) => rule.max(160),
    }),
  ],

  orderings: [
    {
      title: 'Publication Date, Newest',
      name: 'publishedAtDesc',

      by: [
        {
          field: 'publishedAt',
          direction: 'desc',
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'featuredImage',
    },

    prepare({title, category, media}) {
      return {
        title,
        subtitle: category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : 'Uncategorized',
        media,
      }
    },
  },
})