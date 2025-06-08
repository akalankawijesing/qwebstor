import { defineField, defineType } from "sanity";

export const promotionCode = defineType({
  name: "promotionCode",
  title: "Promotion Code",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: "discountPresentage",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.max(100).min(0).required(),
    }),
    defineField({
        name: "expirationDate",
        title: "Expiration Date",
        type: "date",
        validation: (Rule) => Rule.required(),
    }),
  ],
});
 